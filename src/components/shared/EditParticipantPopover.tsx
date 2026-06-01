import { Pencil } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '#/components/ui/popover'
import { cn } from '#/lib/utils'
import type { Participant } from '#/persistence/participants/types'
import { useMeetingStore } from '#/stores/meetingStore'
import { AVATAR_COLORS } from '#/utils/avatarColors'

interface EditParticipantPopoverProps {
  participant: Participant
}

export function EditParticipantPopover({ participant }: EditParticipantPopoverProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(participant.name)
  const [color, setColor] = useState(participant.avatarColor)
  const inputRef = useRef<HTMLInputElement>(null)
  const editParticipant = useMeetingStore((s) => s.editParticipant)

  useEffect(() => {
    if (open) {
      setName(participant.name)
      setColor(participant.avatarColor)
      setTimeout(() => inputRef.current?.focus(), 0)
    }
  }, [open, participant.name, participant.avatarColor])

  async function handleSave() {
    const trimmed = name.trim()
    if (!trimmed) return
    await editParticipant(participant.id, { name: trimmed, avatarColor: color })
    setOpen(false)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleSave()
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          title="Editar participante"
          className="flex size-6 items-center justify-center rounded-full text-foreground/30 hover:text-primary hover:bg-primary/10 transition-all"
        >
          <Pencil className="size-3.5" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72">
        <div className="flex flex-col gap-3">
          <p className="text-[11px] font-bold uppercase tracking-widest text-foreground/40">
            Editar participante
          </p>

          <div className="flex gap-2 items-center">
            <div
              className="size-9 shrink-0 rounded-full flex items-center justify-center text-sm font-bold text-white transition-colors duration-200"
              style={{ backgroundColor: color }}
            >
              {name.charAt(0).toUpperCase() || '?'}
            </div>
            <input
              ref={inputRef}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Nombre…"
              maxLength={40}
              className={cn(
                'flex-1 rounded-xl border border-foreground/15 bg-foreground/5 px-3 py-2 text-sm',
                'placeholder:text-foreground/30 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/40',
                'transition-all duration-200'
              )}
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-foreground/40 font-medium uppercase tracking-wide shrink-0">
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
                  style={{ backgroundColor: c }}
                  title={c}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-foreground/50 hover:text-foreground transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!name.trim()}
              className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:pointer-events-none"
            >
              Guardar
            </button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
