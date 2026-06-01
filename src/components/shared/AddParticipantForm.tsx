import { Plus } from 'lucide-react'
import { type FormEvent, useState } from 'react'
import { cn } from '#/lib/utils'
import type { CreateParticipantInput } from '#/persistence/participants/types'

const AVATAR_COLORS = [
  '#0d9488',
  '#0891b2',
  '#7c3aed',
  '#db2777',
  '#ea580c',
  '#65a30d',
  '#dc2626',
  '#d97706',
]

interface AddParticipantFormProps {
  onAddParticipant: (input: CreateParticipantInput) => Promise<void>
}

export function AddParticipantForm({ onAddParticipant }: AddParticipantFormProps) {
  const [name, setName] = useState('')
  const [color, setColor] = useState(AVATAR_COLORS[0])
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!name.trim()) return

    setLoading(true)
    try {
      await onAddParticipant({ name: name.trim(), avatarColor: color })
      setName('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="flex gap-2">
        <div
          className="size-10 shrink-0 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-inner transition-colors duration-200"
          style={{ backgroundColor: color }}
        >
          {name.charAt(0).toUpperCase() || '?'}
        </div>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Participant name…"
          maxLength={40}
          className={cn(
            'flex-1 rounded-xl border border-foreground/15 bg-foreground/5 px-3 py-2 text-sm',
            'placeholder:text-foreground/30 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/40',
            'transition-all duration-200'
          )}
        />
        <button
          type="submit"
          disabled={!name.trim() || loading}
          className={cn(
            'flex size-10 shrink-0 items-center justify-center rounded-xl',
            'bg-primary text-primary-foreground shadow-md shadow-primary/25',
            'hover:shadow-primary/40 hover:scale-105 active:scale-95',
            'disabled:opacity-40 disabled:pointer-events-none',
            'transition-all duration-200'
          )}
        >
          <Plus className="size-5" />
        </button>
      </div>

      <div className="flex items-center gap-2 pl-12">
        <span className="text-[11px] text-foreground/40 font-medium uppercase tracking-wide">
          Color
        </span>
        <div className="flex gap-1.5">
          {AVATAR_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className={cn(
                'size-5 rounded-full transition-all duration-150',
                color === c
                  ? 'ring-2 ring-offset-1 ring-offset-background scale-110'
                  : 'opacity-60 hover:opacity-100 hover:scale-105'
              )}
              style={{
                backgroundColor: c,
                ...(color === c ? { ringColor: c } : {}),
              }}
              title={c}
            />
          ))}
        </div>
      </div>
    </form>
  )
}
