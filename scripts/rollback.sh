#!/bin/bash

# BB-PRODX Emergency Rollback Script
# Usage: ./scripts/rollback.sh [environment]

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

ENVIRONMENT=${1:-production}

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

main() {
    echo "========================================="
    echo "BB-PRODX Emergency Rollback"
    echo "Environment: $ENVIRONMENT"
    echo "========================================="

    log_warn "This will rollback to the previous deployment!"
    read -p "Are you sure? Type 'rollback' to continue: " confirm

    if [ "$confirm" != "rollback" ]; then
        log_info "Rollback cancelled"
        exit 0
    fi

    log_info "Initiating rollback..."

    # Check Vercel CLI
    if ! command -v vercel &> /dev/null; then
        log_error "Vercel CLI is not installed"
        exit 1
    fi

    # Get current deployment info
    log_info "Getting current deployment information..."
    CURRENT_URL=$(vercel inspect --json | jq -r '.url' 2>/dev/null || echo "unknown")
    log_info "Current deployment: $CURRENT_URL"

    # Perform rollback
    log_info "Rolling back to previous version..."
    if [ "$ENVIRONMENT" = "production" ]; then
        vercel rollback --yes --prod || {
            log_error "Rollback failed!"
            exit 1
        }
    else
        vercel rollback --yes || {
            log_error "Rollback failed!"
            exit 1
        }
    fi

    # Wait for rollback to complete
    log_info "Waiting for rollback to complete..."
    sleep 10

    # Verify rollback
    log_info "Verifying rollback..."
    if [ "$ENVIRONMENT" = "production" ]; then
        DEPLOYMENT_URL="https://app.betterbeing.com"
    else
        DEPLOYMENT_URL=$(vercel ls --json | jq -r '.[0].url' 2>/dev/null || echo "staging-url")
    fi

    # Health check
    curl -s -o /dev/null -w "%{http_code}" "$DEPLOYMENT_URL/api/health" | grep -q "200" || {
        log_error "Health check failed after rollback"
        exit 1
    }

    # Log rollback
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    echo "rollback_${ENVIRONMENT}_${TIMESTAMP}: Rolled back from $CURRENT_URL" >> rollbacks.log

    # Send notifications
    MESSAGE="Emergency rollback completed for ${ENVIRONMENT}"
    if [ ! -z "$SLACK_WEBHOOK_URL" ]; then
        curl -X POST -H 'Content-type: application/json' \
            --data "{\"text\":\"$MESSAGE\",\"color\":\"warning\"}" \
            "$SLACK_WEBHOOK_URL" 2>/dev/null || true
    fi

    echo "========================================="
    log_info "Rollback completed successfully!"
    log_info "Previous deployment restored"
    echo "========================================="
}

main