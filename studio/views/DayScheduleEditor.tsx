import * as React from 'react'
import {useClient} from 'sanity'
import {Stack, Card, Heading, Text, Flex, Box, Button, Select, TextInput} from '@sanity/ui'

type DocViewProps = {
  documentId: string
  document: {displayed?: any}
}

type ArtistLite = {_id: string; name: string}
type Ref = {_type: 'reference'; _ref: string}
type Slot = {_key: string; stage?: string; start?: string; end?: string; artist?: Ref}

export function DayScheduleEditor({documentId, document}: DocViewProps) {
  const client = useClient({apiVersion: '2025-01-01'})
  const day = (document?.displayed ?? {}) as {date?: string; slots?: Slot[]}
  const [artists, setArtists] = React.useState<ArtistLite[]>([])

  React.useEffect(() => {
    client.fetch<ArtistLite[]>(`*[_type=="artist"]{_id,name} | order(name asc)`).then(setArtists)
  }, [client])

  const fmtDay = (date?: string) => {
    if (!date) return ''
    const [y,m,d] = date.split('-').map(Number)
    return new Intl.DateTimeFormat('en-US',{
      timeZone:'UTC', weekday:'short', month:'short', day:'numeric', year:'numeric'
    }).format(new Date(Date.UTC(y, m-1, d)))
  }
  const toISO = (local?: string) => (local ? new Date(local).toISOString() : undefined)

  const patch = (setObj: Record<string, unknown>) =>
    client.patch(documentId).set(setObj).commit({autoGenerateArrayKeys: true})

  const addSlot = async () => {
    const newSlot: Slot = {
      _key: crypto.randomUUID(),
      stage: 'Bowl',
      start: new Date().toISOString(),
      end: new Date(Date.now()+60*60*1000).toISOString(),
    }
    await client
      .patch(documentId)
      .setIfMissing({slots: []})
      .insert('after', 'slots'[-1], [newSlot])
      .commit({autoGenerateArrayKeys: true})
  }

  const delSlot = async (key: string) =>
    client.patch(documentId).unset([`slots[_key=="${key}"]`]).commit()

  const slots = day.slots ?? []

  return (
    <Stack space={4} padding={4}>
      <Heading size={2}>Schedule — {fmtDay(day.date)}</Heading>
      <Button text="Add slot" onClick={addSlot} />

      {slots.length === 0 && <Text muted>No slots yet.</Text>}

      {slots.map((s) => (
        <Card key={s._key} padding={3} radius={2} border>
          <Flex wrap="wrap" gap={3} align="center">
            {/* Stage */}
            <Box style={{minWidth: 150}}>
              <Text size={1} muted>Stage</Text>
              <Select
                value={s.stage ?? 'Bowl'}
                onChange={(e) =>
                  patch({[`slots[_key=="${s._key}"].stage`]: e.currentTarget.value})
                }
              >
                <option>Bowl</option>
                <option>Garden</option>
              </Select>
            </Box>

            {/* Start */}
            <Box style={{minWidth: 220}}>
              <Text size={1} muted>Start</Text>
              <TextInput
                type="datetime-local"
                value={s.start ? new Date(s.start).toISOString().slice(0,16) : ''}
                onChange={(e) =>
                  patch({[`slots[_key=="${s._key}"].start`]: toISO(e.currentTarget.value)})
                }
              />
            </Box>

            {/* End */}
            <Box style={{minWidth: 220}}>
              <Text size={1} muted>End</Text>
              <TextInput
                type="datetime-local"
                value={s.end ? new Date(s.end).toISOString().slice(0,16) : ''}
                onChange={(e) =>
                  patch({[`slots[_key=="${s._key}"].end`]: toISO(e.currentTarget.value)})
                }
              />
            </Box>

            {/* Artist */}
            <Box style={{minWidth: 240}}>
              <Text size={1} muted>Artist</Text>
              <Select
                value={s.artist?._ref ?? ''}
                onChange={(e) =>
                  patch({[`slots[_key=="${s._key}"].artist`]: {_type:'reference', _ref: e.currentTarget.value}})
                }
              >
                <option value="" disabled>Select artist…</option>
                {artists.map(a => <option key={a._id} value={a._id}>{a.name}</option>)}
              </Select>
            </Box>

            <Box flex={1} />
            <Button tone="critical" text="Delete" onClick={() => delSlot(s._key)} />
          </Flex>
        </Card>
      ))}
    </Stack>
  )
}
