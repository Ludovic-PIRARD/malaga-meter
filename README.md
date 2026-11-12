# Malaga Meter

Live, multi-user board for the Málaga trip: drunkness (0–10), drink counts, per-person photo/video evidence, and noon-to-noon history (Europe/Madrid). Anyone with the link can edit everything.

## Free stack

| Piece | Service | Cost |
|--------|---------|------|
| App hosting | [Cloudflare Pages](https://pages.cloudflare.com/) or [Vercel](https://vercel.com/) or [Netlify](https://netlify.com/) | Free |
| Database + live sync + media | [Supabase](https://supabase.com/) free project | Free |

Without Supabase keys the UI runs in **local preview** mode (this browser only). Add keys for the shared live link.

Access is locked with a **shared trip code** (Supabase Auth). After setup, run `supabase/lock-down.sql` so the database rejects anonymous reads.

## 1. Create a free Supabase project

1. Sign up at [supabase.com](https://supabase.com) and create a project.
2. Open **SQL Editor**, paste and run `supabase/schema.sql`.
3. Confirm Storage bucket `media` exists and is **public** (Dashboard → Storage).
4. Copy **Project URL** and **anon public** key from **Settings → API**.

## 2. Configure the app

```bash
cd malaga-meter
cp .env.example .env
```

Edit `.env`:

```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

## 3. Run locally

```bash
npm install
npm run dev
```

## 4. Deploy and share one link

Build:

```bash
npm run build
```

Deploy the `dist/` folder (or connect the Git repo) to Cloudflare Pages / Netlify / Vercel. Set the same two `VITE_` environment variables in the host dashboard, then redeploy.

Send friends the public URL. No accounts; open edit for everyone on the link.

## Behaviour

- **Drunkness** slider 0–10 with labels.
- **Drinks** +/− counters.
- **Day cycle** resets at 12:00 Europe/Madrid; prior days remain under Previous days.
- **Media** attaches to a person after expanding their panel (photos ≤ 8 MB, videos ≤ 40 MB on the free plan).

## Notes

- The free Supabase plan includes limited storage; prefer short clips and compressed photos.
- The link is open: treat it as a private group URL and do not post it publicly if you care about spam.
