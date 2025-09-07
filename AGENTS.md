# Repository Guidelines

## Project Structure & Module Organization
- Frontend: Next.js (TypeScript) in `app/` (routes) with shared code in `src/` (`components/`, `hooks/`, `services/`, `styles/`). Static assets in `public/` and `src/assets/`.
- Backend: Express API in `server/` (entry: `server/src/index.js`). API routes are under `server/src/routes/` and mount at `/api/*`.
- Tests: Unit tests colocated under `src/**/__tests__` (e.g., `src/components/__tests__/SearchFilters.test.tsx`). Playwright E2E/visual config in `playwright.config.js`.
- Scripts: Utility scripts in `scripts/` (e.g., `optimize-images.js`). Deployment configs: `next.config.mjs`, `vercel.json`.

## Build, Test, and Development Commands
- Dev (frontend): `npm run dev` — start Next.js locally.
- Dev (backend): `npm run dev:server` — start Express API (default `PORT=3001`).
- Dev (both): `npm run dev:all` — run frontend and backend together.
- Build/Start: `npm run build` then `npm start` — production build and serve.
- Lint: `npm run lint` — ESLint via `eslint.config.js`.
- Unit tests: `npm test` (Vitest), `npm run test:coverage`, `npm run test:ui`.
- Playwright: `npm run playwright:install` (once), then examples like `npm run test:mobile`, `npm run test:desktop`, `npm run test:visual`.
- Data: `npm run db:init`, `npm run db:seed` (execute from project root; runs in `server/`).

## Coding Style & Naming Conventions
- Language: TypeScript, React 19, Next.js 15, Tailwind CSS.
- Linting: typescript‑eslint recommended rules; fix warnings before PRs.
- Naming: Components `PascalCase` in `src/components/`; hooks prefixed `use` in `src/hooks/`; tests named `*.test.ts`/`*.test.tsx` under `__tests__/`.
- Styles: Prefer Tailwind utility classes; shared tokens in `src/styles/`.

## Testing Guidelines
- Unit: Vitest + Testing Library. Place tests near implementation (`__tests__/`). Run `npm test` locally and ensure deterministic assertions.
- E2E/visual: Playwright projects defined in `playwright.config.js`. For visual baselines: `npm run update:visual-baselines`.

## Commit & Pull Request Guidelines
- Commits: Use imperative mood; prefer Conventional Commits when possible (e.g., `feat: add cart badge`, `fix: handle empty brands`). Keep changes focused.
- PRs: Include purpose, linked issues, testing notes, and screenshots/GIFs for UI changes. Ensure `npm run lint` and `npm test` pass.

## Security & Configuration Tips
- Environment: Frontend uses `.env.local` (e.g., `NEXT_PUBLIC_API_URL=http://localhost:3001/api`); backend uses `server/.env` (`PORT`, DB, Stripe). Never commit secrets.
- Next.js rewrites `/api/*` to the backend (see `next.config.mjs`). Align ports when running locally.
