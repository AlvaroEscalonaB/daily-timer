import { cn } from '#/lib/utils'
import { formatTime } from '#/utils/time'

interface TimerDisplayProps {
  secondsLeft: number
  isUrgent: boolean
  progress: number
  status: 'idle' | 'running' | 'paused' | 'finished'
}

export function TimerDisplay({ secondsLeft, isUrgent, progress, status }: TimerDisplayProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className={cn(
          'relative font-display text-8xl leading-none font-bold tabular-nums tracking-tight transition-colors duration-700',
          isUrgent ? 'text-secondary' : 'text-primary',
          status === 'idle' && 'opacity-60'
        )}
      >
        {formatTime(secondsLeft)}
        {status === 'running' && (
          <span
            className={cn(
              'absolute -right-3 top-3 size-3 rounded-full animate-pulse',
              isUrgent ? 'bg-secondary' : 'bg-primary'
            )}
          />
        )}
      </div>

      <div className="w-full max-w-xs h-1 rounded-full bg-foreground/10 overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-1000 ease-linear',
            isUrgent ? 'bg-secondary' : 'bg-primary'
          )}
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </div>
  )
}
