<#
.SYNOPSIS
  Safely set git origin with a temporary token URL, push branches and tags, then restore a clean HTTPS remote.

.DESCRIPTION
  PowerShell-safe script to avoid common mistakes like splitting commands across lines or inserting spaces in the URL.
  Example issue: placing "BetterBeingProd.git" on its own line causes PowerShell to treat it as a command.

.PARAMETER Username
  GitHub username (e.g., gazbew)

.PARAMETER Token
  GitHub personal access token. Avoid hardcoding; pass via env var or prompt.

.PARAMETER Repo
  The owner/name repository slug (e.g., gazbew/BetterBeingProd).

.PARAMETER Branch
  The default branch to push first (defaults to 'main').

.EXAMPLE
  # Using a secure prompt for the token
  $sec = Read-Host -AsSecureString "GitHub Token"
  $tok = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($sec))
  ./scripts/set-remote-and-push.ps1 -Username "gazbew" -Token $tok -Repo "gazbew/BetterBeingProd" -Branch "main"

.NOTES
  - The token will be part of the remote URL temporarily; this is sensitive. The script restores the remote to a clean URL after pushing.
  - Requires Git to be installed and the script to be run from the repository root.
#>
param(
  [Parameter(Mandatory=$true)] [string]$Username,
  [Parameter(Mandatory=$true)] [string]$Token,
  [Parameter(Mandatory=$true)] [string]$Repo,
  [string]$Branch = 'main'
)

function Fail($msg) {
  Write-Error $msg
  exit 1
}

# Basic validations
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
  Fail "Git is not installed or not in PATH."
}

# Ensure we're inside a git repo
$gitTop = git rev-parse --show-toplevel 2>$null
if ($LASTEXITCODE -ne 0) {
  Fail "Current directory is not a Git repository. Navigate to the repo root and retry."
}

# Normalize repo slug
if ($Repo -notmatch '^.+/.+?$') {
  Fail "-Repo must be in the form 'owner/name' (e.g., gazbew/BetterBeingProd)."
}

# Build token URL carefully to avoid PowerShell interpolation issues and encode credentials
$encUser = [System.Uri]::EscapeDataString($Username)
$encTok  = [System.Uri]::EscapeDataString($Token)
$tokenUrl = "https://${encUser}:${encTok}@github.com/${Repo}.git"
$cleanUrl = "https://github.com/${Repo}.git"

Write-Host "Setting origin to token URL (temporary)..." -ForegroundColor Yellow
$null = git remote set-url origin "$tokenUrl"
if ($LASTEXITCODE -ne 0) { Fail "Failed to set origin to token URL." }

Write-Host "Pushing $Branch with --force-with-lease..." -ForegroundColor Cyan
$null = git push -u origin "$Branch" --force-with-lease
if ($LASTEXITCODE -ne 0) { Fail "Failed to push $Branch." }

Write-Host "Pushing all branches with --force-with-lease..." -ForegroundColor Cyan
$null = git push origin --all --force-with-lease
if ($LASTEXITCODE -ne 0) { Fail "Failed to push all branches." }

Write-Host "Pushing tags..." -ForegroundColor Cyan
$null = git push origin --tags
if ($LASTEXITCODE -ne 0) { Fail "Failed to push tags." }

Write-Host "Restoring origin to clean HTTPS URL..." -ForegroundColor Yellow
$null = git remote set-url origin "$cleanUrl"
if ($LASTEXITCODE -ne 0) { Fail "Failed to restore origin to clean URL." }

Write-Host "Done. Current remotes:" -ForegroundColor Green
git remote -v
