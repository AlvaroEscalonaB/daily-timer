import { Pause, Play, RotateCcw, SkipForward } from 'lucide-react'
import { cn } from '#/lib/utils'

interface MeetingControlsProps {
  status: 'idle' | 'running' | 'paused' | 'finished'
  onToggle: () => void
  onNext: () => void
  onReset: () => void
  hasParticipants: boolean
}

export function MeetingControls({
  status,
  onToggle,
  onNext,
  onReset,
  hasParticipants,
}: MeetingControlsProps) {
  const isRunning = status === 'running'
  const isIdle = status === 'idle'

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={onReset}
        disabled={isIdle}
        className={cn(
          'flex size-10 items-center justify-center rounded-full border transition-all duration-200',
          'border-foreground/20 text-foreground/50 hover:border-foreground/40 hover:text-foreground',
          'disabled:opacity-30 disabled:pointer-events-none'
        )}
        title="Reset"
      >
        <RotateCcw className="size-4" />
      </button>

      <button
        type="button"
        onClick={onToggle}
        disabled={!hasParticipants || status === 'finished'}
        className={cn(
          'flex size-16 items-center justify-center rounded-full transition-all duration-200',
          'bg-primary text-primary-foreground shadow-lg shadow-primary/30',
          'hover:scale-105 hover:shadow-primary/50 active:scale-95',
          'disabled:opacity-30 disabled:pointer-events-none disabled:shadow-none'
        )}
        title={isRunning ? 'Pause' : 'Play'}
      >
        {isRunning ? <Pause className="size-6" /> : <Play className="size-6 translate-x-0.5" />}
      </button>

      <button
        type="button"
        onClick={onNext}
        disabled={!hasParticipants}
        className={cn(
          'flex size-10 items-center justify-center rounded-full border transition-all duration-200',
          'border-foreground/20 text-foreground/50 hover:border-foreground/40 hover:text-foreground',
          'disabled:opacity-30 disabled:pointer-events-none'
        )}
        title="Next participant"
      >
        <SkipForward className="size-4" />
      </button>
    </div>
  )
}
