import { type DBSchema, type IDBPDatabase, openDB } from 'idb'
import type { Participant } from './participants/types'
import type { MeetingSettings } from './settings/types'

interface DailyTimerDB extends DBSchema {
  participants: {
    key: string
    value: Participant
    indexes: { 'by-order': number }
  }
  settings: {
    key: string
    value: MeetingSettings
  }
}

let dbInstance: IDBPDatabase<DailyTimerDB> | null = null

export async function getDB(): Promise<IDBPDatabase<DailyTimerDB>> {
  if (dbInstance) return dbInstance

  dbInstance = await openDB<DailyTimerDB>('daily-timer', 1, {
    upgrade(db) {
      const participantsStore = db.createObjectStore('participants', {
        keyPath: 'id',
      })
      participantsStore.createIndex('by-order', 'order')

      db.createObjectStore('settings', { keyPath: 'key' })
    },
  })

  return dbInstance
}
