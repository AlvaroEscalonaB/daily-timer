import { useEffect } from 'react'
import { useMeetingStore } from '#/stores/meetingStore'

export function useKeyboardShortcuts() {
  const toggle = useMeetingStore((s) => s.toggle)
  const next = useMeetingStore((s) => s.next)
  const back = useMeetingStore((s) => s.back)
  const resetMeeting = useMeetingStore((s) => s.resetMeeting)

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (e.metaKey || e.ctrlKey || e.altKey) return

      switch (e.key) {
        case ' ':
          e.preventDefault()
          toggle()
          break
        case 'ArrowRight':
          e.preventDefault()
          next()
          break
        case 'ArrowLeft':
          e.preventDefault()
          back()
          break
        case 'r':
        case 'R':
          e.preventDefault()
          resetMeeting()
          break
      }
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [toggle, next, back, resetMeeting])
}
