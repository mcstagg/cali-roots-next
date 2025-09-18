// Portable Text block type (rich text content)
export interface BlockContent {
  _key: string
  _type: 'block'
  children: Array<{
    _key: string
    _type: 'span'
    text: string
    marks?: string[]
  }>
  markDefs?: Array<any>
  style?: string
}