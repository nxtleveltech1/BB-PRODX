---
alwaysApply: true
description: "Next.js 15 + Neon + Drizzle + NextAuth + Tailwind + shadcn UI – Cursor AI Rules"
---

# 🎯 AI Prompting & Coding Philosophy

- Follow the user's requirements **exactly and completely**.
- Think step-by-step in detailed **pseudocode before writing code**.
- Prioritize **clarity, modularity, and maintainability** over brevity.
- Always validate input and handle errors explicitly.
- Prefer **early returns** to reduce nesting.
- Never leave placeholders or TODOs; complete all logic.
- Use `const` for arrow functions (`const handleSubmit = async () => {}`).
- Use **descriptive variable names** with auxiliary verbs (`isLoading`, `hasError`).
- Never write inline JSX logic — move it into constants or helpers.
- Always output **unified diffs grouped by filename** (Cursor diff-first rule).

---

# 💅 Code Style & Structure

## ✅ Code Quality & Style

- Respect `.eslintrc` and `.prettierrc` setup.
- Always use **TypeScript**.
- Prefer **named exports**.
- Sort imports logically: React → external → local.
- Remove all unused imports and variables.
- Keep code dry and modular — avoid duplication.
- Prefer functional programming over classes.
- Keep file length readable (≤ 200–300 lines).

## 🔠 Naming Conventions

- Variables & functions: `camelCase`
- Types & interfaces: `PascalCase`
- File names: `kebab-case`
- Event handlers: start with `handle` (e.g., `handleClick`)
- Constants: `UPPER_SNAKE_CASE`

## 🔧 Syntax & Formatting

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

---

# 🧱 Stack & Framework Conventions

## ✅ Next.js 15 (App Router)

- Use **App Router** with Server Components by default.
- Mark interactive files with `"use client"`.
- Use **Server Actions** or **Route Handlers** for mutations.
- Use `generateMetadata` for SEO per route.
- Favor **RSC caching** (`revalidate`) and `cache()` helpers.
- Use `Suspense` for async boundaries and loading UIs.
- Use **parallel data fetching** with `Promise.all`.

## ⚙️ Neon + Drizzle ORM Integration

- Database: **Neon (Postgres)**.
- ORM: **Drizzle ORM** for type safety and migrations.
- **Two clients**:
  - Edge (HTTP driver) → used in RSC & Server Actions.
  - Node (pg pool) → used for CLI, migrations, and scripts.
- Never expose `DATABASE_URL` to the client.
- Use parameterized queries, never string interpolation.

### Example: `lib/db/client-edge.ts`

```ts
import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import { ENV } from "@/lib/env"

const sql = neon(ENV.DATABASE_URL)
export const db = drizzle(sql)
```

### Example: `lib/db/client-node.ts`

```ts
import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import { ENV } from "@/lib/env"

const pool = new Pool({ connectionString: ENV.DATABASE_URL })
export const db = drizzle(pool)
```

### Example: `drizzle.config.ts`

```ts
import { defineConfig } from "drizzle-kit"
export default defineConfig({
  schema: "./lib/db/schema",
  out: "./db/migrations",
  dialect: "postgresql",
  dbCredentials: { url: process.env.DATABASE_URL! },
})
```

---

# 🗃️ Database Schema & Migrations

- Define schema in `lib/db/schema/*`.
- Use `drizzle-kit` for SQL migrations.
- Commit all migration files.
- Include rollback notes and optional seeds in `lib/db/seed.ts`.
- Use **shadow DB** (Neon branch) for safe diffs via `SHADOW_DATABASE_URL`.
- Run migrations before each deploy.

### Example CLI
```bash
pnpm drizzle-kit generate
pnpm drizzle-kit migrate
pnpm tsx lib/db/seed.ts
```

---

# 🔐 Auth & Security

- Auth: **Auth.js (NextAuth)** with **Drizzle adapter**.
- Session strategy: `"jwt"` or `"database"` depending on schema.
- Never expose tokens or secrets to the client.
- Validate all environment variables via Zod.
- Enforce `sameSite: "lax"` cookies and secure sessions.
- Implement role checks and route protection on the server.

### Example Auth Setup (`services/auth/auth.ts`)
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

---

# 🧬 Validation & Types

- Use **Zod** for all validation (client & server).
- Place schemas in `/schemas/`.
- Reuse types with `z.infer`.
- Validate environment variables early at startup.

### Example: `lib/env.ts`
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

---

# 🎨 UI & Styling

- Framework: **Tailwind CSS + shadcn/ui**.
- Always use Tailwind classes; never inline CSS unless necessary.
- Prefer shadcn/ui components from `@/components/ui`.
- Tailwind class order: Layout → Flex/Grid → Spacing → Color → Typography.
- Use `prettier-plugin-tailwindcss` to auto-sort classes.
- Reuse components via `components/common/` and `components/form/`.

---

# ♿ Accessibility

- Prefer semantic elements (`button`, `a`, `input`).
- Only add `tabIndex`, `role`, and ARIA attributes for non-semantic wrappers.
- Use `aria-label` for icon-only buttons.
- Ensure focus states and keyboard navigation for all interactive elements.

---

# 🧪 Testing

- Unit tests: **Vitest** + **@testing-library/react**.
- E2E: **Playwright**.
- Each new component or route handler must include at least one test.
- Include accessibility tests for interactive components.

### CLI
```bash
pnpm vitest run
pnpm vitest watch
pnpm exec playwright test
```

---

# 🧠 Performance Optimization

- Use `useMemo`, `useCallback` sparingly — only for real bottlenecks.
- Lazy-load heavy client-only components (`dynamic(() => import(...))`).
- Optimize DB queries: select only required fields.
- Use `next/image` for optimized images.
- Cache expensive RSC queries with `revalidate` and `cache()`.

---

# 📈 Observability

- Integrate **Sentry** for both server and client.
- Log all DB or external API errors with correlation IDs.
- Avoid leaking sensitive data in logs.

---

# 🧰 Build Notes (Always Include in Multi-File Outputs)

When generating code that spans multiple layers or files:
- List new files created.
- Summarize key logic.
- Note any config or schema updates.
- Include CLI commands for migrations, tests, and seed steps.

### Example Build Notes
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

---

# 📁 Folder Structure

```txt
app/
  layout.tsx
  page.tsx
  dashboard/
    layout.tsx
    page.tsx
    settings/
components/
  ui/
  common/
  form/
lib/
  db/
    client-edge.ts
    client-node.ts
    schema/
    seed.ts
  env.ts
  utils.ts
schemas/
  user.schema.ts
services/
  auth/
db/
  migrations/
types/
  db.d.ts
  index.ts
styles/
  globals.css
```

---

# ✅ Cursor Workflow Enhancements

- Always output **unified diffs grouped by filename (`---/+++`)**.
- Never overwrite entire files unless new.
- Always include **Build Notes** when creating or editing multiple files.
- Prefer **typed code and concrete implementations** over placeholders.
- Plan → Diff → Tests → Docs.
- Write **minimal, high-quality** code with no unnecessary abstractions.
