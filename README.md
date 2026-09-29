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
│   │   │   └── admin/       # AdminDashboard + ProjectForm
│   │   ├── pages/           # Portfolio (/) and Admin (/admin)
│   │   ├── hooks/           # useProjects (Firestore live query), useAuth
│   │   ├── data/            # constants.js — YOUR profile content, edit here
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
├── firestore.rules          # Public read projects; admin-only writes/messages
├── storage.rules            # Project images: public read, admin-only write
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

- Visit `/admin`, sign in with the Firebase Auth user you created.
- **Projects tab**: full CRUD (create, edit, delete, feature toggle) with Firebase Storage image upload. The public gallery live-updates via Firestore `onSnapshot`; until you create the first project, curated seed data from `client/src/data/constants.js` is displayed.
- **Messages tab**: read/unread inbox for contact submissions with delete.

## 7. Deployment Options

### Option A — Verdent publishing (built-in)

The repo ships a `Dockerfile` (multi-stage: builds `client/dist`, installs server deps, single Node process serves both on `0.0.0.0:$PORT`) and a `.verdentc.json` fullstack manifest (`appPort: 8080`). Set the server env vars in **My app → Secrets**, then use the Publish button.

### Option B — Firebase Hosting + any Node host

1. `firebase deploy --only hosting` (frontend from `client/dist`).
2. Deploy `server/` to Render / Fly.io / Railway / Cloud Run and set its env vars there.
3. Put the API URL in `client/.env` as `VITE_API_URL=https://your-api-host` and rebuild.

## 8. Security Notes

- `firestore.rules` and `storage.rules` enforce: public read of projects, admin-only writes, anyone may create messages but only admins may read/modify them.
- The contact API applies validation (`express-validator`) and 5 requests / 15 min rate limiting per IP.
- All service-account keys and SMTP credentials live in server-only env vars; nothing private ships to the browser.

## 9. Customizing Your Content

Edit `client/src/data/constants.js` — name, role, status pill text, socials, skill categories, experience timeline, and seed projects. Everything else reads from there.
