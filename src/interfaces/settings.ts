export interface Settings {
  _id: string                // unique Sanity document ID
  _type: 'settings'          // type discriminator
  _createdAt?: string        // ISO datetime when created
  _updatedAt?: string        // ISO datetime when last updated
  _rev?: string              // revision hash

  siteTitle: string          // required
  primaryCtaLabel?: string   // optional, defaults to "Buy Tickets" if not set
  primaryCtaUrl?: string     // URL string
}