# Cursor Rules Quick Reference

## Core Principles
- Follow requirements **exactly and completely**
- Think in **detailed pseudocode** before coding
- Prioritize **clarity over brevity**
- Complete all logic — no TODOs/placeholders
- Use early returns to reduce nesting

## Code Style

### Variables & Functions
```ts
const handleSubmit = async () => {
  // early return pattern
  if (!isValid) return

  const isLoading = true
  const hasError = false
}
```

### Naming
| Type | Convention | Example |
|------|-----------|---------|
| Variables/Functions | camelCase | `getUserData`, `isLoading` |
| Types/Interfaces | PascalCase | `UserData`, `Props` |
| Files | kebab-case | `user-card.tsx` |
| Event Handlers | handle* | `handleClick`, `handleSubmit` |
| Constants | UPPER_SNAKE_CASE | `MAX_RETRIES`, `API_URL` |

### Formatting
- **Max line length:** 100 characters
- **Tool:** Prettier (auto-format on save)
- **Semicolons:** No (if Prettier configured)
- **Arrow functions:** Always use `const`
- **Imports order:** React → external → local

### TypeScript
- Always use TypeScript
- Prefer named exports
- Use `z.infer` for types from Zod schemas
- No `any` types

## Next.js 15 Patterns

### Server Components (Default)
```tsx
// app/page.tsx - Server Component by default
export const metadata = { title: "Home" }

export default async function Page() {
  const data = await fetch("...")
  return <div>{data}</div>
}
```

### Client Components
```tsx
// Mark with "use client"
"use client"

export default function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}
```

### Server Actions
```tsx
// Mutations without Route Handlers
"use server"

export async function submitForm(formData: FormData) {
  const email = formData.get("email")
  // Direct DB access
}
```

### Data Fetching
```tsx
// Parallel fetching
const [users, posts] = await Promise.all([
  db.query.users.findMany(),
  db.query.posts.findMany(),
])
```

## Neon + Drizzle Database

### Setup
```ts
// lib/db/client-edge.ts - For RSC & Server Actions
import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"

const sql = neon(process.env.DATABASE_URL!)
export const db = drizzle(sql)
```

### Query Pattern
```ts
import { db } from "@/lib/db/client-edge"
import { users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

// Type-safe query
const user = await db.query.users.findFirst({
  where: eq(users.id, userId),
})
```

### Migrations
```bash
# Generate from schema changes
pnpm drizzle-kit generate

# Apply to database
pnpm drizzle-kit migrate

# Seed data
pnpm tsx lib/db/seed.ts
```

## Auth (NextAuth + Drizzle)

### Setup
```ts
// services/auth/auth.ts
import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import { DrizzleAdapter } from "@auth/drizzle-adapter"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [GitHub],
  session: { strategy: "jwt" },
})
```

### Server-Side Auth Check
```tsx
import { auth } from "@/services/auth/auth"

export default async function ProtectedPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")

  return <div>Protected content</div>
}
```

## Validation (Zod)

### Schema Definition
```ts
// schemas/user.schema.ts
import { z } from "zod"

export const userSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  role: z.enum(["user", "admin"]),
})

export type User = z.infer<typeof userSchema>
```

### Validation Usage
```ts
// Server Action
"use server"

export async function updateUser(data: unknown) {
  const parsed = userSchema.parse(data)
  // Proceed with validated data
}
```

### Environment Variables
```ts
// lib/env.ts
import { z } from "zod"

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(32),
})

export const env = envSchema.parse(process.env)
```

## UI & Components

### shadcn/ui Components
```tsx
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function LoginForm() {
  return (
    <div className="space-y-4">
      <Input placeholder="Email" />
      <Button>Sign in</Button>
    </div>
  )
}
```

### Tailwind + cn()
```tsx
import { cn } from "@/lib/utils"

interface ButtonProps {
  isLoading?: boolean
  isError?: boolean
}

export function CustomButton({ isLoading, isError }: ButtonProps) {
  return (
    <button
      className={cn(
        "px-4 py-2 rounded-lg",
        isLoading && "opacity-50 cursor-not-allowed",
        isError && "bg-red-500",
      )}
    >
      Click me
    </button>
  )
}
```

## Testing

### Vitest + Testing Library
```ts
// button.test.tsx
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Button } from "./button"

describe("Button", () => {
  it("should call onClick when clicked", async () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click</Button>)

    await userEvent.click(screen.getByRole("button"))
    expect(handleClick).toHaveBeenCalledOnce()
  })
})
```

### Playwright E2E
```ts
// e2e/login.spec.ts
import { test, expect } from "@playwright/test"

test("user can login", async ({ page }) => {
  await page.goto("http://localhost:3000/login")
  await page.fill('input[name="email"]', "user@example.com")
  await page.fill('input[name="password"]', "password")
  await page.click("button:has-text('Sign in')")

  await expect(page).toHaveURL("/dashboard")
})
```

## Performance

### Memoization (Use Sparingly)
```tsx
// Only for expensive computations
const memoizedValue = useMemo(
  () => expensiveCalculation(data),
  [data],
)
```

### Dynamic Imports
```tsx
// Lazy-load heavy components
const HeavyComponent = dynamic(() => import("./heavy"), {
  loading: () => <Skeleton />,
})
```

### Image Optimization
```tsx
import Image from "next/image"

export function ProductImage() {
  return (
    <Image
      src="/product.jpg"
      alt="Product"
      width={400}
      height={400}
      priority={false}
    />
  )
}
```

## Accessibility

### Semantic HTML
```tsx
// ✅ Good
<button onClick={handleClick}>Click me</button>

// ❌ Avoid
<div role="button" onClick={handleClick}>Click me</div>
```

### ARIA Labels
```tsx
// Icon-only button
<button aria-label="Close menu">
  <XIcon />
</button>

// Form input
<label htmlFor="email">Email</label>
<input id="email" type="email" />
```

## Build Output Format

### Unified Diffs
```diff
--- a/app/page.tsx
+++ b/app/page.tsx
@@ -1,3 +1,5 @@
+import { Button } from "@/components/ui/button"
+
 export default function Page() {
   return <div>Home</div>
 }
```

### Build Notes Template
```
## Build Notes

### New Files Created
- `lib/db/schema/user.ts` - User database schema
- `services/auth/auth.ts` - NextAuth configuration

### Database Updates
- Migration: Add users table with email & role fields
- Seed: Create default admin user

### Dependencies Added
- `@auth/drizzle-adapter` v0.x.x
- `drizzle-orm` v0.x.x

### Commands to Run
```bash
pnpm drizzle-kit generate
pnpm drizzle-kit migrate
pnpm vitest
```
```

## Accessibility Checklist

- [ ] Use semantic HTML elements
- [ ] Add `aria-label` for icon-only buttons
- [ ] Implement keyboard navigation
- [ ] Test with screen reader
- [ ] Focus states are visible
- [ ] Color contrast meets WCAG AA
- [ ] Form inputs have labels

## Git Workflow

1. **Plan** - Outline approach, files to change, edge cases
2. **Implement** - Write code per Cursor rules
3. **Diff** - Output unified diffs grouped by file
4. **Test** - Run tests; ensure coverage
5. **Commit** - Clear message; reference issue

---

**Reference:** `cursor.rules.md` in project root
