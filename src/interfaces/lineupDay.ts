import { ScheduleSlot } from './index'

export interface LineupDay {
  _id: string               // unique Sanity document ID
  _type: 'lineupDay'        // type discriminator
  _createdAt?: string       // ISO datetime when created
  _updatedAt?: string       // ISO datetime when last updated
  _rev?: string             // revision hash

  date: string              // ISO date string (YYYY-MM-DD)

  slots?: ScheduleSlot[]    // array of scheduleSlot objects
}