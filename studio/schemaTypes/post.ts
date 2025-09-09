import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'post',
  title: 'News / Post',
  type: 'document',
  fields: [
    defineField({name: 'title', type: 'string', title: 'Title', validation: r => r.required()}),
    defineField({name: 'slug', type: 'slug', title: 'Slug', options: {source: 'title'}}),
    defineField({name: 'publishedAt', type: 'datetime', title: 'Published At'}),
    defineField({name: 'excerpt', type: 'text', title: 'Excerpt'}),
    defineField({name: 'cover', type: 'image', title: 'Cover'}),
    defineField({name: 'content', type: 'array', title: 'Content', of: [{type: 'block'}, {type: 'image'}]}),
  ],
})