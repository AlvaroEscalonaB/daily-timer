import { Users } from 'lucide-react'
import { useEffect } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { AddParticipantPopover } from '#/components/shared/AddParticipantPopover'
import { MeetingControls } from '#/components/shared/MeetingControls'
import { ParticipantCard } from '#/components/shared/ParticipantCard'
import { SettingsPopover } from '#/components/shared/SettingsPopover'
import { TimerDisplay } from '#/components/shared/TimerDisplay'
import { useKeyboardShortcuts } from '#/hooks/useKeyboardShortcuts'
import { cn } from '#/lib/utils'
import {
  selectActiveParticipants,
  selectCurrentParticipant,
  selectTimerProgress,
  selectTimerUrgency,
  useMeetingStore,
} from '#/stores/meetingStore'

export function DailyTimerScreen() {
  const initialize = useMeetingStore((s) => s.initialize)
  const participants = useMeetingStore((s) => s.participants)
  const loading = useMeetingStore((s) => s.loading)
  const currentIndex = useMeetingStore((s) => s.currentIndex)
  const durationSeconds = useMeetingStore((s) => s.durationSeconds)
  const secondsLeft = useMeetingStore((s) => s.secondsLeft)
  const timerStatus = useMeetingStore((s) => s.timerStatus)
  const activeParticipants = useMeetingStore(useShallow(selectActiveParticipants))
  const currentParticipant = useMeetingStore(selectCurrentParticipant)
  const progress = useMeetingStore(selectTimerProgress)
  const urgency = useMeetingStore(selectTimerUrgency)

  const toggle = useMeetingStore((s) => s.toggle)
  const next = useMeetingStore((s) => s.next)
  const back = useMeetingStore((s) => s.back)
  const resetMeeting = useMeetingStore((s) => s.resetMeeting)
  const shuffle = useMeetingStore((s) => s.shuffle)
  const addParticipant = useMeetingStore((s) => s.addParticipant)
  const removeParticipant = useMeetingStore((s) => s.removeParticipant)
  const toggleDisabled = useMeetingStore((s) => s.toggleDisabled)
  const setDurationSeconds = useMeetingStore((s) => s.setDurationSeconds)

  useEffect(() => {
    initialize()
  }, [initialize])

  useKeyboardShortcuts()

  const hasActive = activeParticipants.length > 0
  const canGoBack = currentIndex > 0

  return (
    <div className="min-h-dvh flex flex-col">
      <div className="flex-1 flex flex-col max-w-lg mx-auto w-full px-4 pb-8 pt-6 gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold tracking-[0.18em] uppercase text-primary/70">
              Stand-up
            </p>
            <h1 className="text-xl font-bold text-foreground leading-tight">Daily Timer</h1>
          </div>
          <div className="flex items-center gap-2">
            <SettingsPopover durationSeconds={durationSeconds} onSave={setDurationSeconds} />
          </div>
        </div>

        {/* Timer section */}
        <div className="flex flex-col items-center gap-5 py-4">
          {currentParticipant && (
            <div className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  'size-14 rounded-full flex items-center justify-center text-xl font-bold text-white shadow-lg',
                  timerStatus === 'running' &&
                    'ring-4 ring-offset-2 ring-offset-background ring-primary'
                )}
                style={{ backgroundColor: currentParticipant.avatarColor }}
              >
                {currentParticipant.name.charAt(0).toUpperCase()}
              </div>
              <p className="text-sm font-semibold text-foreground">{currentParticipant.name}</p>
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
            secondsLeft={secondsLeft}
            urgency={urgency}
            progress={progress}
            status={timerStatus}
          />

          <MeetingControls
            status={timerStatus}
            onToggle={toggle}
            onNext={next}
            onBack={back}
            onReset={resetMeeting}
            shuffle={shuffle}
            hasParticipants={hasActive}
            canGoBack={canGoBack}
          />
        </div>

        {/* Divider */}
        <div className="h-px bg-foreground/8" />

        {/* Participant queue */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold uppercase tracking-widest text-foreground/40">
              Orden — {activeParticipants.length} activos
            </p>
            <AddParticipantPopover onAddParticipant={addParticipant} />
          </div>

          {loading ? (
            <div className="flex flex-col gap-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 rounded-2xl bg-foreground/5 animate-pulse" />
              ))}
            </div>
          ) : participants.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-foreground/15 py-8 text-center">
              <p className="text-sm text-foreground/30">No hay participantes aún</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {participants.map((participant) => {
                const activeIdx = activeParticipants.findIndex((p) => p.id === participant.id)
                const isActive = !participant.disabledForToday && activeIdx === currentIndex
                const queuePosition =
                  !participant.disabledForToday && activeIdx > currentIndex
                    ? activeIdx - currentIndex - 1
                    : undefined

                return (
                  <ParticipantCard
                    key={participant.id}
                    participant={participant}
                    isActive={isActive}
                    queuePosition={queuePosition}
                    onToggleDisabled={toggleDisabled}
                    onRemove={removeParticipant}
                  />
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
