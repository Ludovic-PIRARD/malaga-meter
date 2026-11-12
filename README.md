# Malaga Meter

Private, live multi-user board for a Málaga trip group: per-person status levels, daily counters, photo/video uploads, and noon-to-noon history (Europe/Madrid). Access requires a shared trip code.

## Free stack

| Piece | Service | Cost |
|--------|---------|------|
| App hosting | [GitHub Pages](https://pages.github.com/) / [Cloudflare Pages](https://pages.cloudflare.com/) / [Vercel](https://vercel.com/) / [Netlify](https://netlify.com/) | Free |
| Database + live sync + media | [Supabase](https://supabase.com/) free project | Free |

Without Supabase keys the UI runs in **local preview** mode (this browser only).

## Setup

1. Create a free Supabase project.
2. Run `supabase/schema.sql`, then `supabase/lock-down.sql`, in the SQL Editor.
3. Create one shared Auth user (auto-confirm) and disable public sign-ups.
4. Confirm Storage bucket `media` exists.
5. Copy **Project URL** and **anon/publishable** key from **Settings → API**.

```bash
cd malaga-meter
cp .env.example .env
npm install
npm run dev
```

Set in `.env`:

```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=...
VITE_TRIP_EMAIL=your-shared-account@email.com
```

## Deploy

```bash
VITE_BASE=/malaga-meter/ npm run build
```

Publish `dist/` (or use GitHub Pages from the `gh-pages` branch). Set the same `VITE_` variables at build time.

## Notes

- Prefer short clips and compressed photos on the free storage plan.
- Keep the trip code private; it unlocks the live board for the group only.
