# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository. For Codex CLI setup and MCP integration see `CODEX_SETUP.md`.

## 🎯 AI Prompting & Coding Philosophy

Follow the **Cursor AI Rules** exactly and completely:
- Follow user requirements **exactly and completely**.
- Think step-by-step in detailed **pseudocode before writing code**.
- Prioritize **clarity, modularity, and maintainability** over brevity.
- Always validate input and handle errors explicitly.
- Prefer **early returns** to reduce nesting.
- Never leave placeholders or TODOs; complete all logic.
- Use `const` for arrow functions (`const handleSubmit = async () => {}`).
- Use **descriptive variable names** with auxiliary verbs (`isLoading`, `hasError`).
- Never write inline JSX logic — move it into constants or helpers.
- Always output **unified diffs grouped by filename** (Cursor diff-first rule).

## 💅 Code Style & Structure

### ✅ Code Quality & Style
- Respect `.eslintrc` and `.prettierrc` setup.
- Always use **TypeScript**.
- Prefer **named exports**.
- Sort imports logically: React → external → local.
- Remove all unused imports and variables.
- Keep code DRY and modular — avoid duplication.
- Prefer functional programming over classes.
- Keep file length readable (≤ 200–300 lines).

### 🔠 Naming Conventions
- Variables & functions: `camelCase`
- Types & interfaces: `PascalCase`
- File names: `kebab-case`
- Event handlers: start with `handle` (e.g., `handleClick`)
- Constants: `UPPER_SNAKE_CASE`

### 🔧 Syntax & Formatting
- Use Prettier defaults.
- Line length: max 100 characters.
- No semicolons (if omitted in Prettier).
- Prefer `cn()` utility for conditional Tailwind classes.

```ts
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

## Development Commands

### Frontend Development
```bash
npm run dev                 # Start Next.js development server
npm run build              # Production build  
npm run start              # Start production server
npm run lint               # Run ESLint
```

### Full-Stack Development
```bash
npm run dev:all            # Start both frontend and backend servers
npm run dev:server         # Start backend server only (port 8000)
npm run install:all        # Install dependencies for both frontend and backend
```

### Backend Server
```bash
cd server
npm run dev                # Start Express server with nodemon
npm run start              # Start production server
npm run migrate            # Run database migrations
npm run seed               # Seed database with initial data
npm run db:optimize        # Run migrations and seed
```

### Testing
```bash
npm run test               # Run Vitest unit tests
npm run test:run           # Run tests once
npm run test:coverage      # Generate test coverage
npm run test:ui            # Open Vitest UI
npm run test:watch         # Watch mode

# Visual/E2E Testing  
npm run test:visual        # Visual regression tests
npm run test:mobile        # Mobile viewport tests
npm run test:desktop       # Desktop viewport tests
npm run test:component-visual # Component visual tests
npm run update:visual-baselines # Update visual test baselines
```

### AI Design Workflow
```bash
npm run ai:design-iteration    # Run AI design analysis
npm run audit:design-system    # Design system compliance audit
npm run test:design-capture    # Capture design screenshots
npm run test:design-validation # Full design validation suite
```

### Performance & Optimization
```bash
npm run build:analyze      # Bundle analysis
npm run optimize:images    # Optimize image assets
npm run optimize:all       # Full optimization pipeline
npm run performance:audit  # Lighthouse performance audit
```

### Deployment
```bash
npm run vercel-build       # Vercel deployment build
npm run build:optimized    # Optimized production build
```

## 🧱 Stack & Framework Conventions

This is a **Next.js 15 full-stack application** with **Neon (PostgreSQL) + Drizzle ORM**:

### Frontend Stack
- **Framework**: Next.js 15 with App Router (Server Components by default)
- **UI**: shadcn/ui + Tailwind CSS
- **Styling**: TailwindCSS with design tokens (Honey, Chocolate, Cream)
- **State**: RSC caching + Server Actions for mutations
- **Auth**: Auth.js (NextAuth) with Drizzle adapter
- **Payments**: Stripe integration
- **Testing**: Vitest + @testing-library/react + Playwright

### Backend Stack
- **Database**: Neon PostgreSQL (with shadow DB support)
- **ORM**: Drizzle ORM with type safety
- **Auth**: NextAuth with Drizzle adapter
- **DB Clients**:
  - Edge (HTTP driver) → RSC & Server Actions
  - Node (pg pool) → migrations & CLI
- **Validation**: Zod for schemas
- **Security**: No `DATABASE_URL` exposure to client, parameterized queries only

### ✅ Next.js 15 (App Router) Conventions
- Use **App Router** with Server Components by default.
- Mark interactive files with `"use client"`.
- Use **Server Actions** for mutations instead of Route Handlers where appropriate.
- Use `generateMetadata` for SEO per route.
- Favor **RSC caching** (`revalidate`) and `cache()` helpers.
- Use `Suspense` for async boundaries and loading UIs.
- Prefer **parallel data fetching** with `Promise.all`.

### ⚙️ Neon + Drizzle ORM Integration
- Database: **Neon (Postgres)** with shadow branch for safe diffs.
- ORM: **Drizzle ORM** for type safety and migrations.
- Schema location: `lib/db/schema/*`
- Migrations: Auto-generated by drizzle-kit, committed to `db/migrations/`
- Never expose `DATABASE_URL` to the client.
- Use parameterized queries, never string interpolation.

### 📁 Folder Structure (Cursor-aligned)
```
app/
  layout.tsx              # Root layout with metadata
  page.tsx                # Home page
  dashboard/
    layout.tsx
    page.tsx
    settings/
      page.tsx

components/
  ui/                     # shadcn/ui components
  common/                 # Reusable components
  form/                   # Form components

lib/
  db/
    client-edge.ts        # Neon HTTP client (RSC/Server Actions)
    client-node.ts        # pg pool client (CLI/migrations)
    schema/               # Drizzle schema files
    seed.ts               # Database seeding
  env.ts                  # Environment validation (Zod)
  utils.ts                # Helper utilities (e.g., cn())

db/
  migrations/             # Auto-generated migration files

schemas/
  user.schema.ts          # Zod validation schemas
  product.schema.ts

services/
  auth/                   # Auth.js (NextAuth) setup
  payments/               # Stripe integration

types/
  db.d.ts                 # Database types
  index.ts

styles/
  globals.css             # Global styles

public/                   # Static assets
```

### Design System
- **Colors**: Honey (#e5c287), Chocolate (#7a4d3b), Cream (#f0e9d2)
- **Typography**: League Spartan (headings), Playfair Display (body)
- **Spacing**: 8px grid system with CSS custom properties
- **Components**: Radix UI base with Better Being brand styling

### 🗃️ Database Schema & Migrations

Define schema in `lib/db/schema/*` using Drizzle:
- Users (authentication, profiles, roles)
- Products (wellness catalog)
- Orders (e-commerce transactions)
- Cart (shopping state)
- Reviews (product reviews)

Use `drizzle-kit` for SQL migrations:
```bash
pnpm drizzle-kit generate    # Generate migrations from schema
pnpm drizzle-kit migrate      # Apply migrations
pnpm tsx lib/db/seed.ts       # Seed initial data
```

Use **shadow DB** (Neon branch) for safe diffs via `SHADOW_DATABASE_URL`.

### 🔐 Auth & Security

- **Auth**: Auth.js (NextAuth) with **Drizzle adapter**.
- **Session strategy**: `"jwt"` or `"database"` depending on schema.
- **Never expose tokens or secrets to the client**.
- **Validate all environment variables via Zod** early at startup.
- Enforce `sameSite: "lax"` cookies and secure sessions.
- Implement role checks and route protection on the server.

#### Example Auth Setup (`services/auth/auth.ts`)
```ts
import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { db } from "@/lib/db/client-edge"
import * as schema from "@/lib/db/schema/user"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db, { usersTable: schema.users }),
  providers: [GitHub],
  session: { strategy: "jwt" },
})
```

### 🧬 Validation & Types

- Use **Zod** for all validation (client & server).
- Place schemas in `/schemas/`.
- Reuse types with `z.infer`.
- Validate environment variables early at startup.

#### Example: `lib/env.ts`
```ts
import { z } from "zod"

const EnvSchema = z.object({
  DATABASE_URL: z.string().url(),
  SHADOW_DATABASE_URL: z.string().url().optional(),
  NEXTAUTH_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(32),
})

export const ENV = EnvSchema.parse(process.env)
```

### 🎨 UI & Styling

- Framework: **Tailwind CSS + shadcn/ui**.
- Always use Tailwind classes; never inline CSS unless necessary.
- Prefer shadcn/ui components from `@/components/ui`.
- Tailwind class order: Layout → Flex/Grid → Spacing → Color → Typography.
- Use `prettier-plugin-tailwindcss` to auto-sort classes.
- Reuse components via `components/common/` and `components/form/`.

### ♿ Accessibility

- Prefer semantic elements (`button`, `a`, `input`).
- Only add `tabIndex`, `role`, and ARIA attributes for non-semantic wrappers.
- Use `aria-label` for icon-only buttons.
- Ensure focus states and keyboard navigation for all interactive elements.

### Environment Setup
Create `.env.local` and validate with Zod:
- `DATABASE_URL` - Neon PostgreSQL connection
- `SHADOW_DATABASE_URL` - Shadow database for safe migrations (optional)
- `NEXTAUTH_URL` - NextAuth callback URL
- `NEXTAUTH_SECRET` - Signing secret (min 32 chars)
- `STRIPE_PUBLISHABLE_KEY` - Stripe public key
- `STRIPE_SECRET_KEY` - Stripe secret key

### Development Workflow
1. Install dependencies: `npm run install:all`
2. Set up environment: Copy `.env.example` to `.env`
3. Initialize database: `cd server && npm run migrate && npm run seed`
4. Start development: `npm run dev:all`

### 🧪 Testing

- **Unit Tests**: **Vitest** + **@testing-library/react**.
- **E2E**: **Playwright**.
- **Each new component or route handler must include at least one test**.
- **Include accessibility tests for interactive components**.

#### CLI
```bash
pnpm vitest run          # Run tests once
pnpm vitest watch        # Watch mode
pnpm vitest ui           # Open UI
pnpm exec playwright test # Run E2E tests
```

### 🧠 Performance Optimization

- Use `useMemo`, `useCallback` sparingly — only for real bottlenecks.
- Lazy-load heavy client-only components (`dynamic(() => import(...))`).
- Optimize DB queries: select only required fields.
- Use `next/image` for optimized images.
- Cache expensive RSC queries with `revalidate` and `cache()`.

### 📈 Observability

- Integrate **Sentry** for both server and client.
- Log all DB or external API errors with correlation IDs.
- Avoid leaking sensitive data in logs.

### 🧰 Build Notes (Always Include in Multi-File Outputs)

When generating code that spans multiple layers or files:
- List new files created.
- Summarize key logic.
- Note any config or schema updates.
- Include CLI commands for migrations, tests, and seed steps.

#### Example Build Notes
```bash
# Setup and DB commands
pnpm drizzle-kit generate
pnpm drizzle-kit migrate
pnpm tsx lib/db/seed.ts

# Run dev server
pnpm dev

# Test
pnpm vitest
pnpm exec playwright test

# Lint & format
pnpm lint
pnpm format
```

### ✅ Cursor Workflow Enhancements

- Always output **unified diffs grouped by filename (`---/+++`)**.
- Never overwrite entire files unless new.
- Always include **Build Notes** when creating or editing multiple files.
- Prefer **typed code and concrete implementations** over placeholders.
- Plan → Diff → Tests → Docs.
- Write **minimal, high-quality** code with no unnecessary abstractions.

### AI Design Integration
The project includes an AI-native design workflow using Playwright MCP for visual testing and design iteration. See `AI-DESIGN-WORKFLOW-README.md` for detailed usage.

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

### Deployment
Configured for Vercel deployment with:
- Frontend served from root
- Backend as serverless functions
- Database on Neon
- Environment variables configured in Vercel dashboard

## Visual Development & AI Design Workflow

### Design Principles
Reference: `context/design-principles.md` and `AI-DESIGN-WORKFLOW-README.md`
- Brand colors: Honey (#e5c287), Chocolate (#7a4d3b), Cream (#f0e9d2)
- Typography: League Spartan (headings), Playfair Display (body)
- 8px spacing grid system
- Wellness-focused, gentle animations

### Browser Configuration for Design Review
```json
{
  "viewport": "desktop",
  "device": "Desktop Chrome",
  "actions": [
    "navigate to impacted pages",
    "check console errors", 
    "perform visual design review",
    "capture component states",
    "validate responsive behavior"
  ]
}
```

### AI Design Review Process
When making design changes:
1. **Navigate** to affected pages at http://localhost:3000
2. **Capture** screenshots of key components and states
3. **Analyze** against Better Being design principles
4. **Check** brand consistency (colors, typography, spacing)
5. **Validate** responsive behavior across viewports
6. **Report** findings with specific recommendations

### Visual Validation Commands
```bash
npm run test:visual           # Visual regression testing
npm run test:design-capture   # Capture current design state  
npm run ai:design-iteration   # AI-powered design analysis
npm run audit:design-system   # Brand compliance check
```

### Acceptance Criteria for Design Changes
- ✅ Brand colors used consistently
- ✅ Typography scale adherence (League Spartan/Playfair Display)
- ✅ 8px grid spacing maintained
- ✅ Gentle animations preserve wellness aesthetic
- ✅ Responsive design works on mobile/tablet/desktop
- ✅ No console errors
- ✅ Visual regression tests pass
