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

## Issue Tracking with Beads (bd)

**We track work in Beads instead of Markdown.** Use the `bd` tool for all issue management and task tracking.

### Quick Start
```bash
# Find ready work to claim
./beads/bd.exe ready --json | jq '.[0]'

# Create issues during work
./beads/bd.exe create "Discovered bug" -t bug -p 0 --json

# Link discovered work back to parent
./beads/bd.exe dep add <new-id> <parent-id> --type discovered-from

# Update status
./beads/bd.exe update <issue-id> --status in_progress --json

# Complete work
./beads/bd.exe close <issue-id> --reason "Implemented" --json
```

### Agent Workflow
1. **Start sessions**: Run `./beads/bd.exe ready --json` to find unblocked work
2. **Claim work**: Update issue status to `in_progress` 
3. **Create issues**: File new issues for discovered work automatically
4. **Link dependencies**: Use `discovered-from` type for work found during execution
5. **Complete work**: Close issues with implementation details

### Key Commands
- `./beads/bd.exe ready --json` - Get ready work (no blockers)
- `./beads/bd.exe create "Title" -t <type> -p <priority> --json` - Create issue
- `./beads/bd.exe update <id> --status in_progress --json` - Claim work
- `./beads/bd.exe dep add <child> <parent> --type discovered-from` - Link discovery
- `./beads/bd.exe close <id> --reason "Done" --json` - Complete work

### Dependency Types
- `blocks` - Hard blocker (affects ready work)
- `related` - Soft connection (context only)
- `parent-child` - Epic/subtask hierarchy  
- `discovered-from` - Work discovered while executing

**Always use `--json` flags for programmatic integration.**
