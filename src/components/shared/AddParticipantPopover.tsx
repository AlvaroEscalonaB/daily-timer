import { UserPlus } from 'lucide-react'
import { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '#/components/ui/popover'
import type { CreateParticipantInput } from '#/persistence/participants/types'
import { AddParticipantForm } from './AddParticipantForm'

interface AddParticipantPopoverProps {
  onAddParticipant: (input: CreateParticipantInput) => Promise<void>
}

export function AddParticipantPopover({ onAddParticipant }: AddParticipantPopoverProps) {
  const [open, setOpen] = useState(false)

  async function handleAdd(input: CreateParticipantInput) {
    await onAddParticipant(input)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex h-9 items-center gap-1.5 rounded-full border border-foreground/15 px-3 text-xs font-semibold text-foreground/50 transition-all duration-200 hover:border-foreground/30 hover:text-foreground"
        >
          <UserPlus className="h-3.5 w-3.5" />
          Agregar
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-96">
        <div className="flex flex-col gap-3">
          <p className="text-[11px] font-bold uppercase tracking-widest text-foreground/40">
            Agregar participante
          </p>
          <AddParticipantForm onAddParticipant={handleAdd} />
        </div>
      </PopoverContent>
    </Popover>
  )
}
