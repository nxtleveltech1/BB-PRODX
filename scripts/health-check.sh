#!/bin/bash

# BB-PRODX Health Check Script
# Usage: ./scripts/health-check.sh [environment]

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

ENVIRONMENT=${1:-production}
FAILED_CHECKS=0

# URLs
if [ "$ENVIRONMENT" = "production" ]; then
    BASE_URL="https://app.betterbeing.com"
else
    BASE_URL="http://localhost:3000"
fi

log_success() {
    echo -e "${GREEN}✓${NC} $1"
}

log_fail() {
    echo -e "${RED}✗${NC} $1"
    ((FAILED_CHECKS++))
}

log_warn() {
    echo -e "${YELLOW}⚠${NC} $1"
}

check_endpoint() {
    local endpoint=$1
    local expected_code=$2
    local description=$3

    local url="${BASE_URL}${endpoint}"
    local response_code=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null || echo "000")

    if [ "$response_code" = "$expected_code" ]; then
        log_success "$description (${endpoint}): ${response_code}"
        return 0
    else
        log_fail "$description (${endpoint}): Expected ${expected_code}, got ${response_code}"
        return 1
    fi
}

check_response_time() {
    local endpoint=$1
    local max_time=$2
    local description=$3

    local url="${BASE_URL}${endpoint}"
    local response_time=$(curl -s -o /dev/null -w "%{time_total}" "$url" 2>/dev/null || echo "999")
    local response_time_ms=$(echo "$response_time * 1000" | bc | cut -d'.' -f1)

    if [ "$response_time_ms" -lt "$max_time" ]; then
        log_success "$description response time: ${response_time_ms}ms (< ${max_time}ms)"
        return 0
    else
        log_warn "$description response time: ${response_time_ms}ms (> ${max_time}ms)"
        return 1
    fi
}

check_json_response() {
    local endpoint=$1
    local json_path=$2
    local expected_value=$3
    local description=$4

    local url="${BASE_URL}${endpoint}"
    local actual_value=$(curl -s "$url" | jq -r "$json_path" 2>/dev/null || echo "error")

    if [ "$actual_value" = "$expected_value" ]; then
        log_success "$description: ${actual_value}"
        return 0
    else
        log_fail "$description: Expected ${expected_value}, got ${actual_value}"
        return 1
    fi
}

main() {
    echo "========================================="
    echo "BB-PRODX Health Check"
    echo "Environment: $ENVIRONMENT"
    echo "URL: $BASE_URL"
    echo "Time: $(date)"
    echo "========================================="
    echo

    # Core endpoints
    echo "Checking Core Endpoints..."
    check_endpoint "/" "200" "Homepage"
    check_endpoint "/api/health" "200" "API Health"
    check_endpoint "/auth/signin" "200" "Sign In Page"
    check_endpoint "/products" "200" "Products Page"
    echo

    # API endpoints
    echo "Checking API Endpoints..."
    check_endpoint "/api/products" "200" "Products API"
    check_json_response "/api/health" ".status" "healthy" "Health Status"
    echo

    # Performance checks
    echo "Checking Performance..."
    check_response_time "/" 3000 "Homepage"
    check_response_time "/api/products" 2000 "Products API"
    check_response_time "/api/health" 500 "Health Check"
    echo

    # Database connectivity (if health endpoint provides it)
    echo "Checking Database..."
    if [ "$ENVIRONMENT" != "production" ]; then
        check_json_response "/api/health/db" ".status" "connected" "Database Connection"
    fi
    echo

    # Static assets
    echo "Checking Static Assets..."
    check_endpoint "/_next/static/chunks/main.js" "200" "Main JavaScript Bundle" || true
    check_endpoint "/favicon.ico" "200" "Favicon" || true
    echo

    # Security headers
    echo "Checking Security Headers..."
    local security_headers=$(curl -sI "${BASE_URL}/" 2>/dev/null)

    if echo "$security_headers" | grep -qi "x-frame-options"; then
        log_success "X-Frame-Options header present"
    else
        log_warn "X-Frame-Options header missing"
    fi

    if echo "$security_headers" | grep -qi "x-content-type-options"; then
        log_success "X-Content-Type-Options header present"
    else
        log_warn "X-Content-Type-Options header missing"
    fi

    if echo "$security_headers" | grep -qi "strict-transport-security"; then
        log_success "Strict-Transport-Security header present"
    else
        if [ "$ENVIRONMENT" = "production" ]; then
            log_fail "Strict-Transport-Security header missing (required for production)"
        else
            log_warn "Strict-Transport-Security header missing (optional for development)"
        fi
    fi
    echo

    # Summary
    echo "========================================="
    if [ $FAILED_CHECKS -eq 0 ]; then
        echo -e "${GREEN}Health check completed successfully!${NC}"
        echo "All checks passed"
    else
        echo -e "${RED}Health check completed with failures${NC}"
        echo "Failed checks: $FAILED_CHECKS"
    fi
    echo "========================================="

    # Return non-zero exit code if any checks failed
    if [ $FAILED_CHECKS -gt 0 ]; then
        exit 1
    fi
}

# Run main function
main