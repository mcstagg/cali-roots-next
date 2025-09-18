export interface Artist {
  _id: string
  _type: 'artist'
  name: string
  slug?: { current: string }
  image?: {
    _type: 'image'
    asset: { _ref: string; _type: 'reference' }
    hotspot?: { x: number; y: number; height: number; width: number }
  }
  genres?: string[]
  website?: string
  bio?: string
}