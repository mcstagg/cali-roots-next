import { BlockContent, PageImage } from "./index"

export interface Page {
  _id: string                // unique Sanity document ID
  _type: 'page'              // type discriminator
  _createdAt?: string        // ISO datetime when created
  _updatedAt?: string        // ISO datetime when last updated
  _rev?: string              // revision hash

  title: string              // required
  slug?: { current: string } // slug object, with value in `current`

  content?: Array<BlockContent | PageImage> // portable text & images
}