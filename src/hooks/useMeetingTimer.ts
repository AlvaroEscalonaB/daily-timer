import { useCallback, useEffect, useRef, useState } from 'react'

type TimerStatus = 'idle' | 'running' | 'paused' | 'finished'

export function useMeetingTimer(durationSeconds: number) {
  const [secondsLeft, setSecondsLeft] = useState(durationSeconds)
  const [status, setStatus] = useState<TimerStatus>('idle')
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const durationRef = useRef(durationSeconds)

  useEffect(() => {
    durationRef.current = durationSeconds
  }, [durationSeconds])

  const clear = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const play = useCallback(() => {
    if (status === 'finished') return
    setStatus('running')
    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clear()
          setStatus('finished')
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }, [status, clear])

  const pause = useCallback(() => {
    clear()
    setStatus('paused')
  }, [clear])

  const reset = useCallback(() => {
    clear()
    setSecondsLeft(durationRef.current)
    setStatus('idle')
  }, [clear])

  const toggle = useCallback(() => {
    if (status === 'running') {
      pause()
    } else {
      play()
    }
  }, [status, play, pause])

  useEffect(() => () => clear(), [clear])

  const elapsed = durationSeconds - secondsLeft
  const progress = elapsed / durationSeconds
  const isUrgent = secondsLeft <= 30 && status !== 'idle'

  return {
    secondsLeft,
    status,
    progress,
    isUrgent,
    play,
    pause,
    reset,
    toggle,
  }
}
