Here are the **built-in types** you can use in `defineField({ type: '...' })` (Sanity v4 docs):

**Scalars**

* `string` – short text; supports option lists. ([Sanity.io][1])
* `text` – multi-line text area. ([Sanity.io][1])
* `number` – integers/floats. ([Sanity.io][1])
* `boolean` – true/false. ([Sanity.io][1])
* `date` – calendar date. ([Sanity.io][1])
* `datetime` – date + time. ([Sanity.io][1])
* `url` – URL input. ([Sanity.io][1])

**Media & spatial**

* `image` – images with hotspot/crops, metadata. ([Sanity.io][1])
* `file` – any uploaded file. ([Sanity.io][1])
* `geopoint` – latitude/longitude. ([Sanity.io][1])

**Relations**

* `reference` – link to another document (strong/weak, filterable). ([Sanity.io][2])
* `crossDatasetReference` – reference to a doc in **another dataset** (same project). ([Sanity.io][3])
* `globalDocumentReference` – special reference type used with **Media Library’s aspects** (connected content). ([Sanity.io][4])

**Structured / content**

* `slug` – URL-friendly string (usually sourced from a title). ([Sanity.io][1])
* `array` – list of other types (e.g., `of: [{type: 'string'}, {type: 'reference', to:[…]}]`). ([Sanity.io][1])
* `object` – group related fields into a nested object. ([Sanity.io][1])
* `block` – rich-text block (used **inside** an `array` to create Portable Text). ([Sanity.io][1])
* `span` – inline text spans inside a `block` (you rarely declare this directly). ([Sanity.io][1])

**Top-level**

* `document` – the type for top-level document schemas (not used as a field inside another document). ([Sanity.io][1])

---

### Notes & gotchas

* Some names are **reserved** and/or string-like aliases—e.g., `email`, `telephone`, `time`—so avoid redefining them; they’re treated as built-ins by Studio and validation helpers. ([Sanity.io][5])
* For arrays, use `defineArrayMember` to get better typing/IDE hints when declaring `of: […]`. The field’s own `type` is still `"array"`. ([Sanity.io][1])
* Portable Text = `array` of `{type: 'block'}` (plus any custom objects you allow inline). ([Sanity.io][1])

[1]: https://www.sanity.io/docs/studio/schema-types "Schema | Sanity Docs"
[2]: https://www.sanity.io/docs/studio/reference-type?utm_source=chatgpt.com "Reference | Sanity Docs"
[3]: https://www.sanity.io/docs/studio/cross-dataset-reference-type?utm_source=chatgpt.com "Cross Dataset Reference | Sanity Docs"
[4]: https://www.sanity.io/docs/studio/global-document-reference-type "Global Document Reference | Sanity Docs"
[5]: https://www.sanity.io/docs/help/schema-type-name-reserved?utm_source=chatgpt.com "Given type name is a reserved type"
