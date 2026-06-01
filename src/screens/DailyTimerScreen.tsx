import { Settings2, Shuffle, Users } from "lucide-react";
import { useState } from "react";
import { AddParticipantForm } from "#/components/shared/AddParticipantForm";
import { MeetingControls } from "#/components/shared/MeetingControls";
import { ParticipantCard } from "#/components/shared/ParticipantCard";
import { TimerDisplay } from "#/components/shared/TimerDisplay";
import { useMeeting } from "#/hooks/useMeeting";
import { cn } from "#/lib/utils";
import { saveSettings } from "#/persistence/settings/repository";

export function DailyTimerScreen() {
	const {
		participants,
		activeParticipants,
		currentParticipant,
		currentIndex,
		loading,
		durationSeconds,
		setDurationSeconds,
		timer,
		addParticipant,
		remove,
		toggleDisabled,
		shuffle,
		next,
		reset,
	} = useMeeting();

	const [showSettings, setShowSettings] = useState(false);
	const [draftDuration, setDraftDuration] = useState(durationSeconds);

	async function handleSaveDuration() {
		await saveSettings({ timerDurationSeconds: draftDuration });
		setDurationSeconds(draftDuration);
		reset();
		setShowSettings(false);
	}

	const hasActive = activeParticipants.length > 0;

	return (
		<div className="min-h-dvh flex flex-col">
			<div className="flex-1 flex flex-col max-w-lg mx-auto w-full px-4 pb-8 pt-6 gap-6">
				{/* Header */}
				<div className="flex items-center justify-between">
					<div>
						<p className="text-[11px] font-bold tracking-[0.18em] uppercase text-primary/70">
							Stand-up
						</p>
						<h1 className="text-xl font-bold text-foreground leading-tight">
							Daily Timer
						</h1>
					</div>
					<div className="flex items-center gap-2">
						<button
							type="button"
							onClick={() => {
								setDraftDuration(durationSeconds);
								setShowSettings((v) => !v);
							}}
							className={cn(
								"flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-200",
								showSettings
									? "border-primary/50 bg-primary/10 text-primary"
									: "border-foreground/15 text-foreground/50 hover:border-foreground/30 hover:text-foreground",
							)}
							title="Timer settings"
						>
							<Settings2 className="h-4 w-4" />
						</button>
						<button
							type="button"
							onClick={shuffle}
							disabled={participants.length < 2}
							className={cn(
								"flex h-9 items-center gap-1.5 rounded-full border px-3 text-xs font-semibold transition-all duration-200",
								"border-foreground/15 text-foreground/50 hover:border-foreground/30 hover:text-foreground",
								"disabled:opacity-30 disabled:pointer-events-none",
							)}
							title="Mezclar participantes"
						>
							<Shuffle className="h-3.5 w-3.5" />
							Mezclar
						</button>
					</div>
				</div>

				{/* Settings panel */}
				{showSettings && (
					<div className="rounded-2xl border border-foreground/10 bg-foreground/3 px-5 py-4 flex flex-col gap-3">
						<p className="text-xs font-semibold text-foreground/50 uppercase tracking-widest">
							Temporizador por persona
						</p>
						<div className="flex items-center gap-3">
							<input
								type="range"
								min={30}
								max={600}
								step={30}
								value={draftDuration}
								onChange={(e) => setDraftDuration(Number(e.target.value))}
								className="flex-1 accent-(--color-primary)"
							/>
							<span className="w-16 text-right text-sm font-bold tabular-nums text-foreground">
								{Math.floor(draftDuration / 60)}:
								{String(draftDuration % 60).padStart(2, "0")}
							</span>
						</div>
						<div className="flex gap-2 justify-end">
							<button
								type="button"
								onClick={() => setShowSettings(false)}
								className="px-3 py-1.5 rounded-lg text-xs font-semibold text-foreground/50 hover:text-foreground transition-colors"
							>
								Cancel
							</button>
							<button
								type="button"
								onClick={handleSaveDuration}
								className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity"
							>
								Save
							</button>
						</div>
					</div>
				)}

				{/* Timer section */}
				<div className="flex flex-col items-center gap-5 py-4">
					{currentParticipant && (
						<div className="flex flex-col items-center gap-1">
							<div
								className={cn(
									"h-14 w-14 rounded-full flex items-center justify-center text-xl font-bold text-white shadow-lg",
									timer.status === "running" &&
										"ring-4 ring-offset-2 ring-offset-background ring-primary",
								)}
								style={{ backgroundColor: currentParticipant.avatarColor }}
							>
								{currentParticipant.name.charAt(0).toUpperCase()}
							</div>
							<p className="text-sm font-semibold text-foreground">
								{currentParticipant.name}
							</p>
							<p className="text-[11px] text-foreground/40 tabular-nums">
								{currentIndex + 1} / {activeParticipants.length}
							</p>
						</div>
					)}

					{!currentParticipant && !loading && (
						<div className="flex flex-col items-center gap-2 text-center py-4">
							<Users className="h-10 w-10 text-foreground/20" />
							<p className="text-sm text-foreground/40">
								Añade participantes para empezar la reunión diaria.
							</p>
						</div>
					)}

					<TimerDisplay
						secondsLeft={timer.secondsLeft}
						isUrgent={timer.isUrgent}
						progress={timer.progress}
						status={timer.status}
					/>

					<MeetingControls
						status={timer.status}
						onToggle={timer.toggle}
						onNext={next}
						onReset={reset}
						hasParticipants={hasActive}
					/>
				</div>

				{/* Divider */}
				<div className="h-px bg-foreground/8" />

				{/* Participant queue */}
				<div className="flex flex-col gap-3">
					<div className="flex items-center justify-between">
						<p className="text-[11px] font-bold uppercase tracking-widest text-foreground/40">
							Orden - {activeParticipants.length} activos
						</p>
					</div>

					{loading ? (
						<div className="flex flex-col gap-2">
							{[1, 2, 3].map((i) => (
								<div
									key={i}
									className="h-16 rounded-2xl bg-foreground/5 animate-pulse"
								/>
							))}
						</div>
					) : participants.length === 0 ? (
						<div className="rounded-2xl border border-dashed border-foreground/15 py-8 text-center">
							<p className="text-sm text-foreground/30">No hay participantes aún</p>
						</div>
					) : (
						<div className="flex flex-col gap-2">
							{participants.map((participant) => {
								const activeIdx = activeParticipants.findIndex(
									(p) => p.id === participant.id,
								);
								const isActive =
									!participant.disabledForToday && activeIdx === currentIndex;
								const queuePosition =
									!participant.disabledForToday && activeIdx > currentIndex
										? activeIdx - currentIndex - 1
										: undefined;

								return (
									<ParticipantCard
										key={participant.id}
										participant={participant}
										isActive={isActive}
										queuePosition={queuePosition}
										onToggleDisabled={toggleDisabled}
										onRemove={remove}
									/>
								);
							})}
						</div>
					)}
				</div>

				{/* Add participant form */}
				<div className="rounded-2xl border border-foreground/10 bg-foreground/3 px-5 py-4">
					<p className="text-[11px] font-bold uppercase tracking-widest text-foreground/40 mb-3">
						Agregar participante
					</p>
					<AddParticipantForm onAddParticipant={addParticipant} />
				</div>
			</div>
		</div>
	);
}
