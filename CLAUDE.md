# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> **This is Next.js 16 with React 19 and Tailwind v4 — all three have breaking changes from your training data. Read `node_modules/next/dist/docs/` before writing unfamiliar APIs.**

## Commands

```bash
npm run dev      # dev server (Turbopack enabled by default in Next.js 16)
npm run build    # production build
npm run lint     # ESLint
```

No test suite is configured.

## Known: Dev Server Root Warning

`next.config.ts` must keep `turbopack: { root: __dirname }`. Without it, Turbopack auto-detects the home directory (`/Users/douglasfranca/`) as the workspace root (because there is a `package-lock.json` there), and starts watching the entire home directory — causing the dev server to freeze and crash the system. The `root: __dirname` pins Turbopack to this project directory only.

## Stack

- **Next.js 16.2.6** (App Router, Turbopack active by default)
- **React 19**
- **Tailwind CSS v4** — config lives entirely in `globals.css` via `@theme inline {}`. There is no `tailwind.config.js`. Use CSS variables like `bg-(--color-primary)` or utility classes derived from the theme block.
- **Supabase** — auth, Postgres, and Storage (`pieces`, `base-photos`, `results` buckets)
- **Replicate** — AI virtual try-on via IDM-VTON model

## Environment Variables

Copy `.env.local.example` to `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
VIRTUAL_TRYON_PROVIDER=mock   # or "replicate"
REPLICATE_API_TOKEN=           # required when provider=replicate
```

**Demo mode**: if `NEXT_PUBLIC_SUPABASE_URL` is absent, the app runs fully in-memory with fake data — no auth, no DB calls. All server actions branch on `isDemo` at the top of `src/lib/actions.ts`.

## Architecture

### Route Groups

```
src/app/
  page.tsx              # landing / root redirect
  (auth)/               # login, signup, onboarding — no layout chrome
  (app)/                # authenticated shell with AppNavbar + BottomNav
    pecas/              # wardrobe pieces (step 1)
    foto/               # base photo upload (step 2)
    composicao/         # look assembly (step 3)
    resultado/          # generation result (step 4)
    meus-looks/         # saved looks gallery
  api/
    generate/           # POST: starts a generation job
    generation/[id]/    # GET: polls job status
    webhook/            # POST: Replicate webhook callback
```

Middleware (`src/middleware.ts`) redirects unauthenticated users to `/login` and authenticated users away from auth routes.

### Data Flow for AI Generation

1. User uploads clothing pieces → stored in Supabase Storage + `pieces` table
2. User uploads a base photo → stored in `base-photos` bucket + `base_photos` table
3. `createLook()` server action links selected pieces into a `looks` + `look_pieces` record
4. `startGeneration()` calls the active provider, inserts a `generations` row (status=`pending`)
5. Client polls `pollGeneration()` every 3 s (max 60× / 3 min) until `completed` or `failed`
6. On completion a `results` row is written; user can then `saveLook()` → `saved_looks`

### Client Hooks

`src/hooks/` contains one hook per domain entity — `usePieces`, `useBasePhoto`, `useGeneration`, `useLooks`, `useDarkMode`. These wrap the server actions and manage local state for their respective pages.

### Provider Abstraction

`src/lib/providers/` implements `VirtualTryOnProvider` (see `types.ts`):

- **`mock`** — instant fake result, used in dev/demo
- **`replicate`** — calls Replicate IDM-VTON `predictions` API; `VIRTUAL_TRYON_PROVIDER=replicate` + `REPLICATE_API_TOKEN` required

Switch providers via `VIRTUAL_TRYON_PROVIDER` env var; `getProvider()` in `index.ts` resolves it at runtime.

### Supabase Clients

- `src/lib/supabase/client.ts` — browser client (for client components)
- `src/lib/supabase/server.ts` — server client; returns `{ client, user }` — always check `user` before DB calls
- `src/lib/supabase/middleware.ts` — session refresh in middleware

### Server Actions

All mutations are in `src/lib/actions.ts` (`"use server"`). Each action:
1. Checks `isDemo` and returns fake data if true
2. Creates a Supabase server client and verifies the user
3. Performs the operation
4. Calls `revalidatePath()` for cache invalidation

### Design Tokens

Defined in `src/app/globals.css` under `@theme inline`. Key tokens: `--color-primary` (#ff5c35 orange), `--color-wine` (#40001a), `--font-display` (Playfair Display), `--radius-*`.

### Database Schema

Tables: `profiles`, `pieces`, `base_photos`, `looks`, `look_pieces`, `generations`, `results`, `saved_looks`, `user_credits`. Full schema in `supabase/migrations/001_initial_schema.sql`. All tables have RLS enabled — policies restrict each user to their own rows. Migrations are applied manually via the Supabase SQL editor (no migration runner).

## Key Types

`src/types/index.ts` exports all domain types (`Piece`, `Look`, `Generation`, `Result`, `SavedLook`) and the `PIECE_SLOTS` config array (6 slots: top, bottom, shoes, other×3). Max upload: 10 MB; allowed: JPEG, PNG, WebP.
