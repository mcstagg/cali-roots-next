import { NextResponse } from 'next/server'
import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.SANITY_API_VERSION || '2025-01-01',
  useCdn: true,
})

export async function GET() {
  const docs = await client.fetch(`count(*[_type == "artist"])`)
  return NextResponse.json({ artists: docs })
}