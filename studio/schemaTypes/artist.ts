import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'artist',
  title: 'Artist',
  type: 'document',
  fields: [
    defineField({name: 'name', type: 'string', title: 'Name', validation: r => r.required()}),
    defineField({name: 'slug', type: 'slug', title: 'Slug', options: {source: 'name'}}),
    defineField({name: 'image', type: 'image', title: 'Image', options: {hotspot: true}}),
    defineField({name: 'genres', type: 'array', title: 'Genres', of: [{type: 'string'}]}),
    defineField({name: 'website', type: 'url', title: 'Website'}),
    defineField({name: 'bio', type: 'text', title: 'Short Bio'}),
  ],
})