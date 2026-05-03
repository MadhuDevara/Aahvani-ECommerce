<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# Backend & Supabase (permanent — all features)

Stack: **Next.js**, **Supabase**, **Vercel**. Follow every rule below for current and future work. No exceptions.

## Rule 1 — Always verify table structure first

Before writing **any** Supabase query, confirm in **Supabase Dashboard → Table Editor → that table → Definition**:

- Exact column names (never assume `user_id` vs `user_email`, etc.)
- Column types (`uuid`, `text`, `jsonb`, `timestamp`, …)
- **NOT NULL** columns that must appear on every insert
- Default values (so you know what to omit)
- Whether **RLS** is enabled

Never write a query against a table you have not verified in the dashboard (or an authoritative migration that matches production).

## Rule 2 — Always check RLS before going live

Every table should have **RLS enabled** in production. Before deploying, policies must match intent, for example:

- **products:** `SELECT` public; `INSERT` / `UPDATE` / `DELETE` admin-only (or as product policy requires)
- **orders:** `SELECT` / `INSERT` / `UPDATE` / `DELETE` own rows (`auth.uid() = user_id`) unless a documented server path uses the service role
- **wishlists:** own rows (this project uses **email** match — confirm policies against actual schema)
- **subscribers:** e.g. `INSERT` public / anon as designed; `SELECT` restricted as designed
- **cart:** own rows (`auth.uid() = user_id`) — verify against real `cart_*` table names

If RLS is off, data can be readable or writable by anyone with the anon key.

## Rule 3 — Insert payload must match the table exactly

Every insert must satisfy **all** required (NOT NULL) columns. Missing one → PostgREST error or failed row.

In development, log failures:

```ts
const { data, error } = await supabase.from('table').insert({ ... })
if (error) console.error('[table] insert failed:', error)
```

Never assume an insert succeeded without checking `error`.

## Rule 4 — User identity per table

This project uses **different** user keys per table. **Check the dashboard** before each query:

- **orders:** `user_id` (uuid) **and** `user_email` (text) — send **both** on insert where applicable
- **wishlists:** `user_email` (text) — **no** `user_id` column in the live schema used here
- **cart:** confirm columns (`user_id`, keys, JSON shape) before any cart query

Never assume every table uses `user_id`.

## Rule 5 — Handle common Supabase / Postgres error codes

Handle explicitly where it matters for UX:

| Code / signal | Meaning |
|---------------|--------|
| `23505` | Unique violation (duplicate email, wishlist line, etc.) |
| `PGRST205` | Relation not in schema cache (wrong **table** name) |
| `PGRST116` | Column / embed issue (wrong **column** or select) |
| `42501` | RLS / permission denied |

Do **not** show raw Supabase errors to end users; use short, human-friendly copy and log details in dev.

## Rule 6 — No dummy / hardcoded data as a substitute for real data

No seed arrays, mocks, or static fallbacks **pretending** to be live Supabase data. If Supabase returns **empty** → empty state UI. If Supabase returns **error** → error state UI. Do not silently substitute fake catalog or user data.

## Rule 7 — Auth before data

Before any **user-specific** query (cart, wishlist, orders, profile-bound data):

1. Resolve Supabase **session** first.
2. No session → login / sign-in prompt; do not fetch private rows.
3. With session → use `session.user.id` and `session.user.email` as required by **that table’s** contract.
4. On logout → clear client state that holds user data immediately.

Never show one user’s data to another. Never fetch private user data without a valid session (except documented public endpoints, e.g. guest-safe server routes).

## Rule 8 — Table name consistency

Confirm exact names in the dashboard (singular vs plural). Examples used in this repo:

- `wishlists` (plural), not `wishlist`
- `orders`, `products`, `subscribers` — **plural** as defined in Supabase

Wrong table name → `PGRST205` and confusing failures.

## Rule 9 — Test every Supabase operation

For each feature touching Supabase, verify:

- **INSERT** — row appears with all required fields
- **SELECT** — correct rows for that user / public rule
- **UPDATE** / **DELETE** — only intended rows; RLS blocks others
- **Logged-out** — blocked where policy requires auth

## Rule 10 — Optimistic UI with safe rollback

For wishlist and cart (and similar):

1. Update UI immediately (fast feel).
2. Send the Supabase request.
3. If the request fails → **rollback** UI to the previous state.
4. Do not re-fetch from Supabase after insert solely to “confirm” success — trust the optimistic update when `error` is absent; rely on re-fetch on **page load** or explicit **reload** when a full sync is required.

---

When in doubt: **Dashboard first**, then code. **RLS and identifiers** are never “obvious” — verify.
