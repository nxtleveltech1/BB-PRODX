#!/bin/bash

# BB-PRODX Production Deployment Script
# Usage: ./scripts/deploy.sh [environment]
# Environments: staging, production

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
ENVIRONMENT=${1:-staging}
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DEPLOYMENT_ID="deploy_${ENVIRONMENT}_${TIMESTAMP}"

# Functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

check_requirements() {
    log_info "Checking deployment requirements..."

    # Check Node version
    NODE_VERSION=$(node -v)
    log_info "Node version: $NODE_VERSION"

    # Check pnpm
    if ! command -v pnpm &> /dev/null; then
        log_error "pnpm is not installed"
        exit 1
    fi

    # Check Vercel CLI
    if ! command -v vercel &> /dev/null; then
        log_error "Vercel CLI is not installed"
        exit 1
    fi

    log_info "All requirements met"
}

run_pre_deployment_checks() {
    log_info "Running pre-deployment checks..."

    # Type checking
    log_info "Running TypeScript type check..."
    npx tsc --noEmit || {
        log_error "TypeScript errors found"
        exit 1
    }

    # Linting
    log_info "Running ESLint..."
    pnpm lint || {
        log_error "Linting errors found"
        exit 1
    }

    # Build test
    log_info "Testing production build..."
    pnpm build || {
        log_error "Build failed"
        exit 1
    }

    # Run tests
    log_info "Running tests..."
    pnpm test:run || {
        log_warn "Some tests failed - review before continuing"
        read -p "Continue with deployment? (y/n) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    }

    log_info "Pre-deployment checks passed"
}

backup_current_deployment() {
    log_info "Creating deployment backup..."

    # Create backup directory
    BACKUP_DIR="backups/${DEPLOYMENT_ID}"
    mkdir -p "$BACKUP_DIR"

    # Save current environment
    cp .env.local "$BACKUP_DIR/.env.local.backup" 2>/dev/null || true

    # Save deployment metadata
    cat > "$BACKUP_DIR/deployment.json" <<EOF
{
    "timestamp": "${TIMESTAMP}",
    "environment": "${ENVIRONMENT}",
    "node_version": "${NODE_VERSION}",
    "git_branch": "$(git branch --show-current)",
    "git_commit": "$(git rev-parse HEAD)",
    "deployer": "${USER}"
}
EOF

    log_info "Backup created at $BACKUP_DIR"
}

run_database_migrations() {
    log_info "Running database migrations..."

    # Check if migrations are needed
    if [ -d "db/migrations" ]; then
        pnpm db:migrate || {
            log_error "Database migration failed"
            exit 1
        }
        log_info "Database migrations completed"
    else
        log_info "No database migrations found"
    fi
}

create_sentry_release() {
    log_info "Creating Sentry release..."

    # Check if Sentry CLI is available
    if command -v sentry-cli &> /dev/null; then
        VERSION=$(git describe --tags --always)

        # Create release
        sentry-cli releases new "$VERSION" || true

        # Upload source maps
        sentry-cli releases files "$VERSION" upload-sourcemaps ./.next || true

        # Set commits
        sentry-cli releases set-commits "$VERSION" --auto || true

        # Finalize release
        sentry-cli releases finalize "$VERSION" || true

        log_info "Sentry release $VERSION created"
    else
        log_warn "Sentry CLI not found - skipping Sentry release"
    fi
}

deploy_to_vercel() {
    log_info "Deploying to Vercel (${ENVIRONMENT})..."

    if [ "$ENVIRONMENT" = "production" ]; then
        # Production deployment
        log_info "Deploying to production..."
        vercel --prod --yes || {
            log_error "Production deployment failed"
            exit 1
        }
    else
        # Staging deployment
        log_info "Deploying to staging..."
        vercel --yes || {
            log_error "Staging deployment failed"
            exit 1
        }
    fi

    log_info "Deployment to Vercel completed"
}

run_post_deployment_checks() {
    log_info "Running post-deployment checks..."

    # Get deployment URL
    if [ "$ENVIRONMENT" = "production" ]; then
        DEPLOYMENT_URL="https://app.betterbeing.com"
    else
        DEPLOYMENT_URL=$(vercel ls --json | jq -r '.[0].url' 2>/dev/null || echo "staging-url")
    fi

    log_info "Checking deployment at $DEPLOYMENT_URL"

    # Health check
    log_info "Running health check..."
    curl -s -o /dev/null -w "%{http_code}" "$DEPLOYMENT_URL/api/health" | grep -q "200" || {
        log_error "Health check failed"
        exit 1
    }

    # Basic smoke tests
    log_info "Running smoke tests..."
    curl -s -o /dev/null -w "%{http_code}" "$DEPLOYMENT_URL" | grep -q "200" || {
        log_error "Homepage check failed"
        exit 1
    }

    curl -s -o /dev/null -w "%{http_code}" "$DEPLOYMENT_URL/api/products" | grep -q "200" || {
        log_warn "Products API check failed - may need investigation"
    }

    log_info "Post-deployment checks completed"
}

notify_deployment() {
    log_info "Sending deployment notifications..."

    # Create notification message
    MESSAGE="Deployment completed: ${ENVIRONMENT} at ${TIMESTAMP}"

    # Send Slack notification (if webhook is configured)
    if [ ! -z "$SLACK_WEBHOOK_URL" ]; then
        curl -X POST -H 'Content-type: application/json' \
            --data "{\"text\":\"$MESSAGE\"}" \
            "$SLACK_WEBHOOK_URL" 2>/dev/null || true
    fi

    # Log deployment
    echo "$DEPLOYMENT_ID: $MESSAGE" >> deployments.log

    log_info "Notifications sent"
}

rollback_deployment() {
    log_error "Deployment failed - initiating rollback..."

    if [ "$ENVIRONMENT" = "production" ]; then
        log_info "Rolling back production deployment..."
        vercel rollback --yes || {
            log_error "Automatic rollback failed - manual intervention required!"
            exit 1
        }
        log_info "Rollback completed"
    else
        log_warn "Staging deployment failed - no rollback needed"
    fi
}

# Main deployment flow
main() {
    echo "========================================="
    echo "BB-PRODX Deployment Script"
    echo "Environment: $ENVIRONMENT"
    echo "Timestamp: $TIMESTAMP"
    echo "========================================="

    # Confirmation for production
    if [ "$ENVIRONMENT" = "production" ]; then
        log_warn "You are about to deploy to PRODUCTION!"
        read -p "Are you sure? Type 'deploy' to continue: " confirm
        if [ "$confirm" != "deploy" ]; then
            log_info "Deployment cancelled"
            exit 0
        fi
    fi

    # Set up error handling
    trap rollback_deployment ERR

    # Run deployment steps
    check_requirements
    backup_current_deployment
    run_pre_deployment_checks
    run_database_migrations
    create_sentry_release
    deploy_to_vercel
    run_post_deployment_checks
    notify_deployment

    # Success
    echo "========================================="
    log_info "Deployment completed successfully!"
    log_info "Environment: $ENVIRONMENT"
    log_info "Deployment ID: $DEPLOYMENT_ID"
    echo "========================================="
}

# Run main function
main