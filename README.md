[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

# MilestoFund Frontend

This repository contains the frontend for MilestoFund — a React + Vite application using Tailwind CSS and Radix UI components. The frontend lives in the `frontend/` directory and is built with Vite.

## Features

- React 18 with Vite
- Tailwind CSS for styling
- Radix UI components
- Recharts for charts
- Axios for API requests

## Quick start

Prerequisites:
- Node.js 18+ (or compatible)
- npm (or yarn/pnpm)

Install and run locally:

```bash
# move into the frontend folder
cd frontend

# install dependencies
npm install

# start dev server
npm run dev
```

Open the app at http://localhost:5173 (Vite's default)

Build for production:

```bash
cd frontend
npm run build
# preview the production build
npm run preview
```

## Environment variables

This project uses Vite, so any environment variables used by client code should be prefixed with `VITE_`.

Recommended:
- `VITE_API_BASE_URL` — base URL for the backend API

Add them to a `.env` file in `frontend/` (e.g. `frontend/.env.local`) or set them in your hosting provider.

## Project structure (important files)

- `frontend/` – application root
  - `frontend/src/` – React source code
  - `frontend/public/` – static assets
  - `frontend/index.html` – app entry HTML
  - `frontend/package.json` – scripts and dependencies
  - `frontend/vite.config.js`, `tailwind.config.js`, `postcss.config.js`

For more details about the frontend itself, see `frontend/README.md` below.

## Scripts

From the `frontend/` directory:
- `npm run dev` — start development server
- `npm run build` — build production bundle
- `npm run preview` — locally preview production build

## Contributing

If you want to contribute, please open an issue or a pull request. Describe the problem or the change and include steps to reproduce if applicable.

## License

This project is licensed under the MIT License — see the [LICENSE](./LICENSE.md) file for details.

---

## Frontend — detailed

# CrowdFund — Frontend

> React + Tailwind CSS + ShadCN UI crowdfunding platform frontend

[![Netlify Status](https://api.netlify.com/api/v1/badges/placeholder/deploy-status)](https://app.netlify.com)

---

## 🌐 Deployment Link

**Live App:** `https://crowdfund-platform.netlify.app`

**Backend API:** `https://crowdfund-backend.onrender.com/api`

---

## 📋 Project Description

CrowdFund is a full-featured crowdfunding platform where creators can launch campaigns and backers can discover and support projects they believe in. Built with React and powered by a Node.js + Supabase/Express backend (backend repo not included here).

---

## ✨ Features

### For Backers
- 🔍 **Discover** — Browse, search, and filter hundreds of projects by category and sort
- 💳 **Back Projects** — Contribute via Stripe with reward tier selection
- 🔖 **Save Projects** — Bookmark campaigns to revisit later
- 📊 **Backing History** — View all contributions with project status updates
- 🤖 **AI Recommendations** — Personalised project suggestions based on backing history

### For Creators
- 🚀 **Launch Campaigns** — Full project builder with rewards, milestones, cover image
- 📈 **Creator Dashboard** — Revenue charts, backer count, recent activity
- 📣 **Post Updates** — Keep backers informed with project updates
- 🏆 **Impact Reports** — Publish post-funding impact summaries
- 🎯 **Milestone Tracking** — Auto-triggered milestones as funding grows

### Platform
- 🌙 **Dark Mode** — Persistent theme toggle
- 📱 **Fully Responsive** — Mobile-first design
- ⚡ **Fast** — Vite build tooling
- 🔒 **Secure Auth** — JWT with auto-refresh and protected routes

---

## 🛠️ Tech Stack

| Category     | Technology                         |
|--------------|------------------------------------|
| Framework    | React 18                           |
| Styling      | Tailwind CSS 3                     |
| UI Library   | ShadCN UI (Radix primitives)       |
| HTTP Client  | Axios                              |
| Routing      | React Router DOM v6                |
| Charts       | Recharts                           |
| Icons        | Lucide React                       |
| Build Tool   | Vite 5                             |
| Deployment   | Netlify                            |

---

## 📂 Folder Structure

```
src/
│
├── components/
│   ├── ui/
│   │   ├── button.jsx       ← ShadCN Button with CVA variants
│   │   ├── card.jsx         ← Card, CardHeader, CardContent, CardFooter
│   │   ├── index.jsx        ← Input, Label, Badge, Progress, Separator
│   │   └── toast.jsx        ← Toast notification system
│   │
│   ├── Navbar.jsx           ← Fixed navbar with dark mode + user menu
│   ├── ProjectCard.jsx      ← Reusable project card with progress
│   ├── ProjectWidgets.jsx   ← ProgressBar, RewardTier components
│   └── Loader.jsx           ← Spinner, PageLoader, CardSkeleton
│
├── pages/
│   ├── HomePage.jsx         ← Hero, trending, categories, CTA
│   ├── DiscoverPage.jsx     ← Search + filter + paginated grid
│   ├── ProjectDetailPage.jsx← Full project view + backing + comments
│   ├── CreateProjectPage.jsx← Multi-step project creation form
│   ├── DashboardPage.jsx    ← Creator analytics dashboard
│   ├── AuthPages.jsx        ← Login + Register pages
│   └── OtherPages.jsx       ← Profile, Saved, PaymentSuccess, 404
│
├── context/
│   ├── AuthContext.jsx      ← Global auth state + login/logout
│   └── ThemeContext.jsx     ← Dark/light mode with localStorage
│
├── services/
│   └── api.js              ← All Axios calls (auth, projects, payments, users)
│
├── hooks/
│   └── useToast.js         ← Toast notification hook
│
├── utils/
│   ├── cn.js               ← clsx + tailwind-merge helper
│   └── format.js           ← formatMoney, daysLeft, fundingPct
│
├── App.jsx                 ← Router, protected routes, layout
└── main.jsx                ← React entry point
```

---

## 🚀 Installation & Local Setup

**Prerequisites:** Node.js ≥ 18, Backend API running

```bash
# 1. Clone
git clone https://github.com/YOUR_USERNAME/crowdfund-frontend.git
cd crowdfund-frontend

# 2. Install dependencies
npm install

# 3. Environment (optional for local dev — Vite proxy handles /api)
cp .env.example .env
# For local dev, leave VITE_API_URL empty — proxy sends /api to localhost:5000

# 4. Start development server
npm run dev
# → http://localhost:5173
```

**For production build:**
```bash
npm run build
# Output in /dist folder
```

---

## 🔗 Integration with Backend

All API calls use the `api.js` service layer:

```js
// Axios automatically attaches JWT token
import { projectService } from './services/api';

const { data } = await projectService.getAll({ category: 'Technology', page: 1 });
```

The `VITE_API_URL` environment variable sets the backend base URL:
- **Development:** Leave empty → Vite proxy (`/api` → `localhost:5000`)
- **Production:** Set to your Render URL, e.g. `https://crowdfund-backend.onrender.com/api`

---

## ☁️ Deployment on Netlify

1. `npm run build` to verify build succeeds locally
2. Push to GitHub
3. Netlify → **New site from Git** → select your repo
4. Set:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
5. Add environment variable: `VITE_API_URL=https://your-backend.onrender.com/api`
6. Deploy

> **Important:** Create a `_redirects` file in `/public`:
> ```
> /*    /index.html   200
> ```
> This ensures React Router works correctly on Netlify.

---

## 🔐 Login Credentials (Demo)

If you seed demo data, use:

| Role    | Email               | Password  |
|---------|---------------------|-----------|
| User    | demo@example.com    | demo1234  |
| Creator | creator@example.com | demo1234  |

> Or register a new account — it works immediately.

---

## 🔧 Key Components

### `AuthContext`
Manages global authentication state. Provides `user`, `login()`, `logout()`, `register()`, and `isLoggedIn` to the entire app.

### `ProjectCard`
Reusable card displaying project cover image, category badge, funding progress bar, backer count, and days remaining.

### `api.js` Service Layer
All HTTP calls centralised here. Axios interceptors auto-attach JWT tokens and redirect to `/login` on 401 errors.

### Dark Mode
ThemeContext persists preference to `localStorage` and toggles `dark` class on `<html>`, activating Tailwind's dark variants.
