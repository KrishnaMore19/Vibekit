# VibeKit Studio ⚡

> **Generate a theme, build a mini-site, publish it.**

A full-stack web app where users can pick a design "vibe", build a mini-site with a visual editor, and publish it to a live public URL.

**Live URL:** `https://vibekit12.netlify.app/` 

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, Framer Motion |
| Backend | Netlify Functions (serverless, Node.js) |
| Database | PostgreSQL (Supabase / Neon recommended) |
| Auth | JWT (httpOnly cookie + localStorage fallback) + bcrypt |
| Deployment | Netlify |

---

## Local Setup

### Prerequisites
- Node.js 18+
- PostgreSQL database (local or cloud — [Supabase](https://supabase.com) free tier recommended)
- [Netlify CLI](https://docs.netlify.com/cli/get-started/) (`npm i -g netlify-cli`)

### 1. Clone and install

```bash
git clone https://github.com/yourname/vibekit-studio.git
cd vibekit-studio

# Install frontend dependencies
npm install

# Install serverless function dependencies
cd netlify/functions && npm install && cd ../..
```

### 2. Set up environment variables

```bash
cp .env.example .env
# Edit .env with your actual values
```

Required variables:
```
DATABASE_URL=postgresql://user:password@host:5432/dbname
JWT_SECRET=your-very-long-random-secret-string
CLIENT_URL=http://localhost:5173   # (local dev)
```

### 3. Run the database migration

```bash
# Using psql:
psql "$DATABASE_URL" < migrations/001_init.sql

# Or using Supabase SQL editor — paste the contents of migrations/001_init.sql
```

### 4. Run locally

```bash
# Run frontend + functions together via Netlify Dev
netlify dev

# Or separately:
npm run dev           # Vite on port 5173
# functions run on port 8888 via Netlify Dev
```

Open: `http://localhost:8888`

---

## Deployment (Netlify)

### 1. Push to GitHub

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Connect to Netlify

- Go to [app.netlify.com](https://app.netlify.com)
- **New site → Import from Git → Select your repo**
- Build settings (auto-detected from `netlify.toml`):
  - Build command: `npm run build`
  - Publish directory: `dist`
  - Functions directory: `netlify/functions`

### 3. Configure environment variables

In **Netlify → Site Settings → Environment Variables**, add:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | Your PostgreSQL connection string |
| `JWT_SECRET` | Long random secret string |
| `CLIENT_URL` | Your Netlify app URL (e.g. `https://vibekit-studio.netlify.app`) |

### 4. Deploy

Netlify will auto-deploy. After deployment, run the SQL migration against your production database.

---

_(Create this account by signing up normally — no seed data needed)_

---

## Features

### Public
- **Landing page** (`/`) — Marketing page showcasing all 6 themes
- **Published pages** (`/p/:slug`) — Public mini-sites with theme applied, view count tracking

### Authentication
- Email + password signup/login
- Passwords hashed with bcrypt (12 rounds)
- JWT stored in httpOnly cookie + localStorage for resilience
- Session lasts 7 days

### Dashboard (`/app`)
- List all your pages (grid + list view)
- Stats: total pages, published, drafts, total views
- Search/filter pages
- Create, duplicate, delete pages
- Skeleton loaders on fetch

### Page Editor (`/app/edit/:id`)
- Live preview that updates as you type (auto-save every 1.5s)
- **Viewport toggle**: Desktop / Tablet (768px) / Mobile (375px) — changes actual iframe width
- **4 section editors**: Hero, Features (3–6 cards), Gallery (3–8 images), Contact
- **Reorder sections** with up/down buttons
- **Theme picker**: 6 vibe presets
- **Slug editor** with availability check + collision handling
- **Publish / Unpublish** toggle — enforced server-side

### Theme System
6 complete design presets, each with CSS custom properties:
- 🤍 **Minimal / Editorial** — clean white, red accent, Playfair Display
- ⚡ **Neo-Brutal** — yellow background, 0px radius, Bebas Neue
- 🌃 **Dark / Neon** — deep dark, cyan glow, Orbitron
- 🌸 **Pastel / Soft** — lavender tones, pill buttons, Cormorant Garamond
- 👑 **Luxury / Serif** — black + gold, serif typography
- 👾 **Retro / Pixel** — CRT green, Press Start 2P font

### Design Extras Implemented
1. **Micro-interactions** — hover/focus/pressed states on all interactive elements
2. **Subtle animations** — page entry, section reveal with Framer Motion, skeleton loaders
3. **Skeleton loaders** — dashboard page cards while data loads

---

## API Endpoints

All endpoints at `/api/*` → Netlify Function

### Auth
| Method | Path | Auth |
|--------|------|------|
| POST | `/api/auth/signup` | No |
| POST | `/api/auth/login` | No |
| POST | `/api/auth/logout` | No |
| GET | `/api/auth/me` | Yes |

### Pages (authenticated)
| Method | Path |
|--------|------|
| GET | `/api/pages` |
| POST | `/api/pages` |
| GET | `/api/pages/:id` |
| PUT | `/api/pages/:id` |
| DELETE | `/api/pages/:id` |
| POST | `/api/pages/:id/publish` |
| POST | `/api/pages/:id/unpublish` |
| POST | `/api/pages/:id/duplicate` |
| GET | `/api/pages/:id/slug-check?slug=...` |

### Public
| Method | Path |
|--------|------|
| GET | `/api/public/pages/:slug` |
| POST | `/api/public/pages/:slug/view` |
| POST | `/api/public/pages/:slug/contact` |

---

## Database Schema

```sql
users            — id, email, password_hash, name, created_at, updated_at
pages            — id, user_id, title, slug, theme, status, content (JSONB), view_count, ...
contact_submissions — id, page_id, page_slug, name, email, message, created_at
```

---

## Tradeoffs + What I'd Improve Next

1. **Image uploads vs URLs** — Currently gallery uses image URLs. Next: integrate Cloudinary or Supabase Storage for direct uploads with drag-and-drop.

2. **Single Netlify Function** — All routes are handled in one `api.js` file for simplicity. Next: split into domain-specific handlers (`auth.js`, `pages.js`, `public.js`) with shared middleware for cleaner separation of concerns.

3. **WYSIWYG vs structured editing** — Used structured form editors per section. A true drag-and-drop block builder (like a mini Webflow) would be the next evolution.

4. **Real-time collaboration** — Auto-save is per-user only. Adding WebSockets / Supabase Realtime for multi-cursor collaboration would be powerful.

5. **Custom domain mapping** — Published pages live at `/p/:slug`. A proper product would support custom domain attachment (CNAME → Netlify) per published page.

---

## Responsiveness Testing

Tested at:
- Mobile: 320px, 375px, 414px, 480px
- Tablet: 768px, 1024px
- Desktop: 1280px, 1440px, 1920px

All breakpoints pass: no horizontal scroll, 44px+ touch targets, no hover-only interactions, forms scroll-safe.
