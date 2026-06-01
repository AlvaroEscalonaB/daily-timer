import { Settings2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '#/components/ui/popover'
import { cn } from '#/lib/utils'
import { saveSettings } from '#/persistence/settings/repository'

interface SettingsPopoverProps {
  durationSeconds: number
  onSave: (durationSeconds: number) => void
}

export function SettingsPopover({ durationSeconds, onSave }: SettingsPopoverProps) {
  const [open, setOpen] = useState(false)
  const [draftDuration, setDraftDuration] = useState(durationSeconds)

  useEffect(() => {
    if (open) setDraftDuration(durationSeconds)
  }, [open, durationSeconds])

  async function handleSave() {
    await saveSettings({ timerDurationSeconds: draftDuration })
    onSave(draftDuration)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            'flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-200',
            open
              ? 'border-primary/50 bg-primary/10 text-primary'
              : 'border-foreground/15 text-foreground/50 hover:border-foreground/30 hover:text-foreground'
          )}
          title="Timer settings"
        >
          <Settings2 className="h-4 w-4" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72">
        <div className="flex flex-col gap-3">
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
            <span className="w-14 text-right text-sm font-bold tabular-nums text-foreground">
              {Math.floor(draftDuration / 60)}:{String(draftDuration % 60).padStart(2, '0')}
            </span>
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
              className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity"
            >
              Guardar
            </button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
