# Deploying to Render.com

This project is configured for Render using render.yaml.

Steps:
1. Push the repository to GitHub.
2. In Render, create a new Web Service from this repo.
3. Render will auto-detect render.yaml and set up the service.
4. Ensure environment variables are set in Render dashboard:
   - NEXT_PUBLIC_STACK_PROJECT_ID
   - NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY
   - STACK_SECRET_SERVER_KEY
   - DATABASE_URL
   - JWT_SECRET, JWT_REFRESH_SECRET
   - STRIPE_PUBLISHABLE_KEY, STRIPE_SECRET_KEY (if used)
5. Build Command: pnpm install && pnpm run build
6. Start Command: pnpm run start (Next.js production server)

Notes:
- Health check path is '/'.
- PORT is set to 3000 via render.yaml, Render will provide PORT env; Next.js respects it.
- If you also deploy the server/ backend separately, create another service for it and set VITE_API_URL / NEXT_PUBLIC_API_URL accordingly.
