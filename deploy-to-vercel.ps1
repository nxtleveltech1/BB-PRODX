#!/usr/bin/env pwsh

# Vercel Deployment Script for BB-PRODX
# This script will help you deploy your Next.js app to Vercel

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "   VERCEL DEPLOYMENT SETUP SCRIPT   " -ForegroundColor Yellow
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Function to check if command exists
function Test-Command {
    param($Command)
    try {
        Get-Command $Command -ErrorAction Stop | Out-Null
        return $true
    } catch {
        return $false
    }
}

# Step 1: Check if Vercel CLI is installed
Write-Host "[Step 1] Checking Vercel CLI installation..." -ForegroundColor Green
if (Test-Command "vercel") {
    $vercelVersion = vercel --version 2>&1 | Select-Object -Last 1
    Write-Host "✓ Vercel CLI is installed (version: $vercelVersion)" -ForegroundColor Green
} else {
    Write-Host "✗ Vercel CLI not found. Installing..." -ForegroundColor Yellow
    npm install -g vercel@latest
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to install Vercel CLI. Please run: npm install -g vercel" -ForegroundColor Red
        exit 1
    }
    Write-Host "✓ Vercel CLI installed successfully" -ForegroundColor Green
}

Write-Host ""

# Step 2: Check authentication status
Write-Host "[Step 2] Checking Vercel authentication..." -ForegroundColor Green
$authCheck = vercel whoami 2>&1
if ($authCheck -match "Error") {
    Write-Host "✗ Not authenticated with Vercel" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "You need to login to Vercel first." -ForegroundColor Yellow
    Write-Host "This will open a browser window for authentication." -ForegroundColor Cyan
    Write-Host ""
    
    $loginChoice = Read-Host "Do you want to login now? (Y/N)"
    if ($loginChoice -eq "Y" -or $loginChoice -eq "y") {
        Write-Host "Starting Vercel login..." -ForegroundColor Green
        Write-Host "Choose your preferred login method when prompted:" -ForegroundColor Cyan
        Write-Host "  • GitHub (recommended if your code is on GitHub)" -ForegroundColor White
        Write-Host "  • GitLab" -ForegroundColor White
        Write-Host "  • Bitbucket" -ForegroundColor White
        Write-Host "  • Email" -ForegroundColor White
        Write-Host ""
        
        # Run vercel login
        vercel login
        
        if ($LASTEXITCODE -ne 0) {
            Write-Host "Login failed or cancelled. Please try again." -ForegroundColor Red
            exit 1
        }
        Write-Host "✓ Successfully authenticated with Vercel!" -ForegroundColor Green
    } else {
        Write-Host "Authentication required. Please run: vercel login" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "✓ Already authenticated as: $authCheck" -ForegroundColor Green
}

Write-Host ""

# Step 3: Build check
Write-Host "[Step 3] Checking project build..." -ForegroundColor Green
$buildChoice = Read-Host "Do you want to test the build locally first? (Y/N)"
if ($buildChoice -eq "Y" -or $buildChoice -eq "y") {
    Write-Host "Building project..." -ForegroundColor Yellow
    npm run build
    if ($LASTEXITCODE -ne 0) {
        Write-Host "✗ Build failed. Please fix build errors before deploying." -ForegroundColor Red
        exit 1
    }
    Write-Host "✓ Build successful!" -ForegroundColor Green
}

Write-Host ""

# Step 4: Deploy to Vercel
Write-Host "[Step 4] Ready to deploy to Vercel" -ForegroundColor Green
Write-Host ""
Write-Host "Deployment Options:" -ForegroundColor Cyan
Write-Host "  1. Preview Deployment (creates a unique preview URL)" -ForegroundColor White
Write-Host "  2. Production Deployment (updates your main site)" -ForegroundColor White
Write-Host "  3. Cancel" -ForegroundColor White
Write-Host ""

$deployChoice = Read-Host "Choose deployment type (1/2/3)"

switch ($deployChoice) {
    "1" {
        Write-Host ""
        Write-Host "Starting PREVIEW deployment..." -ForegroundColor Yellow
        Write-Host "This will create a unique URL for testing." -ForegroundColor Cyan
        Write-Host ""
        
        # Run vercel for preview
        vercel
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "✓ Preview deployment successful!" -ForegroundColor Green
            Write-Host "Your preview URL has been copied to clipboard and shown above." -ForegroundColor Cyan
        } else {
            Write-Host "✗ Deployment failed. Please check the errors above." -ForegroundColor Red
        }
    }
    "2" {
        Write-Host ""
        Write-Host "Starting PRODUCTION deployment..." -ForegroundColor Yellow
        Write-Host "This will update your live production site." -ForegroundColor Red
        
        $confirmProd = Read-Host "Are you sure you want to deploy to production? (YES/no)"
        if ($confirmProd -eq "YES") {
            Write-Host ""
            vercel --prod
            
            if ($LASTEXITCODE -eq 0) {
                Write-Host ""
                Write-Host "✓ Production deployment successful!" -ForegroundColor Green
                Write-Host "Your site is now live!" -ForegroundColor Cyan
            } else {
                Write-Host "✗ Deployment failed. Please check the errors above." -ForegroundColor Red
            }
        } else {
            Write-Host "Production deployment cancelled." -ForegroundColor Yellow
        }
    }
    "3" {
        Write-Host "Deployment cancelled." -ForegroundColor Yellow
        exit 0
    }
    default {
        Write-Host "Invalid choice. Please run the script again." -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "         DEPLOYMENT COMPLETE         " -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Useful Vercel Commands:" -ForegroundColor Yellow
Write-Host "  vercel          - Deploy preview" -ForegroundColor White
Write-Host "  vercel --prod   - Deploy to production" -ForegroundColor White
Write-Host "  vercel dev      - Run development server" -ForegroundColor White
Write-Host "  vercel logs     - View deployment logs" -ForegroundColor White
Write-Host "  vercel ls       - List all deployments" -ForegroundColor White
Write-Host ""