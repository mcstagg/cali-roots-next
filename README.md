This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# The Stack at a Glance

## 1) Next.js (App Router) → the **frontend/runtime**

* **Server components** (default): fetch data on the server, never ship secrets.
* **Client components** (`"use client"`): interactivity (hooks, event handlers).
* **Routing**: folders under `app/` become routes; `page.tsx`, `layout.tsx`, `api/*/route.ts`.
* **Build output**: `.next/` (don’t commit).
* **Env**: `process.env.*` (client can only see `NEXT_PUBLIC_*`).

## 2) Sanity → the **content system (CMS/Lake/Studio)**

* **Studio app** (`/studio`): editors log in, edit content. Your `schemaTypes` define fields/validation.
* **Content Lake**: hosted JSON store you query with **GROQ**.
* **Sanity client**: `createClient({...})` to `fetch()` data.

  * Public (read-only): no token, `useCdn: true`.
  * Server-only (writes/secure reads): token, `useCdn: false`.

## 3) TypeScript → the **safety net**

* **Interfaces/Types**: describe the shape of content your UI expects.
* Two styles:

  * **Doc** types: mirror full Sanity schema.
  * **DTO** types: match each query’s projection (lighter, great DX).
* Use typed fetches: `sanityClient.fetch<MyType>(query)`.

## 4) Tailwind → the **styling system**

* **globals.css** imports Tailwind and defines CSS vars (light/dark).
* `@theme inline` maps your vars to Tailwind tokens → `bg-background`, `text-foreground`, `font-sans`.
* Add classes in TSX; dark mode auto-switches via your CSS variables.

## 5) pnpm Workspaces → the **repo manager**

* One repo, multiple apps: root Next app + `studio/`.
* `pnpm-workspace.yaml` → single lockfile, one `pnpm install` at the root.
* Run per app:

  * `pnpm --filter . dev` (Next)
  * `pnpm --filter studio dev` (Studio)

---

# How Data Flows

1. **Editor** updates content in **Studio** → saved in **Content Lake**.
2. **Next.js** renders a page:

   * Server component runs a **GROQ** query via **Sanity client**.
   * Data typed as **DTO** or **Doc** interface.
   * TSX renders UI with Tailwind classes.
3. Optional: **API route** (`app/api/.../route.ts`) as a server facade if you need client fetching without exposing secrets.

---

# Where Things Live

* **Routing & UI**: `app/**`
* **Global shell**: `app/layout.tsx`
* **Global CSS**: `app/globals.css`
* **Sanity client & queries**: `lib/sanity.client.ts`, `lib/queries.ts`
* **Types/Interfaces**: `/interfaces/**` (export via `/interfaces/index.ts`)
* **Studio**: `studio/**` (schemas in `studio/schemaTypes/**`)
* **Env**: `.env.local` at repo root
* **Workspace config**: `pnpm-workspace.yaml` at root

---

# Typical Feature Workflow

1. **Design content** → add/adjust schema in `studio/schemaTypes/*`.
2. **Seed/edit content** in Studio (localhost:3333 or hosted).
3. **Write GROQ** projection in `lib/queries.ts`.
4. **Type the result**: add/update DTO in `/interfaces`.
5. **Fetch in page**: `sanityClient.fetch<MyDTO>(query)`.
6. **Render** with Tailwind + your theme tokens.

---

# Minimal Command Cheat Sheet

```bash
# install all deps (workspace)
pnpm install

# dev servers
pnpm --filter . dev          # Next.js at http://localhost:3000
pnpm --filter studio dev     # Sanity Studio at http://localhost:3333

# build
pnpm --filter . build
pnpm --filter studio build

# deploy studio (if using Sanity hosting)
pnpm --filter studio dlx sanity@latest deploy
```
---

# Common Gotchas (and fixes)

* **Hydration mismatch**: locale/timezone differences → prefer fixed locale (`'en-US'`) and avoid `Date.now()` in rendered markup unless memoized.
* **Cannot read property ‘name’ of artist**: your type was a **reference** but you used fields → dereference in GROQ: `artist-> { name }` or flatten `"artistName": artist->name`.
* **Multiple lockfiles warning**: add `pnpm-workspace.yaml`, keep only root lockfile.
* **Client seeing secrets**: only use `NEXT_PUBLIC_*` on the client; keep tokens in server files/routes.
* **Missing `node_modules` in studio**: with workspaces, one `pnpm install` at the root handles both; otherwise `cd studio && pnpm install`.

---

# What to Do If You Feel Stuck

1. **Verify env**: `echo $NEXT_PUBLIC_SANITY_PROJECT_ID` (or log `process.env` in a server file).
2. **Test Sanity**: `app/api/sanity-test/route.ts` returning `count(*)` confirms connectivity.
3. **Check query in Studio Vision**: ensure GROQ returns what your interface expects.
4. **Type the fetch**: add `<MyDTO>` to `fetch()` and remove `any` from components.
5. **Check console + terminal**: Next.js prints very actionable errors.

---