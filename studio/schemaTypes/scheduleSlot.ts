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
  preview: {
    // NOTE: don't try 'artist->name' here; just select the reference and render a helpful label
    select: { stage: 'stage', start: 'start', end: 'end', artistRef: 'artist' },
    prepare({ stage, start, end, artistRef }) {
      const fmt = (t?: string) =>
        t ? new Date(t).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) : ''
      // artistRef is a reference stub; Studio will still show a nice default title in the input,
      // but for preview, fall back to a generic label + stage/time.
      const title = 'Slot'
      const subtitle = [stage, `${fmt(start)}–${fmt(end)}`].filter(Boolean).join(' • ')
      return { title, subtitle }
    }
  }
})