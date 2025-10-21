#!/bin/bash
# Script 1: Create New Neon Database with Optimal Configuration
# Better Being Production Migration
# Usage: ./01-create-new-database.sh

set -e

echo "🚀 Better Being - Neon Database Migration"
echo "=========================================="
echo ""

# Check if Neon CLI is installed
if ! command -v neon &> /dev/null; then
    echo "❌ Neon CLI not found. Installing..."
    npm install -g neonctl
    echo "✅ Neon CLI installed"
fi

# Check if user is authenticated
if ! neon auth status &> /dev/null; then
    echo "🔐 Please authenticate with Neon..."
    neon auth
fi

# Project configuration
PROJECT_NAME="better-being-production"
REGION="eu-central-1"  # Same as current DB
MIN_COMPUTE="0.25"
MAX_COMPUTE="4"
AUTO_SUSPEND_SECONDS="300"  # 5 minutes

echo "📋 Configuration:"
echo "  Project: $PROJECT_NAME"
echo "  Region: $REGION"
echo "  Compute: ${MIN_COMPUTE}-${MAX_COMPUTE} CU (autoscaling)"
echo "  Auto-suspend: ${AUTO_SUSPEND_SECONDS}s"
echo ""

read -p "Continue with these settings? (y/N) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Cancelled"
    exit 1
fi

echo ""
echo "1️⃣ Creating Neon project..."
PROJECT_ID=$(neon project create "$PROJECT_NAME" \
    --region "$REGION" \
    --compute-min "$MIN_COMPUTE" \
    --compute-max "$MAX_COMPUTE" \
    --auto-suspend "$AUTO_SUSPEND_SECONDS" \
    --output json | jq -r '.id')

echo "✅ Project created: $PROJECT_ID"
echo ""

echo "2️⃣ Setting up main branch configuration..."
neon branch update main \
    --project-id "$PROJECT_ID" \
    --compute-min "$MIN_COMPUTE" \
    --compute-max "$MAX_COMPUTE"

echo "✅ Main branch configured"
echo ""

echo "3️⃣ Creating development branch (shadow DB)..."
DEV_BRANCH=$(neon branch create development \
    --project-id "$PROJECT_ID" \
    --output json | jq -r '.name')

echo "✅ Development branch created: $DEV_BRANCH"
echo ""

echo "4️⃣ Getting connection strings..."
echo ""

# Main branch (production)
MAIN_DIRECT=$(neon connection-string "$PROJECT_NAME" --branch main)
MAIN_POOLED=$(neon connection-string "$PROJECT_NAME" --branch main --pooled)

# Development branch (shadow DB)
DEV_DIRECT=$(neon connection-string "$PROJECT_NAME" --branch development)

echo "📝 Connection Strings:"
echo "====================="
echo ""
echo "# Production (Main Branch)"
echo "DATABASE_URL=\"$MAIN_POOLED\""
echo "DATABASE_URL_DIRECT=\"$MAIN_DIRECT\"  # For migrations"
echo ""
echo "# Shadow DB (Development Branch)"
echo "SHADOW_DATABASE_URL=\"$DEV_DIRECT\""
echo ""

# Save to file
cat > .env.neon.new << EOF
# Neon Database Configuration
# Generated: $(date)
# Project: $PROJECT_NAME ($PROJECT_ID)

# Production Database
DATABASE_URL="$MAIN_POOLED"
DATABASE_URL_DIRECT="$MAIN_DIRECT"

# Shadow Database (for migrations)
SHADOW_DATABASE_URL="$DEV_DIRECT"

# Neon Project Details
NEON_PROJECT_ID="$PROJECT_ID"
NEON_PROJECT_NAME="$PROJECT_NAME"
NEON_REGION="$REGION"
EOF

echo "✅ Connection strings saved to: .env.neon.new"
echo ""

echo "5️⃣ Configuring history retention (30 days)..."
# This needs to be done via Neon console
echo "⚠️  Manual step required:"
echo "   1. Go to: https://console.neon.tech/app/projects/$PROJECT_ID/settings"
echo "   2. Under 'History Retention', set to 30 days"
echo ""

echo "6️⃣ Getting Neon API key..."
echo "⚠️  Manual step required:"
echo "   1. Go to: https://console.neon.tech/app/account/api-keys"
echo "   2. Create new API key: 'Better Being Migration'"
echo "   3. Add to .env: NEON_API_KEY=\"your-key-here\""
echo ""

echo "7️⃣ Next steps..."
echo "================"
echo "1. Review connection strings in .env.neon.new"
echo "2. Complete manual configuration steps above"
echo "3. Run: ./02-migrate-schema.sh"
echo ""

echo "✅ Database creation complete!"
echo ""
echo "📊 View your project: https://console.neon.tech/app/projects/$PROJECT_ID"
