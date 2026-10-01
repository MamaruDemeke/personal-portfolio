# Personal Portfolio — "Verdant" Edition

Production-ready personal portfolio built with **React (Vite) + Tailwind CSS + Framer Motion** on the front end and **Node.js (Express) + Firebase (Auth / Firestore / Storage)** on the back end.

## Design System

| Token | Value | Usage |
| --- | --- | --- |
| Obsidian | `#0A0F0D` | Page background |
| Emerald accent | `#10B981` | CTAs, highlights, glows |
| Muted sage | `#8DAA91` | Secondary text, meta labels |
| Surface | `#15221C` | Glassmorphic cards (`glass-card` utility) |

Typography: **Plus Jakarta Sans** (UI) and **Fira Code** (code/meta), loaded from Google Fonts.

## Project Structure

```
├── client/                  # React + Vite SPA
│   ├── src/
│   │   ├── components/      # Navbar, Hero, About, Experience, Projects, Contact…
│   │   │   └── admin/       # AdminDashboard, ContentForm, ProjectForm
│   │   │       └── content/ # one editor per content area (Profile, Hero, About…)
│   │   ├── pages/           # Portfolio (/) and Admin (/admin)
│   │   ├── hooks/           # useProjects (Firestore live query), useAuth,
│   │   │                    # useSiteContent (live site-content context)
│   │   ├── data/            # constants.js — fallback/seed content, edit here
│   │   ├── firebase.js      # Client SDK initialization
│   │   └── index.css        # Tailwind layers + glass utilities
│   ├── tailwind.config.js
│   └── vite.config.js       # Dev proxy: /api → localhost:5000
├── server/                  # Express API
│   ├── routes/contact.js    # POST /api/contact (validation + rate limit)
│   ├── services/email.js    # Nodemailer notification + auto-reply
│   ├── config/firebaseAdmin.js
│   └── index.js             # Serves API + static client build
├── firebase.json            # Firebase Hosting / Firestore / Storage config
├── firestore.rules          # Public read projects/site; admin-only writes/messages
├── storage.rules            # projects / cv / certificates / profile folders
├── Dockerfile               # Fullstack container (used by Verdent publish)
└── .verdentc.json           # Verdent deployment manifest (appPort 8080)
```

## 1. Prerequisites

- Node.js ≥ 18
- A [Firebase](https://console.firebase.google.com) project (Blaze plan required only for Hosting+Cloud Functions; this setup uses plain Hosting + any Node host for the API)

## 2. Firebase Console Setup (one time)

1. **Create project** → note the project ID.
2. **Authentication** → Sign-in method → enable **Email/Password**. Then *Users → Add user* — this becomes your `/admin` login.
3. **Firestore Database** → Create database (production mode). Collections `projects` and `messages` are created automatically on first write.
4. **Storage** → Create bucket (used for project cover images).
5. **Project settings → Service accounts → Generate new private key** — you'll paste this JSON into the server env below.
6. **Publish the rules** from this repo:
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase deploy --only firestore:rules,storage
   ```

## 3. Environment Variables

Copy the examples and fill them in:

```bash
copy client\.env.example client\.env
copy server\.env.example server\.env
```

### `client/.env` (public Firebase web config)

| Variable | Description |
| --- | --- |
| `VITE_FIREBASE_API_KEY` | Web API key (Firebase → Project settings → General) |
| `VITE_FIREBASE_AUTH_DOMAIN` | `<project-id>.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | Project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | `<project-id>.appspot.com` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Sender ID |
| `VITE_FIREBASE_APP_ID` | Web app ID |
| `VITE_API_URL` | Production API base URL (leave empty in dev) |

### `server/.env` (private)

| Variable | Description |
| --- | --- |
| `PORT` | API port (default 5000 dev / 8080 container) |
| `CORS_ORIGIN` | Comma-separated allowed origins |
| `FIREBASE_SERVICE_ACCOUNT` | Full service-account JSON on one line |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_SECURE` | SMTP server (Gmail: `smtp.gmail.com`, `465`) |
| `SMTP_USER` / `SMTP_PASS` | SMTP credentials (use an **App Password** for Gmail) |
| `CONTACT_TO_EMAIL` | Where notifications are sent |

> Never commit `.env` files — they are git-ignored.

## 4. Install & Run (development)

```bash
# from the repo root
npm --prefix server install
npm --prefix client install

# terminal 1 — API on http://localhost:5000
npm --prefix server run dev

# terminal 2 — SPA on http://localhost:5173 (proxies /api)
npm --prefix client run dev
```

## 5. Production Build

```bash
npm --prefix client run build     # → client/dist
npm start                          # Express serves API + client on $PORT
```

## 6. Admin Dashboard

Visit `/admin` and sign in with the Firebase Auth user you created.

### Content tab — everything on the public page

| Sub-tab | What you can edit |
| --- | --- |
| **Profile** | Name, brand, role, location, status pill, tagline, email, phones |
| **Files** | **CV upload (PDF, 10 MB)**, **logo upload**, **favicon upload** |
| **Hero** | Headline roles, all three CTA labels + anchors, show/hide the CV button |
| **About** | Greeting, highlighted words, bio paragraphs, stat cards (add/remove/reorder), availability card, location note |
| **Skills** | Skill categories — add, rename, reorder, delete |
| **Experience** | Timeline roles — add, rename, reorder, delete, with highlights and tech tags |
| **Certificates** | Add/reorder/delete certificates and **upload the PDF or image file** for each |
| **Socials** | Social links — add, reorder, delete, pick the icon |
| **Layout** | Navbar links (reorder/rename/hide) and per-section visibility + headings |
| **Projects** | The filter chips used by the gallery |
| **Contact** | Contact intro copy, button label, success message |

- Uploads are **resumable** (they survive connection blips) with a live percentage, and fall back to a direct upload if the resumable session stalls. Images are compressed in the browser before sending, so they upload fast on slow connections.
- **Uploads publish themselves** — the Storage URL is written to Firestore as soon as the file lands, so there is no second "Save & Publish" step for CV, logo, favicon, or certificate files. Other edits still need the Save button.
- Rejected uploads show the reason (rules not deployed, quota, bad file type, expired session).
- Edits auto-save to a **local draft**; hit **Save & Publish Changes** to push them to Firestore. The public site updates instantly via `onSnapshot`.
- **Discard** reverts to the last published version.

### Projects tab

Full CRUD with browser-side image compression, a reorder (▲▼) control, an inline featured toggle, and a category dropdown driven by Content → Projects.

### Messages tab

Read/unread inbox for contact submissions with delete.

Until you create the first project, the gallery falls back to the curated seed data in `client/src/data/constants.js`.

## 7. Deployment Options

### Option A — Verdent publishing (built-in)

The repo ships a `Dockerfile` (multi-stage: builds `client/dist`, installs server deps, single Node process serves both on `0.0.0.0:$PORT`) and a `.verdentc.json` fullstack manifest (`appPort: 8080`). Set the server env vars in **My app → Secrets**, then use the Publish button.

### Option B — Firebase Hosting + any Node host

1. `firebase deploy --only hosting` (frontend from `client/dist`).
2. Deploy `server/` to Render / Fly.io / Railway / Cloud Run and set its env vars there.
3. Put the API URL in `client/.env` as `VITE_API_URL=https://your-api-host` and rebuild.

## 8. Deploying

### Automatic (GitHub Actions)

Pushing to `main` builds the client and deploys Hosting, Firestore rules and
Storage rules. Workflow: `.github/workflows/deploy.yml`.

One-time setup — add these as **repository secrets** (Settings → Secrets and
variables → Actions → New repository secret):

| Secret | Value |
| --- | --- |
| `FIREBASE_SERVICE_ACCOUNT_JSON` | **Recommended.** Firebase console → ⚙ → Service accounts → Generate new private key → paste the whole JSON file contents as one line |
| `FIREBASE_TOKEN` | Fallback only — output of `firebase login:ci`. Unneeded if the secret above is set. |
| `VITE_FIREBASE_API_KEY` | from `client/.env` |
| `VITE_FIREBASE_AUTH_DOMAIN` | from `client/.env` |
| `VITE_FIREBASE_PROJECT_ID` | from `client/.env` |
| `VITE_FIREBASE_STORAGE_BUCKET` | from `client/.env` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | from `client/.env` |
| `VITE_FIREBASE_APP_ID` | from `client/.env` |
| `VITE_API_URL` | backend base URL, or leave empty |

The workflow builds `client/.env` from these secrets because that file is
gitignored. It also fails the build if the project ID is missing from
`dist/assets` — that check exists because a build without config sets
`firebaseReady = false` and silently disables every upload on the live site.

`FIREBASE_SERVICE_ACCOUNT_JSON` is the whole service account JSON pasted on one
line, with real newlines in `private_key` escaped as `\n`. The workflow handles
that itself; do not re-encode it by hand.

### Manual

`.firebaserc` points at project `portillo-c6a2d`:

```bash
npm --prefix client run build     # always build before deploying
firebase deploy --only hosting,firestore:rules,storage
```

> Uploads live in **Firebase Storage**, not Hosting. Hosting only serves the
> built `client/dist`; it is static and cannot accept uploads.

## 9. Security Notes

- `firestore.rules` and `storage.rules` enforce: public read of projects and site content, admin-only writes, anyone may create messages but only admins may read/modify them.
- Storage write limits enforced by rules: CV (PDF, 10 MB), certificates (PDF/image, 10 MB), project covers and profile images (image, 5 MB).
- The contact API applies validation (`express-validator`) and 5 requests / 15 min rate limiting per IP.
- All service-account keys and SMTP credentials live in server-only env vars; nothing private ships to the browser.

## 10. Customizing Your Content

Everything is editable at runtime from `/admin` → **Content**. `client/src/data/constants.js` only holds the fallback/seed content that is shown before you publish for the first time.
