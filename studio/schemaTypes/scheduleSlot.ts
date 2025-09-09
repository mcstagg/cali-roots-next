import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'scheduleSlot',
  title: 'Schedule Slot',
  type: 'object',
  fields: [
    defineField({name: 'stage', type: 'string', title: 'Stage'}),
    defineField({name: 'start', type: 'datetime', title: 'Start'}),
    defineField({name: 'end', type: 'datetime', title: 'End'}),
    defineField({name: 'artist', type: 'reference', to: [{type: 'artist'}]}),
  ],
})