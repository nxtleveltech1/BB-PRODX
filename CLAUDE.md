# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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

## Architecture Overview

This is a **Next.js 14 full-stack application** using:

### Frontend Stack
- **Framework**: Next.js 14 with App Router
- **UI**: Radix UI components with custom design system
- **Styling**: TailwindCSS with CSS variables for theming
- **State**: Zustand for client state, TanStack Query for server state
- **Auth**: JWT with HTTP-only cookies
- **Payments**: Stripe integration

### Backend Stack
- **Runtime**: Node.js with Express
- **Database**: PostgreSQL with Drizzle ORM
- **Caching**: Redis (optional)
- **Auth**: JWT with refresh tokens
- **Security**: Helmet, CORS, rate limiting, XSS protection

### Key Directories
```
app/                    # Next.js App Router pages
├── auth/              # Authentication pages
├── products/          # Product listing and details
├── cart/              # Shopping cart
├── layout.tsx         # Root layout
└── providers.tsx      # React context providers

components/            # Shared UI components
├── layout/           # Header, footer, navigation
├── ui/               # Radix UI component library
└── brand/            # Brand-specific components

src/                   # Source utilities
├── components/       # Additional components
├── hooks/           # Custom React hooks  
├── lib/             # Utility functions
├── services/        # API services
├── styles/          # CSS files and design tokens
└── types/           # TypeScript definitions

server/               # Express backend
├── src/             
│   ├── routes/      # API routes
│   ├── middleware/  # Express middleware
│   ├── config/      # Database and Redis config
│   └── models/      # Database models (Drizzle)
└── package.json     # Backend dependencies
```

### Design System
- **Colors**: Honey (#e5c287), Chocolate (#7a4d3b), Cream (#f0e9d2)
- **Typography**: League Spartan (headings), Playfair Display (body)
- **Spacing**: 8px grid system with CSS custom properties
- **Components**: Radix UI base with Better Being brand styling

### Database Schema
Uses Drizzle ORM with PostgreSQL:
- Users (authentication, profiles)
- Products (wellness products catalog)
- Orders (e-commerce transactions)
- Cart (shopping cart state)
- Reviews (product reviews)

### Authentication Flow
1. JWT tokens issued on login
2. HTTP-only cookies for security
3. Refresh token rotation
4. Protected route middleware

### API Structure
All API routes are in `server/src/routes/`:
- `/api/auth` - Authentication endpoints
- `/api/products` - Product catalog
- `/api/cart` - Shopping cart
- `/api/checkout` - Order processing
- `/api/payments` - Stripe integration

### Environment Setup
Copy `.env.example` to `.env` and configure:
- `DATABASE_URL` - Neon PostgreSQL connection
- `JWT_SECRET` - JWT signing secret
- `STRIPE_PUBLISHABLE_KEY` - Stripe public key
- `STRIPE_SECRET_KEY` - Stripe secret key

### Development Workflow
1. Install dependencies: `npm run install:all`
2. Set up environment: Copy `.env.example` to `.env`
3. Initialize database: `cd server && npm run migrate && npm run seed`
4. Start development: `npm run dev:all`

### Testing Strategy
- **Unit Tests**: Vitest for components and utilities
- **Visual Tests**: Playwright for UI regression testing
- **E2E Tests**: Playwright for full user journeys
- **Design Tests**: AI-powered design system compliance

### AI Design Integration
The project includes an AI-native design workflow using Playwright MCP for visual testing and design iteration. See `AI-DESIGN-WORKFLOW-README.md` for detailed usage.

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