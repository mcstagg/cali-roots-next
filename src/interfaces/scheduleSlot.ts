export interface ScheduleSlot {
  _key: string              // unique key for array items
  _type: 'scheduleSlot'     // type discriminator

  stage: string             // stage name
  start: string             // ISO datetime string for start time
  end: string               // ISO datetime string for end time

  // artist name
  artist?: { name?: string} // keep it loose (not reference to an artist document to avoid complex typing issues)
}