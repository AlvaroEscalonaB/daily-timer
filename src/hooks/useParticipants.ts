import { useCallback, useEffect, useState } from 'react'
import {
  createParticipant,
  deleteParticipant,
  getAllParticipants,
  shuffleParticipants,
  updateParticipant,
} from '../persistence/participants/repository'
import type { CreateParticipantInput, Participant } from '../persistence/participants/types'

export function useParticipants() {
  const [participants, setParticipants] = useState<Participant[]>([])
  const [loading, setLoading] = useState(true)

  const reload = useCallback(async () => {
    const all = await getAllParticipants()
    setParticipants(all)
  }, [])

  useEffect(() => {
    reload().finally(() => setLoading(false))
  }, [reload])

  const addParticipant = useCallback(
    async (input: CreateParticipantInput) => {
      await createParticipant(input)
      await reload()
    },
    [reload]
  )

  const remove = useCallback(
    async (id: string) => {
      await deleteParticipant(id)
      await reload()
    },
    [reload]
  )

  const toggleDisabled = useCallback(
    async (id: string) => {
      const participant = participants.find((p) => p.id === id)
      if (!participant) return
      await updateParticipant(id, {
        disabledForToday: !participant.disabledForToday,
      })
      await reload()
    },
    [participants, reload]
  )

  const shuffle = useCallback(async () => {
    const shuffled = await shuffleParticipants()
    setParticipants(shuffled)
  }, [])

  return {
    participants,
    loading,
    addParticipant,
    remove,
    toggleDisabled,
    shuffle,
    reload,
  }
}
