export interface Participant {
  id: string
  name: string
  avatarColor: string
  order: number
  disabledForToday: boolean
  createdAt: number
  notes?: string
}

export type CreateParticipantInput = Pick<Participant, 'name' | 'avatarColor'>
export type UpdateParticipantInput = Partial<Omit<Participant, 'id' | 'createdAt'>>
