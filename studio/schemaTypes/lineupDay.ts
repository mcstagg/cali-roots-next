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
})
