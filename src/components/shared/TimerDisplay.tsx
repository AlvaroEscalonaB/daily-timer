import { cn } from "#/lib/utils";

interface TimerDisplayProps {
	secondsLeft: number;
	isUrgent: boolean;
	progress: number;
	status: "idle" | "running" | "paused" | "finished";
}

function formatTime(seconds: number): string {
	const m = Math.floor(seconds / 60);
	const s = seconds % 60;
	return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function TimerDisplay({
	secondsLeft,
	isUrgent,
	progress,
	status,
}: TimerDisplayProps) {
	return (
		<div className="flex flex-col items-center gap-4">
			<div
				className={cn(
					"relative font-display text-[clamp(5rem,16vw,9rem)] leading-none font-bold tabular-nums tracking-tight transition-colors duration-700",
					isUrgent ? "text-secondary" : "text-primary",
					status === "idle" && "opacity-60",
				)}
			>
				{formatTime(secondsLeft)}
				{status === "running" && (
					<span
						className={cn(
							"absolute -right-3 top-3 size-3 rounded-full animate-pulse",
							isUrgent ? "bg-secondary" : "bg-primary",
						)}
					/>
				)}
			</div>

			<div className="w-full max-w-xs h-1 rounded-full bg-foreground/10 overflow-hidden">
				<div
					className={cn(
						"h-full rounded-full transition-all duration-1000 ease-linear",
						isUrgent ? "bg-secondary" : "bg-primary",
					)}
					style={{ width: `${progress * 100}%` }}
				/>
			</div>
		</div>
	);
}
