# Build Notes - Phase 3: Database Architecture Migration

## Overview
Successfully migrated from scattered database configuration to a centralized Drizzle ORM architecture with separate Edge and Node database clients, following Cursor Rules patterns.

## New Files Created

### Core Database Clients
- `lib/db/client-edge.ts` - Neon HTTP client for RSC and Server Actions
- `lib/db/client-node.ts` - PostgreSQL Pool client for CLI tools and migrations
- `lib/db/utils.ts` - Database utility functions (pagination, search, batch operations)

### Schema Files
- `lib/db/schema/user.ts` - User and session table schemas
- `lib/db/schema/product.ts` - Product, category, and related table schemas
- `lib/db/schema/order.ts` - Order and order items table schemas
- `lib/db/schema/cart.ts` - Cart and wishlist table schemas
- `lib/db/schema/review.ts` - Review and review votes table schemas
- `lib/db/schema/index.ts` - Central export for all schemas

### Configuration & Seeding
- `drizzle.config.ts` - Drizzle Kit configuration for migrations
- `lib/db/seed.ts` - Database seeding script with sample data

## Dependencies Added
- `drizzle-orm v0.44.2` - Already present, Drizzle ORM core
- `drizzle-kit v0.18.1` - Already present, Drizzle migration toolkit
- `@neondatabase/serverless v1.0.1` - Already present, Neon HTTP driver for edge
- `pg v8.11.3` - Already present, PostgreSQL driver for Node.js
- `tsx v4.20.6` - Added for TypeScript execution

## Database Schema Changes

### Tables Migrated
All existing tables from `server/src/config/schema.js` have been migrated to TypeScript with enhanced type safety:

1. **User Management**
   - `users` - User accounts with auth fields
   - `user_sessions` - JWT refresh tokens and device tracking

2. **Product Catalog**
   - `categories` - Product categories
   - `subcategories` - Category subdivisions
   - `products` - Main product table
   - `product_benefits` - Product benefits list
   - `product_ingredients` - Ingredient information
   - `product_tags` - Searchable tags
   - `product_sizes` - Size variants with pricing

3. **E-commerce**
   - `orders` - Order records with status tracking
   - `order_items` - Line items in orders
   - `cart` - Shopping cart items
   - `wishlist` - Saved products for later

4. **Reviews**
   - `reviews` - Product reviews and ratings
   - `review_votes` - Helpfulness voting system

### Enhancements Added
- Proper indexes on all foreign keys and frequently queried columns
- Unique constraints for data integrity
- Check constraints for valid ranges (e.g., ratings 1-5)
- Compound indexes for complex queries
- Type-safe schemas with full TypeScript inference

## Commands to Run

### Initial Setup
```bash
# Generate initial migrations from schema
pnpm db:generate

# Apply migrations to database
pnpm db:migrate

# Seed database with sample data
pnpm db:seed

# Or run all setup steps at once
pnpm db:setup
```

### Development Commands
```bash
# Open Drizzle Studio for database GUI
pnpm db:studio

# Push schema changes directly (development only)
pnpm db:push

# Reset database (drops all data!)
pnpm db:reset
```

### Migration Management
```bash
# Generate a new migration after schema changes
pnpm db:generate

# Apply pending migrations
pnpm db:migrate

# View migration status
pnpm drizzle-kit status
```

## Architecture Decisions

### 1. Dual Client Approach
- **Edge Client (`client-edge.ts`)**: Uses Neon's HTTP driver for serverless environments
  - Optimized for Vercel Edge Functions
  - No connection pooling (handled by Neon)
  - Lightweight for React Server Components

- **Node Client (`client-node.ts`)**: Uses pg Pool for traditional Node.js
  - Connection pooling for efficiency
  - Transaction support
  - Used for CLI tools and migrations

### 2. Schema Organization
- Separate files per domain (user, product, order, etc.)
- Central index file for unified imports
- Relations defined without circular dependencies
- Full TypeScript type inference

### 3. Migration Strategy
- SQL migrations tracked in `db/migrations/`
- Version controlled for team collaboration
- Safe rollback capability
- Shadow database support for testing migrations

### 4. Seeding Approach
- Idempotent seed script (checks for existing data)
- Sample data for all major entities
- Realistic product catalog with reviews
- Test users with hashed passwords

## Testing Verification

### Database Connection Tests
```typescript
// Test edge client
import { checkDatabaseConnection } from '@/lib/db/client-edge';
const result = await checkDatabaseConnection();
console.log('Edge client connected:', result);

// Test node client
import { checkDatabaseHealth } from '@/lib/db/client-node';
const health = await checkDatabaseHealth();
console.log('Node client health:', health);
```

### Query Examples
```typescript
// Using edge client in RSC
import { db } from '@/lib/db/client-edge';
import { products } from '@/lib/db/schema';

const popularProducts = await db
  .select()
  .from(products)
  .where(eq(products.isPopular, true))
  .limit(10);

// Using node client for migrations
import { db } from '@/lib/db/client-node';
import { users } from '@/lib/db/schema';

await db.transaction(async (tx) => {
  const user = await tx.insert(users).values({...}).returning();
  // Transaction will auto-rollback on error
});
```

## Performance Optimizations

### Indexes Created
- Primary key indexes (automatic)
- Foreign key indexes for JOIN performance
- Search indexes on slugs and SKUs
- Compound indexes for common query patterns
- Partial indexes for filtered queries

### Connection Pooling (Node Client)
- Min connections: 2 (configurable via env)
- Max connections: 20 (configurable via env)
- Idle timeout: 10 seconds
- Connection timeout: 2 seconds
- Statement timeout: 30 seconds

### Edge Runtime Optimization
- No connection pooling (Neon handles it)
- HTTP-based queries (no persistent connections)
- Minimal overhead for serverless

## Migration from Legacy System

### Backward Compatibility
- Legacy routes still functional in `server/src/config/`
- Can run both systems in parallel during migration
- Gradual migration path for existing API endpoints

### Data Migration Steps
1. Export data from existing database
2. Transform to match new schema if needed
3. Import using batch insert utilities
4. Verify data integrity

### API Migration Path
1. New endpoints use `lib/db/` clients
2. Legacy endpoints continue using `server/src/config/`
3. Gradually migrate endpoints one by one
4. Remove legacy code after full migration

## Security Considerations

### Environment Variables
- `DATABASE_URL` - Required, validated in lib/env.ts
- `SHADOW_DATABASE_URL` - Optional, for safe migrations
- SSL configuration for production connections
- No credentials in code or version control

### Query Safety
- Parameterized queries (Drizzle handles automatically)
- Type-safe query builders prevent SQL injection
- Input validation at schema level
- Transaction support for data consistency

## Monitoring & Debugging

### Development Tools
- Drizzle Studio for visual database management
- Query logging in development mode
- Pool statistics for connection monitoring
- Health check endpoints for uptime monitoring

### Production Considerations
- Error handling with retry logic
- Graceful shutdown handlers
- Connection pool monitoring
- Query performance tracking

## Next Steps (Phase 4 Preview)

### Authentication Migration
- Implement NextAuth.js v5 with Drizzle adapter
- Migrate from JWT to session-based auth
- Add OAuth providers (GitHub, Google)
- Implement role-based access control

### API Route Migration
- Convert Express routes to Next.js API routes
- Implement tRPC for type-safe APIs
- Add rate limiting and security middleware
- Create API documentation

## Troubleshooting

### Common Issues

1. **Migration fails with "relation already exists"**
   - Database already has tables from legacy system
   - Solution: Drop tables or use `db:reset` command

2. **Connection timeout errors**
   - Check DATABASE_URL is correct
   - Verify Neon database is active
   - Check network connectivity

3. **Type errors in schema files**
   - Ensure all imports are correct
   - Run `pnpm tsc` to check types
   - Update drizzle-orm if needed

4. **Seed script fails**
   - Database might already contain data
   - Check for unique constraint violations
   - Review error messages for specifics

## Success Metrics

✅ All database schemas migrated to TypeScript
✅ Both Edge and Node clients functional
✅ Migrations generated and ready to apply
✅ Seed script creates sample data
✅ Type-safe queries with IntelliSense
✅ Database commands added to package.json
✅ No circular dependencies in schemas
✅ Comprehensive documentation provided

## Phase 3 Complete

The database architecture has been successfully migrated to a modern, type-safe Drizzle ORM setup with proper separation of concerns, optimized clients for different environments, and comprehensive tooling for development and production use.