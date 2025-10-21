#!/bin/bash
# Script 4: Configure Vercel Integration
# Better Being Production Migration
# Usage: ./04-configure-vercel.sh

set -e

echo "🔗 Better Being - Vercel Integration Setup"
echo "==========================================="
echo ""

# Load configuration
if [ ! -f .env.neon.new ]; then
    echo "❌ .env.neon.new not found"
    exit 1
fi

source .env.neon.new

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

echo "1️⃣ Setting up Neon Vercel Integration..."
echo ""
echo "⚠️  Manual step required:"
echo "  1. Go to: https://console.neon.tech/app/projects/$NEON_PROJECT_ID/integrations"
echo "  2. Click 'Add Integration' → 'Vercel'"
echo "  3. Select Vercel project: 'bb-prodx'"
echo "  4. Enable:"
echo "     ✅ Create preview branch for each deployment"
echo "     ✅ Delete preview branch when deployment is removed"
echo "  5. Click 'Install Integration'"
echo ""
read -p "Press Enter when integration is complete..."
echo ""

echo "2️⃣ Configuring Vercel environment variables..."
echo ""

# Check if logged in to Vercel
if ! vercel whoami &> /dev/null; then
    echo "🔐 Please authenticate with Vercel..."
    vercel login
fi

# Link to project
vercel link --project bb-prodx --yes

echo ""
echo "  Setting up environment variables for each environment..."
echo ""

# Production environment
echo "  → Production:"
echo "$DATABASE_URL" | vercel env add DATABASE_URL production --sensitive
echo "$DATABASE_URL_DIRECT" | vercel env add DATABASE_URL_DIRECT production --sensitive

# Preview environment (placeholder - will be auto-injected by Neon integration)
echo "  → Preview:"
echo "PLACEHOLDER_WILL_BE_AUTO_INJECTED_BY_NEON" | vercel env add DATABASE_URL preview

# Development environment
echo "  → Development:"
echo "$SHADOW_DATABASE_URL" | vercel env add DATABASE_URL development --sensitive

# Add Neon project details
echo "$NEON_PROJECT_ID" | vercel env add NEON_PROJECT_ID production preview development

echo ""
echo "✅ Environment variables configured"
echo ""

echo "3️⃣ Updating vercel.json configuration..."

cat > vercel.json << 'EOF'
{
  "buildCommand": "npx -y pnpm@10.18.3 run vercel-build",
  "installCommand": "npx -y pnpm@10.18.3 install --no-frozen-lockfile",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "env": {
    "NEXT_PUBLIC_ENV": "production"
  },
  "build": {
    "env": {
      "SKIP_ENV_VALIDATION": "false"
    }
  },
  "regions": ["fra1"],
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 10
    }
  },
  "crons": [
    {
      "path": "/api/cron/cleanup-old-carts",
      "schedule": "0 2 * * *"
    },
    {
      "path": "/api/cron/sync-instagram",
      "schedule": "0 */6 * * *"
    }
  ]
}
EOF

echo "✅ vercel.json updated"
echo ""

echo "4️⃣ Creating GitHub Actions workflow for preview branches..."

mkdir -p .github/workflows

cat > .github/workflows/preview-database.yml << 'EOF'
name: Preview Database Setup

on:
  pull_request:
    types: [opened, synchronize, reopened]

jobs:
  setup-preview-db:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 10.18.3

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'

      - name: Check if Neon branch exists
        id: check-branch
        run: |
          BRANCH_NAME="preview-pr-${{ github.event.pull_request.number }}"
          if neon branch list --project-id "${{ secrets.NEON_PROJECT_ID }}" | grep -q "$BRANCH_NAME"; then
            echo "exists=true" >> $GITHUB_OUTPUT
          else
            echo "exists=false" >> $GITHUB_OUTPUT
          fi
        env:
          NEON_API_KEY: ${{ secrets.NEON_API_KEY }}

      - name: Create Neon preview branch
        if: steps.check-branch.outputs.exists == 'false'
        id: neon-branch
        uses: neondatabase/create-branch-action@v4
        with:
          project_id: ${{ secrets.NEON_PROJECT_ID }}
          api_key: ${{ secrets.NEON_API_KEY }}
          branch_name: preview-pr-${{ github.event.pull_request.number }}
          parent: main

      - name: Get branch connection string
        id: get-connection
        run: |
          CONNECTION_URI=$(neon connection-string \
            --project-id "${{ secrets.NEON_PROJECT_ID }}" \
            --branch "preview-pr-${{ github.event.pull_request.number }}" \
            --pooled)
          echo "::add-mask::$CONNECTION_URI"
          echo "connection_uri=$CONNECTION_URI" >> $GITHUB_OUTPUT
        env:
          NEON_API_KEY: ${{ secrets.NEON_API_KEY }}

      - name: Run migrations
        if: steps.check-branch.outputs.exists == 'false'
        run: |
          pnpm install
          pnpm db:migrate
        env:
          DATABASE_URL: ${{ steps.get-connection.outputs.connection_uri }}

      - name: Comment on PR
        uses: actions/github-script@v7
        with:
          script: |
            const branchName = `preview-pr-${context.issue.number}`;
            const message = `🚀 **Preview Database Ready**

            Branch: \`${branchName}\`
            Region: \`eu-central-1\`

            Your preview deployment will automatically use this database branch.
            The branch will be deleted when this PR is closed.`;

            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: message
            })
EOF

cat > .github/workflows/preview-cleanup.yml << 'EOF'
name: Cleanup Preview Database

on:
  pull_request:
    types: [closed]

jobs:
  cleanup:
    runs-on: ubuntu-latest
    steps:
      - name: Delete Neon preview branch
        run: |
          BRANCH_NAME="preview-pr-${{ github.event.pull_request.number }}"
          neon branch delete "$BRANCH_NAME" \
            --project-id "${{ secrets.NEON_PROJECT_ID }}" \
            --force || echo "Branch already deleted or doesn't exist"
        env:
          NEON_API_KEY: ${{ secrets.NEON_API_KEY }}

      - name: Comment on PR
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: '🧹 Preview database branch cleaned up'
            })
EOF

echo "✅ GitHub Actions workflows created"
echo ""

echo "5️⃣ Required GitHub Secrets..."
echo ""
echo "⚠️  Add these secrets to GitHub repository:"
echo "  Repository → Settings → Secrets and variables → Actions → New repository secret"
echo ""
echo "  NEON_PROJECT_ID: $NEON_PROJECT_ID"
echo "  NEON_API_KEY: [Get from https://console.neon.tech/app/account/api-keys]"
echo ""

echo "6️⃣ Testing Vercel deployment..."
echo ""

read -p "Deploy to Vercel preview now? (y/N) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "  Deploying to preview..."
    vercel --prod=false
    echo "✅ Preview deployment complete"
else
    echo "  Skipped - you can deploy later with: vercel"
fi

echo ""
echo "✅ Vercel integration complete!"
echo ""
echo "📊 Summary:"
echo "  - Neon Vercel integration enabled"
echo "  - Environment variables configured"
echo "  - vercel.json updated"
echo "  - GitHub Actions workflows created"
echo ""
echo "📋 Next steps:"
echo "  1. Add NEON_API_KEY to GitHub secrets"
echo "  2. Test preview deployment"
echo "  3. Run: ./05-optimize-performance.sh"
