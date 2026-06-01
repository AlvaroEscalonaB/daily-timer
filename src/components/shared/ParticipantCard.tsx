import { Trash2 } from 'lucide-react'
import { cn } from '#/lib/utils'
import type { Participant } from '#/persistence/participants/types'

interface ParticipantCardProps {
  participant: Participant
  isActive: boolean
  queuePosition?: number
  onToggleDisabled: (id: string) => void
  onRemove: (id: string) => void
}

export function ParticipantCard({
  participant,
  isActive,
  queuePosition,
  onToggleDisabled,
  onRemove,
}: ParticipantCardProps) {
  const disabled = participant.disabledForToday

  return (
    <div
      className={cn(
        'group relative flex items-center gap-3 rounded-2xl border px-4 py-3 transition-all duration-300',
        isActive
          ? 'border-primary/60 bg-primary/8 shadow-[0_0_0_1px_var(--color-primary),0_0_24px_rgba(var(--primary-rgb),0.18)]'
          : 'border-foreground/10 bg-foreground/3 hover:border-foreground/20',
        disabled && 'opacity-40'
      )}
    >
      {queuePosition !== undefined && !isActive && !disabled && (
        <span className="absolute -left-2.5 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full bg-foreground/10 text-[10px] font-bold text-foreground/60">
          {queuePosition + 1}
        </span>
      )}

      <div
        className="size-9 shrink-0 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-inner"
        style={{ backgroundColor: participant.avatarColor }}
      >
        {participant.name.charAt(0).toUpperCase()}
      </div>

      <div className="flex-1 min-w-0">
        <p
          className={cn(
            'truncate text-sm font-semibold text-foreground transition-all',
            disabled && 'line-through',
            isActive && 'text-primary'
          )}
        >
          {participant.name}
        </p>
        {isActive && (
          <p className="text-[11px] font-medium text-primary/70 tracking-wide uppercase">
            En su turno
          </p>
        )}
      </div>

      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          type="button"
          onClick={() => onToggleDisabled(participant.id)}
          title={disabled ? 'Enable for today' : 'Skip today'}
          className={cn(
            'h-6 w-11 rounded-full border transition-all duration-200 relative shrink-0',
            disabled ? 'border-foreground/20 bg-foreground/5' : 'border-primary/40 bg-primary/15'
          )}
        >
          <span
            className={cn(
              'absolute top-0.5 size-5 rounded-full transition-all duration-200 shadow-sm',
              disabled ? 'left-0.5 bg-foreground/30' : 'left-[calc(100%-1.375rem)] bg-primary'
            )}
          />
        </button>

        <button
          type="button"
          onClick={() => onRemove(participant.id)}
          title="Remove participant"
          className="flex size-6 items-center justify-center rounded-full text-foreground/30 hover:text-destructive hover:bg-destructive/10 transition-all"
        >
          <Trash2 className="size-3.5" />
        </button>
      </div>

      {isActive && (
        <div className="absolute inset-0 rounded-2xl pointer-events-none overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--color-primary)_0%,transparent_70%)] opacity-5" />
        </div>
      )}
    </div>
  )
}
