import { create } from 'zustand'
import {
  createParticipant,
  deleteParticipant,
  getAllParticipants,
  shuffleParticipants,
  updateParticipant,
} from '#/persistence/participants/repository'
import type { CreateParticipantInput, Participant } from '#/persistence/participants/types'
import { getSettings } from '#/persistence/settings/repository'

// 'finished' is intentionally absent — the timer runs into negative (overtime) instead of stopping.
export type TimerStatus = 'idle' | 'running' | 'paused'
export type TimerUrgency = 'normal' | 'warning' | 'overdue'

export interface MeetingState {
  // Participants
  participants: Participant[]
  loading: boolean

  // Navigation
  currentIndex: number
  durationSeconds: number

  // Timer (secondsLeft can be negative when in overtime)
  secondsLeft: number
  timerStatus: TimerStatus
  _intervalId: ReturnType<typeof setInterval> | null

  // Init
  initialize: () => Promise<void>

  // Participant actions
  addParticipant: (input: CreateParticipantInput) => Promise<void>
  removeParticipant: (id: string) => Promise<void>
  toggleDisabled: (id: string) => Promise<void>
  shuffle: () => Promise<void>

  // Timer actions
  play: () => void
  pause: () => void
  resetTimer: () => void
  toggle: () => void

  // Navigation actions
  next: () => void
  back: () => void
  resetMeeting: () => void

  // Settings
  setDurationSeconds: (seconds: number) => void
}

function clearTimer(id: ReturnType<typeof setInterval> | null) {
  if (id !== null) clearInterval(id)
}

export const useMeetingStore = create<MeetingState>()((set, get) => ({
  participants: [],
  loading: true,
  currentIndex: 0,
  durationSeconds: 120,
  secondsLeft: 120,
  timerStatus: 'idle',
  _intervalId: null,

  initialize: async () => {
    const [participants, settings] = await Promise.all([getAllParticipants(), getSettings()])
    set({
      participants,
      loading: false,
      durationSeconds: settings.timerDurationSeconds,
      secondsLeft: settings.timerDurationSeconds,
    })
  },

  addParticipant: async (input) => {
    await createParticipant(input)
    const all = await getAllParticipants()
    set({ participants: all })
  },

  removeParticipant: async (id) => {
    await deleteParticipant(id)
    const all = await getAllParticipants()
    const { currentIndex } = get()
    const newActive = all.filter((p) => !p.disabledForToday)
    const safeIndex = Math.min(currentIndex, Math.max(0, newActive.length - 1))
    set({ participants: all, currentIndex: safeIndex })
  },

  toggleDisabled: async (id) => {
    const participant = get().participants.find((p) => p.id === id)
    if (!participant) return
    await updateParticipant(id, { disabledForToday: !participant.disabledForToday })
    const all = await getAllParticipants()
    set({ participants: all })
  },

  shuffle: async () => {
    clearTimer(get()._intervalId)
    const shuffled = await shuffleParticipants()
    const { durationSeconds } = get()
    set({
      participants: shuffled,
      currentIndex: 0,
      secondsLeft: durationSeconds,
      timerStatus: 'idle',
      _intervalId: null,
    })
  },

  play: () => {
    const { timerStatus, _intervalId } = get()
    if (timerStatus === 'running') return
    clearTimer(_intervalId)

    const id = setInterval(() => {
      set({ secondsLeft: get().secondsLeft - 1 })
    }, 1000)

    set({ timerStatus: 'running', _intervalId: id })
  },

  pause: () => {
    clearTimer(get()._intervalId)
    set({ timerStatus: 'paused', _intervalId: null })
  },

  resetTimer: () => {
    clearTimer(get()._intervalId)
    const { durationSeconds } = get()
    set({ secondsLeft: durationSeconds, timerStatus: 'idle', _intervalId: null })
  },

  toggle: () => {
    const { timerStatus } = get()
    if (timerStatus === 'running') get().pause()
    else get().play()
  },

  next: () => {
    clearTimer(get()._intervalId)
    const { currentIndex, durationSeconds } = get()
    const active = selectActiveParticipants(get())
    const nextIndex = currentIndex + 1 >= active.length ? 0 : currentIndex + 1
    set({
      currentIndex: nextIndex,
      secondsLeft: durationSeconds,
      timerStatus: 'idle',
      _intervalId: null,
    })
  },

  back: () => {
    const { currentIndex, _intervalId, durationSeconds } = get()
    if (currentIndex === 0) return
    clearTimer(_intervalId)
    set({
      currentIndex: currentIndex - 1,
      secondsLeft: durationSeconds,
      timerStatus: 'idle',
      _intervalId: null,
    })
  },

  resetMeeting: () => {
    clearTimer(get()._intervalId)
    const { durationSeconds } = get()
    set({ currentIndex: 0, secondsLeft: durationSeconds, timerStatus: 'idle', _intervalId: null })
  },

  setDurationSeconds: (seconds) => {
    clearTimer(get()._intervalId)
    set({
      durationSeconds: seconds,
      secondsLeft: seconds,
      timerStatus: 'idle',
      _intervalId: null,
      currentIndex: 0,
    })
  },
}))

// Selectors
export const selectActiveParticipants = (s: MeetingState): Participant[] =>
  s.participants.filter((p) => !p.disabledForToday)

export const selectCurrentParticipant = (s: MeetingState): Participant | undefined =>
  selectActiveParticipants(s)[s.currentIndex]

export const selectTimerProgress = (s: MeetingState): number => {
  if (s.durationSeconds <= 0) return 0
  return Math.min(1, Math.max(0, (s.durationSeconds - s.secondsLeft) / s.durationSeconds))
}

export const selectTimerUrgency = (s: MeetingState): TimerUrgency => {
  if (s.timerStatus === 'idle') {
    return 'normal'
  }
  if (s.secondsLeft <= 0) {
    return 'overdue'
  }
  if (s.secondsLeft <= s.durationSeconds * 0.25) {
    return 'warning'
  }
  return 'normal'
}
