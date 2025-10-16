# Team Training & Runbooks

## Developer Onboarding

### Prerequisites
- **Node.js:** Version 18.0.0 or higher
- **pnpm:** Version 8.0.0 or higher (`npm install -g pnpm`)
- **Git:** Version 2.0.0 or higher
- **VS Code** (recommended) with extensions:
  - ESLint
  - Prettier
  - TypeScript and JavaScript Language Features
  - Tailwind CSS IntelliSense

### Setup Checklist

1. **Clone the repository**
   ```bash
   git clone https://github.com/betterbeing/bb-prodx.git
   cd bb-prodx
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your values
   ```

4. **Set up the database**
   ```bash
   # Initialize database schema
   pnpm db:push

   # Run migrations
   pnpm db:migrate

   # Seed with test data (development only)
   pnpm db:seed
   ```

5. **Start development server**
   ```bash
   pnpm dev
   # Visit http://localhost:3000
   ```

6. **Run tests**
   ```bash
   pnpm test
   ```

---

## Core Concepts

### Server Components vs Client Components

**Server Components (default)**
- Run on the server
- Can fetch data directly
- No JavaScript sent to client
- Use for static content and data fetching

```tsx
// app/products/page.tsx - Server Component
import { db } from '@/lib/db';

export default async function ProductsPage() {
  const products = await db.select().from(schema.products);

  return (
    <div>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

**Client Components**
- Run in the browser
- Can use hooks and event handlers
- Interactive components
- Mark with `'use client'` directive

```tsx
// components/cart-button.tsx - Client Component
'use client';

import { useState } from 'react';

export function CartButton({ productId }) {
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async () => {
    setLoading(true);
    await addToCart(productId);
    setLoading(false);
  };

  return (
    <button onClick={handleAddToCart} disabled={loading}>
      {loading ? 'Adding...' : 'Add to Cart'}
    </button>
  );
}
```

### Database Queries with Drizzle

**Basic queries:**
```typescript
// Select all
const products = await db.select().from(schema.products);

// Select with conditions
const product = await db
  .select()
  .from(schema.products)
  .where(eq(schema.products.id, productId))
  .limit(1);

// Insert
const [newProduct] = await db
  .insert(schema.products)
  .values({ name, price, description })
  .returning();

// Update
await db
  .update(schema.products)
  .set({ price: newPrice })
  .where(eq(schema.products.id, productId));

// Delete
await db
  .delete(schema.products)
  .where(eq(schema.products.id, productId));
```

**Transactions:**
```typescript
await db.transaction(async (tx) => {
  const order = await tx.insert(schema.orders).values({...});
  await tx.insert(schema.orderItems).values({...});
  await tx.update(schema.products).set({...});
});
```

### Authentication with NextAuth

**Protecting pages:**
```tsx
// app/dashboard/page.tsx
import { auth } from '@/services/auth/auth';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect('/auth/signin');
  }

  return <Dashboard user={session.user} />;
}
```

**Client-side session:**
```tsx
// components/user-menu.tsx
'use client';

import { useSession } from 'next-auth/react';

export function UserMenu() {
  const { data: session, status } = useSession();

  if (status === 'loading') return <Skeleton />;
  if (!session) return <SignInButton />;

  return <ProfileMenu user={session.user} />;
}
```

### Error Handling with Sentry

**Capture errors:**
```typescript
import * as Sentry from '@sentry/nextjs';

try {
  await riskyOperation();
} catch (error) {
  Sentry.captureException(error, {
    tags: {
      section: 'checkout',
      action: 'payment'
    },
    extra: {
      orderId,
      amount
    }
  });
  throw error;
}
```

### Caching Strategies

**Static caching:**
```typescript
// Revalidate every hour
export const revalidate = 3600;

// Or use cache function
import { unstable_cache as cache } from 'next/cache';

const getProducts = cache(
  async () => db.select().from(schema.products),
  ['products'],
  { revalidate: 3600 }
);
```

---

## Code Standards

### TypeScript Best Practices
- Always use explicit types for function parameters and returns
- Avoid `any` type - use `unknown` if type is truly unknown
- Use interfaces for object shapes, types for unions/intersections
- Enable strict mode in tsconfig.json

### Naming Conventions
- **Files:** `kebab-case.tsx`
- **Components:** `PascalCase`
- **Functions/Variables:** `camelCase`
- **Constants:** `UPPER_SNAKE_CASE`
- **CSS Classes:** `kebab-case`

### Import Organization
```typescript
// 1. React/Next imports
import { useState } from 'react';
import { useRouter } from 'next/navigation';

// 2. Third-party libraries
import { z } from 'zod';
import { toast } from 'sonner';

// 3. Internal absolute imports
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';

// 4. Relative imports
import { ProductCard } from './product-card';

// 5. Types
import type { Product } from '@/types';
```

### Component Structure
```tsx
// 1. Imports
// 2. Types/Interfaces
// 3. Constants
// 4. Component
// 5. Subcomponents (if any)

interface ProductCardProps {
  product: Product;
  onAddToCart?: (id: string) => void;
}

const MAX_DESCRIPTION_LENGTH = 100;

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  // Hooks
  const [loading, setLoading] = useState(false);

  // Handlers
  const handleClick = async () => {
    // Implementation
  };

  // Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

### Error Handling
```typescript
// Always handle errors explicitly
try {
  const result = await riskyOperation();
  return { success: true, data: result };
} catch (error) {
  // Log to Sentry
  Sentry.captureException(error);

  // Return user-friendly error
  return {
    success: false,
    error: 'Something went wrong. Please try again.'
  };
}
```

---

## Common Tasks

### Adding a New API Endpoint

1. **Create the route file**
   ```typescript
   // app/api/products/[id]/reviews/route.ts
   import { NextRequest, NextResponse } from 'next/server';
   import { auth } from '@/services/auth/auth';
   import { db } from '@/lib/db';
   import { z } from 'zod';

   const reviewSchema = z.object({
     rating: z.number().min(1).max(5),
     comment: z.string().min(10).max(500)
   });

   export async function POST(
     request: NextRequest,
     { params }: { params: { id: string } }
   ) {
     const session = await auth();
     if (!session) {
       return NextResponse.json(
         { error: 'Unauthorized' },
         { status: 401 }
       );
     }

     const body = await request.json();
     const validation = reviewSchema.safeParse(body);

     if (!validation.success) {
       return NextResponse.json(
         { error: validation.error },
         { status: 400 }
       );
     }

     const review = await db.insert(schema.reviews).values({
       productId: parseInt(params.id),
       userId: session.user.id,
       ...validation.data
     });

     return NextResponse.json({ success: true, review });
   }
   ```

### Adding a Database Table

1. **Define the schema**
   ```typescript
   // lib/db/schema.ts
   export const reviews = pgTable('reviews', {
     id: serial('id').primaryKey(),
     productId: integer('product_id').notNull().references(() => products.id),
     userId: integer('user_id').notNull().references(() => users.id),
     rating: integer('rating').notNull(),
     comment: text('comment'),
     createdAt: timestamp('created_at').defaultNow(),
     updatedAt: timestamp('updated_at').defaultNow()
   });
   ```

2. **Generate migration**
   ```bash
   pnpm db:generate
   ```

3. **Run migration**
   ```bash
   pnpm db:migrate
   ```

### Creating a Protected Page

```tsx
// app/account/settings/page.tsx
import { auth } from '@/services/auth/auth';
import { redirect } from 'next/navigation';

export default async function SettingsPage() {
  const session = await auth();

  if (!session) {
    redirect('/auth/signin?callbackUrl=/account/settings');
  }

  // Only admins can access
  if (session.user.role !== 'admin') {
    redirect('/unauthorized');
  }

  return <SettingsForm user={session.user} />;
}
```

### Debugging Production Issues

1. **Check Sentry dashboard**
   - Look for error patterns
   - Check error details and stack traces
   - Review user context

2. **Review logs**
   ```bash
   # Vercel logs
   vercel logs --prod

   # Filter by error level
   vercel logs --prod --filter="error"
   ```

3. **Database queries**
   ```sql
   -- Check slow queries
   SELECT query, calls, mean_exec_time
   FROM pg_stat_statements
   ORDER BY mean_exec_time DESC
   LIMIT 10;

   -- Check table sizes
   SELECT schemaname, tablename,
          pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename))
   FROM pg_tables
   WHERE schemaname = 'public'
   ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
   ```

4. **Performance monitoring**
   - Check Core Web Vitals in Sentry
   - Review API response times
   - Check database connection pool

### Database Backup & Recovery

**Manual backup:**
```bash
# Export database
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql

# Restore database
psql $DATABASE_URL < backup_20240101.sql
```

**Automated backups:**
- Neon provides automatic backups
- Access via Neon dashboard
- Point-in-time recovery available

---

## Troubleshooting

### Common Issues and Solutions

#### Build Failures

**Error: Module not found**
```bash
# Clear cache and reinstall
rm -rf .next node_modules
pnpm install
pnpm build
```

**Error: TypeScript errors**
```bash
# Check TypeScript errors
npx tsc --noEmit

# Auto-fix what's possible
pnpm lint --fix
```

#### Database Issues

**Connection pool exhausted**
```typescript
// Check pool stats
const stats = await getPoolStats();
console.log(stats);

// Increase pool size in lib/db/client.ts
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20, // Increase from default
});
```

**Migration failures**
```bash
# Rollback last migration
pnpm db:rollback

# Check migration status
pnpm db:status

# Force reset (CAUTION: drops all data)
pnpm db:reset
```

#### Authentication Issues

**Session not persisting**
- Check NEXTAUTH_URL is correct
- Verify NEXTAUTH_SECRET is set
- Check cookie settings for production

**OAuth not working**
- Verify redirect URLs in provider settings
- Check CLIENT_ID and CLIENT_SECRET
- Ensure callback URLs match

#### Performance Issues

**Slow page loads**
- Check for missing `loading.tsx` files
- Review data fetching patterns
- Enable caching where appropriate
- Check bundle size with `pnpm build:analyze`

---

## Emergency Procedures

### Site Down

1. **Immediate response**
   ```bash
   # Check deployment status
   vercel ls --prod

   # Rollback if recent deployment
   ./scripts/rollback.sh production
   ```

2. **Diagnose**
   - Check Sentry for errors
   - Review recent deployments
   - Check database status
   - Verify external services

3. **Communicate**
   - Update status page
   - Notify team via Slack
   - Inform customers if extended

### Data Breach

1. **Immediate actions**
   - Rotate all secrets
   - Revoke compromised tokens
   - Enable emergency mode

2. **Investigation**
   - Review access logs
   - Check for data exfiltration
   - Identify attack vector

3. **Recovery**
   - Patch vulnerability
   - Reset user passwords
   - Notify affected users
   - Document incident

### High Traffic Event

1. **Preparation**
   - Scale database connections
   - Increase server resources
   - Enable CDN caching
   - Set up rate limiting

2. **Monitoring**
   - Watch error rates
   - Monitor response times
   - Check resource usage
   - Track conversion rates

3. **Post-event**
   - Analyze performance
   - Document lessons learned
   - Update capacity planning

---

## Best Practices

### Security
- Never commit secrets to Git
- Use environment variables
- Validate all user input
- Sanitize database queries
- Implement rate limiting
- Use HTTPS everywhere
- Keep dependencies updated

### Performance
- Use Server Components by default
- Implement proper caching
- Optimize images with next/image
- Lazy load heavy components
- Minimize bundle size
- Use database indexes

### Code Quality
- Write tests for critical paths
- Use TypeScript strictly
- Follow ESLint rules
- Document complex logic
- Review PRs thoroughly
- Keep components small

### Monitoring
- Set up error tracking
- Monitor performance metrics
- Track business KPIs
- Review logs regularly
- Test disaster recovery

---

## Resources

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [Drizzle ORM Docs](https://orm.drizzle.team)
- [NextAuth.js Docs](https://next-auth.js.org)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

### Internal Resources
- API Documentation: `/docs/API-REFERENCE.md`
- Deployment Guide: `/docs/PRODUCTION-DEPLOYMENT-GUIDE.md`
- Monitoring Setup: `/docs/MONITORING-SETUP.md`
- Migration Guide: `/MIGRATION_COMPLETE_SUMMARY.md`

### Support Channels
- **Slack:** #bb-prodx-dev
- **Email:** dev-team@betterbeing.com
- **On-call:** See PagerDuty schedule
- **Wiki:** Internal documentation portal

### Training Videos
- Platform Overview (30 min)
- Database Architecture (45 min)
- Authentication Deep Dive (20 min)
- Deployment Process (15 min)
- Incident Response (25 min)