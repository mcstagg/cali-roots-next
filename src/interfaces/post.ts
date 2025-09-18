import { BlockContent, PostImage } from "./index"
export interface Post {
  _id: string                // unique Sanity document ID
  _type: 'post'              // type discriminator
  _createdAt?: string        // ISO datetime when created
  _updatedAt?: string        // ISO datetime when last updated
  _rev?: string              // revision hash

  title: string              // required (validation)
  slug?: { current: string } // slug object with the usable value in `current`

  publishedAt?: string       // ISO datetime string
  excerpt?: string           // short text summary

  cover?: {
    _type: 'image'
    asset: {
      _ref: string
      _type: 'reference'
    }
    hotspot?: {
      x: number
      y: number
      height: number
      width: number
    }
  }

  content?: Array<
    | BlockContent
    | PostImage
  >
}