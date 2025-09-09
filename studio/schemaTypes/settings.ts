import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'settings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({name: 'siteTitle', type: 'string', title: 'Site Title', validation: r => r.required()}),
    defineField({name: 'primaryCtaLabel', type: 'string', title: 'Primary CTA Label', initialValue: 'Buy Tickets'}),
    defineField({name: 'primaryCtaUrl', type: 'url', title: 'Primary CTA URL'}),
  ],
})