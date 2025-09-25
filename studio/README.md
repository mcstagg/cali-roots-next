# Sanity Clean Content Studio

https://caliroots-clone.sanity.studio/

Congratulations, you have now installed the Sanity Content Studio, an open-source real-time content editing environment connected to the Sanity backend.

Now you can do the following things:

- [Read “getting started” in the docs](https://www.sanity.io/docs/introduction/getting-started?utm_source=readme)
- [Join the Sanity community](https://www.sanity.io/community/join?utm_source=readme)
- [Extend and build plugins](https://www.sanity.io/docs/content-studio/extending?utm_source=readme)

# Mental model (3 things, 3 lifecycles)

1. **Content (documents in Sanity’s Content Lake)**

   * Lives in a **dataset** (e.g., `production`, `staging`).
   * Changes when an editor creates/edits/publishes in Studio (or via API).
   * Updates are **immediate** and globally visible to anyone querying that dataset.

2. **Studio code (your `studio/` folder)**

   * The **editor UI**: schemas, desk structure, custom inputs/actions, config.
   * Lives in your Git repo and deployments (Sanity-hosted subdomain or `/studio` route).
   * Only changes when **you** ship new code (devs), not when content changes.

3. **Next.js site (your app)**

   * Queries the Content Lake.
   * What users see depends on your caching strategy (dev = live, prod = ISR/cache + webhooks).

---

# What happens when an **Editor** changes content?

* In the Studio, they edit a **draft** (`_id` like `drafts.<docId>`).
* On **Publish**, Sanity writes a **published** version (`<docId>`) into the dataset.
* The **dataset** is now updated immediately. No Studio rebuild is required, and your local Studio dev server doesn’t need a restart.

### How each environment reacts

* **Local Studio dev (`sanity dev`)**:
  Reads/writes the *same remote dataset*. As soon as content changes in the cloud, dev Studio shows it (refresh or navigate is enough). Builds don’t matter here.
* **Hosted Studio**:
  Also just a UI; it reflects content instantly after publish.
* **Next.js (dev mode)**:
  Server components fetch from Sanity each render → you’ll see changes right away.
* **Next.js (production)**:
  If you use ISR/route caching, pages won’t update until their **revalidation** runs.

  * Fix: set up a **Sanity → Next webhook** to call your `/api/revalidate` and tag/route revalidation so publishes show up quickly.

---

# Concurrency & “conflicts” while editing

* Sanity supports **real-time, multi-user editing**. Presence and cursors prevent most collisions.
* Draft/publish split means editors rarely clobber each other: the **draft** is merged live; **publish** replaces the non-draft snapshot atomically.
* Net effect: “last write wins” per field, *but* Studio’s collaboration UI makes it hard to step on toes (you see each other in the doc).
* There’s no Git-style merge you manage—Sanity handles the operational transforms under the hood.

---

# The critical distinction: **Content changes** vs **Schema/code changes**

## Content changes (Editor role)

* Safe. No deploy needed.
* Immediate in dataset, subject only to Next.js caching.
* Your queries/types should already tolerate the current shape.

## Schema/code changes (Developer role)

* This is **code**, not content. You **must** rebuild/redeploy the Studio to propagate new fields/validation/desk structure.
* The dataset **does not auto-migrate**. If you rename fields or change types, old documents keep old data until you migrate them.

### Avoid breakage during schema evolution

* **Backwards-compatible queries** during rollout:

  ```groq
  name := coalesce(newName, oldName)
  ```

  That lets your Next.js app work whether docs have the old or new field.

* **Plan a content migration** when you *rename* or *reshape* fields:

  1. Clone or copy dataset to a **staging** dataset.
  2. Deploy new schema to a **staging Studio** pointed at that dataset.
  3. Run a **migration script** (Node + `@sanity/client`) to transform docs.
  4. Verify UI + Next queries/types against staging.
  5. Migrate production dataset, then deploy Studio + Next changes.

* **Use dataset aliases** for zero-downtime flips (optional advanced pattern):
  Point “live” alias at the validated dataset version, then switch the alias.

---

# How this affects your **local Studio dev** specifically

* Local Studio dev **always talks to whatever dataset** your `sanity.config.ts` is configured to (e.g., `dataset: "production"`).
* If an editor publishes from the hosted Studio, you’ll see it locally right away.
* Building (`sanity build`) does **not** change dev behavior; it only produces a production bundle for `sanity start` or deploy.

---

# How this affects your **Next.js app**

* **In dev**: live queries → instant updates.
* **In prod**: set `revalidate` (ISR) per page/route **and** wire **webhooks**:

  * Sanity webhook → `/api/revalidate` in Next → call `revalidatePath('/artists')` or `revalidateTag('artist')`.
  * Prefer **tags** so you can revalidate multiple routes precisely when related docs change.

Minimal example (App Router):

```ts
// app/api/revalidate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

export async function POST(req: NextRequest) {
  const body = await req.json();
  // validate secret, inspect body.ids/types, choose tag(s)
  revalidateTag('artist');
  return NextResponse.json({ revalidated: true });
}
```

Then in your fetchers:

```ts
// cache-aware fetch
const data = await sanityClient.fetch(query, params, { next: { tags: ['artist'] }});
```

---

# Role boundaries (why Editors can’t “break” schemas)

* **Editors** can only change **content**. The schema/UI they see is whatever **Studio code** you’ve deployed.
* They **cannot** alter schemas or project config unless they have elevated project/org roles.
* Validation happens in the Studio UI; the Content Lake itself is schemaless, which is why **developer-led migrations** matter when you change shape.

---

# Recommended workflow for your stack (cali-roots-next)

1. **Daily content** (Editors)

   * Use hosted Studio (or `/studio`) → Edit/Publish → webhook revalidates Next pages.
   * No builds or deploys.

2. **Feature or schema change** (Developers)

   * Branch: update **schemas**, **GROQ**, **Zod types**, and **Next components**.
   * Create/point to a **staging dataset**; deploy a **staging Studio** against it.
   * Run a **migration script** if field names/types changed.
   * Use `coalesce()` in queries temporarily for forward/backward compatibility.
   * When ready: deploy Studio + Next, migrate prod dataset, remove temporary `coalesce()` once all docs conform.

3. **Caching**

   * Set `revalidate` on pages (e.g., `export const revalidate = 60`).
   * Prefer **tagged** fetch + **webhook-triggered revalidateTag** for near-instant freshness on publishes.

4. **Safety rails**

   * Keep **Editors** at the **project** level (not org).
   * Add Studio **document action filters** to remove risky actions for non-admins (e.g., hide Delete).
   * Use **singleton** docs (e.g., `settings`) so marketing can’t create duplicates.

---

# Quick answers to common “will this conflict?” worries

* **Two editors typing in the same doc?** Studio is collaborative; changes merge in real time. Publishing is atomic.
* **Editor publishes while I’m changing schema code?**
  Content is fine; but your **new Studio build** might hide/move fields. Use staging and ship code + migrations together.
* **Can content changes break my Next site?**
  Only if queries/types assume fields that aren’t there. Use Zod validation + sensible defaults and you’ll surface errors early.

---

Decide which schema you plan to evolve next (e.g., `artist` field rename), and sketch the exact migration snippet, GROQ `coalesce` changes, and the webhook tags to wire so it’s smooth end-to-end.