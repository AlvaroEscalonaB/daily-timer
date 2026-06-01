import { cn } from '#/lib/utils'
import type { TimerUrgency } from '#/stores/meetingStore'
import { formatTime } from '#/utils/time'

interface TimerDisplayProps {
  secondsLeft: number
  urgency: TimerUrgency
  progress: number
  status: 'idle' | 'running' | 'paused'
}

const urgencyText: Record<TimerUrgency, string> = {
  normal: 'text-primary',
  warning: 'text-amber-500',
  overdue: 'text-red-500',
}

const urgencyBg: Record<TimerUrgency, string> = {
  normal: 'bg-primary',
  warning: 'bg-amber-500',
  overdue: 'bg-red-500',
}

export function TimerDisplay({ secondsLeft, urgency, progress, status }: TimerDisplayProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className={cn(
          'relative font-display text-8xl leading-none font-bold tabular-nums tracking-tight transition-colors duration-700',
          urgencyText[urgency],
          status === 'idle' && 'opacity-60'
        )}
      >
        {formatTime(secondsLeft)}
        {status === 'running' && (
          <span
            className={cn(
              'absolute -right-3 top-3 size-3 rounded-full animate-pulse',
              urgencyBg[urgency]
            )}
          />
        )}
      </div>

      <div className="w-full max-w-xs h-1 rounded-full bg-foreground/10 overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-1000 ease-linear',
            urgencyBg[urgency]
          )}
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </div>
  )
}
