// studio/structure.ts
import type { StructureResolver, DefaultDocumentNodeResolver } from 'sanity/structure'
import {DayScheduleEditor} from './views/DayScheduleEditor'

export const structure: StructureResolver = (S) =>
  S.list().title('Content').items([
    S.documentTypeListItem('settings'),
    S.listItem().title('Schedule').child(
      S.documentTypeList('lineupDay')
        .title('Days')
        .defaultOrdering([{ field: 'date', direction: 'asc' }])
    ),
    S.documentTypeListItem('lineupDay'),
    S.documentTypeListItem('artist'),
    S.documentTypeListItem('page'),
    S.documentTypeListItem('post'),
    // ...add more, or spread the defaults:
    // ...S.documentTypeListItems()
  ])

export const defaultDocumentNode: DefaultDocumentNodeResolver = (S, {schemaType}) => {
  if (schemaType === 'lineupDay') {
    // First view = default selected tab
    return S.document().views([
      S.view.component(DayScheduleEditor).title('Schedule').id('schedule'),
      S.view.form().title('Form'), // keep the classic form as a second tab (optional)
    ])
  }
  return S.document().views([S.view.form()])
}