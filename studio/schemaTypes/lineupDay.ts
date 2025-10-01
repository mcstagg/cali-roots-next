import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'lineupDay',
  title: 'Lineup Day',
  type: 'document',
  fields: [
    defineField({ name: 'date', type: 'date', title: 'Date', validation: r => r.required() }),
    defineField({ name: 'slots', type: 'array', title: 'Slots', of: [{ type: 'scheduleSlot' }] }),
  ],
  orderings: [
    {
      name: 'dateAsc',
      title: 'Date (Ascending)',
      by: [{ field: 'date', direction: 'asc' }],
    },
    {
      name: 'dateDesc',
      title: 'Date (Descending)',
      by: [{ field: 'date', direction: 'desc' }],
    },
  ],
  preview: {
    select: { date: 'date', slots: 'slots' },
    prepare({ date, slots }) {
      const count = Array.isArray(slots) ? slots.length : 0
      let title = 'Lineup Day'
      if (date) {
        const [y, m, d] = date.split('-').map(Number)
        const dt = new Date(Date.UTC(y, m - 1, d)) // exact calendar day, no TZ drift
        title = new Intl.DateTimeFormat('en-US', {
          timeZone: 'UTC',
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        }).format(dt)
      }
      return { title, subtitle: count ? `${count} slot${count > 1 ? 's' : ''}` : 'No slots yet' }
    }
  }
})
