import { useCallback, useEffect, useState } from 'react'
import type { Participant } from '../persistence/participants/types'
import { getSettings } from '../persistence/settings/repository'
import { useMeetingTimer } from './useMeetingTimer'
import { useParticipants } from './useParticipants'

export function useMeeting() {
  const [durationSeconds, setDurationSeconds] = useState(120)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [meetingStarted, setMeetingStarted] = useState(false)

  const { participants, loading, addParticipant, remove, toggleDisabled, shuffle } =
    useParticipants()

  const timer = useMeetingTimer(durationSeconds)

  useEffect(() => {
    getSettings().then((s) => setDurationSeconds(s.timerDurationSeconds))
  }, [])

  const activeParticipants = participants.filter((p) => !p.disabledForToday)

  const currentParticipant: Participant | undefined = activeParticipants[currentIndex]

  const next = useCallback(() => {
    timer.reset()
    setCurrentIndex((prev) => {
      const nextIdx = prev + 1
      if (nextIdx >= activeParticipants.length) {
        setMeetingStarted(false)
        return 0
      }
      return nextIdx
    })
  }, [timer, activeParticipants.length])

  const reset = useCallback(() => {
    timer.reset()
    setCurrentIndex(0)
    setMeetingStarted(false)
  }, [timer])

  const handleShuffle = useCallback(async () => {
    await shuffle()
    reset()
  }, [shuffle, reset])

  const startMeeting = useCallback(() => {
    setMeetingStarted(true)
    timer.play()
  }, [timer])

  useEffect(() => {
    if (timer.status === 'finished') {
      const timeout = setTimeout(() => {
        next()
        if (currentIndex + 1 < activeParticipants.length) {
          timer.play()
        }
      }, 1500)
      return () => clearTimeout(timeout)
    }
  }, [timer.status, timer.play, next, currentIndex, activeParticipants.length])

  return {
    participants,
    activeParticipants,
    currentParticipant,
    currentIndex,
    loading,
    durationSeconds,
    setDurationSeconds,
    meetingStarted,
    timer,
    addParticipant,
    remove,
    toggleDisabled,
    shuffle: handleShuffle,
    next,
    reset,
    startMeeting,
  }
}
