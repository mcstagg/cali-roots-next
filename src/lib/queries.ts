import { groq } from 'next-sanity'

export const settingsQuery = groq`*[_type=="settings"][0]{siteTitle, primaryCtaLabel, primaryCtaUrl}`
export const lineupDaysQuery = groq`*[_type=="lineupDay"]|order(date asc){
  _id, date,
  slots[]{stage, start, end, artist-> {name, slug, image}}
}`
export const latestPostsQuery = groq`*[_type=="post"]|order(publishedAt desc)[0..4]{
  title, slug, publishedAt, excerpt
}`