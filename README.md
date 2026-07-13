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

For more details about the frontend itself, see `frontend/README.md`.

## Scripts

From the `frontend/` directory:
- `npm run dev` — start development server
- `npm run build` — build production bundle
- `npm run preview` — locally preview production build

## Contributing

If you want to contribute, please open an issue or a pull request. Describe the problem or the change and include steps to reproduce if applicable.

## License

No license file was found in the repository. If you intend to make this project open-source, add a `LICENSE` file to the repo.

---

If you want, I can:
- Copy the frontend README contents into the repository root and adapt it.
- Add a LICENSE file (you pick the license).
- Add a short project demo GIF or screenshots to the README.
