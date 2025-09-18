import { sanityClient } from '@/lib/sanity.client'
import { settingsQuery, lineupDaysQuery, latestPostsQuery } from '@/lib/queries'

function fmtDate(dt: string) {
  return new Date(dt).toLocaleDateString('en-US', { weekday:'short', month:'short', day:'numeric' })
}
function fmtTime(dt: string) {
  return new Date(dt).toLocaleTimeString('en-US', { hour:'numeric', minute:'2-digit' })
}

export default async function Home() {
  const [settings, days, posts] = await Promise.all([
    sanityClient.fetch(settingsQuery),
    sanityClient.fetch(lineupDaysQuery),
    sanityClient.fetch(latestPostsQuery),
  ])

  return (
    <main className="min-h-screen">
      <header className="p-4 border-b flex items-center justify-between">
        <h1 className="text-xl font-bold">{settings?.siteTitle ?? 'Festival'}</h1>
        {settings?.primaryCtaUrl && (
          <a href={settings.primaryCtaUrl} className="px-4 py-2 rounded bg-black text-white" target="_blank" rel="noopener noreferrer">
            {settings.primaryCtaLabel ?? 'Buy Tickets'}
          </a>
        )}
      </header>

      <section className="max-w-5xl mx-auto p-4">
        <h2 className="text-2xl font-semibold mb-3">Lineup</h2>
        <div className="space-y-6">
          {(days ?? []).map((d: any) => (
            <div key={d._id} className="border rounded p-4">
              <div className="text-sm font-medium mb-2">{fmtDate(d.date)}</div>
              <ul className="divide-y">
                {(d.slots ?? []).map((s: any) => (
                  <li key={s._key} className="py-2 flex items-center justify-between">
                    <div className="font-medium">{s.artist?.name ?? 'TBA'}</div>
                    <div className="text-sm text-gray-600">{s.stage} · {fmtTime(s.start)}–{fmtTime(s.end)}</div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto p-4 pb-12">
        <h2 className="text-2xl font-semibold mb-3">Latest News</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {(posts ?? []).map((p: any) => (
            <article key={p._id} className="border rounded p-4">
              <h3 className="font-semibold mb-1">{p.title}</h3>
              <div className="text-sm text-gray-600 mb-2">
                {p.publishedAt && new Date(p.publishedAt).toLocaleDateString()}
              </div>
              <p className="text-sm">{p.excerpt}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}