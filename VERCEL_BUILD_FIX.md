# Vercel Build Fix: pnpm Registry Fetch Errors

## Problem
Vercel builds were failing with multiple registry fetch errors:
```
WARN  GET https://registry.npmjs.org/[package] error (ERR_INVALID_THIS). Will retry in 1 minute.
ERR_PNPM_META_FETCH_FAIL  GET https://registry.npmjs.org/bcryptjs: Value of "this" must be of type URLSearchParams
```

This affected packages: jest, bcryptjs, compression, cors, dotenv, express, helmet, joi, jsonwebtoken, moment, node-cron, node-fetch, pg, stripe, uuid, nodemon.

## Root Cause
**pnpm 10.18.3 is incompatible with Vercel's Node.js build environment**. The error "Value of 'this' must be of type URLSearchParams" is a known compatibility issue between pnpm 10.x and certain Node.js versions used by Vercel.

## Solution Implemented

### 1. Downgraded pnpm Version
**Changed:** `pnpm@10.18.3` → `pnpm@9.15.0`

Updated in:
- `K:\.ProductionDevelopmentENV\BB-PRODX\BB-PRODX\package.json`
- `K:\.ProductionDevelopmentENV\BB-PRODX\BB-PRODX\server\package.json`

**Rationale:** pnpm 9.x is the stable, Vercel-compatible version with proven production reliability.

### 2. Enhanced `.npmrc` Configuration
Added comprehensive registry and installation settings:

```ini
legacy-peer-deps=true
auto-install-peers=true
strict-peer-dependencies=false
registry=https://registry.npmjs.org/
fetch-retries=3
fetch-retry-mintimeout=10000
fetch-retry-maxtimeout=60000
network-timeout=300000
node-linker=hoisted
shamefully-hoist=true
public-hoist-pattern[]=*
```

**Key settings:**
- **Registry Configuration**: Explicit npmjs.org registry with retry logic
- **Retry Settings**: 3 attempts with 10-60 second backoff to handle network issues
- **Network Timeout**: 5-minute timeout for slower connections
- **Hoisting**: Flattened dependency tree to avoid Windows path length issues

### 3. Updated Vercel Configuration
Enhanced `vercel.json` with explicit install command:

```json
{
  "buildCommand": "pnpm run vercel-build",
  "installCommand": "pnpm install --no-frozen-lockfile",
  "outputDirectory": ".next",
  "framework": "nextjs"
}
```

**Key additions:**
- `installCommand`: Explicit pnpm install with `--no-frozen-lockfile` for flexibility
- `framework`: Explicit Next.js framework detection

### 4. Fixed server/package.json Formatting
Removed trailing comma causing JSON parsing issues.

## Files Changed

1. **`.npmrc`** - Enhanced with registry configuration and hoisting
2. **`package.json`** - Downgraded pnpm to 9.15.0
3. **`server/package.json`** - Downgraded pnpm to 9.15.0, fixed formatting
4. **`vercel.json`** - Added explicit installCommand

## Verification Steps

### Local Testing
```bash
# Clean install with new configuration
pnpm install --shamefully-hoist --no-frozen-lockfile

# Build frontend
pnpm run build:frontend

# Build for Vercel
pnpm run vercel-build
```

### Vercel Deployment
After pushing these changes, Vercel will:
1. Use pnpm 9.15.0 (from packageManager field)
2. Apply .npmrc settings automatically
3. Run custom installCommand from vercel.json
4. Execute buildCommand for production build

## Expected Results

✅ **Successful package installation** without registry fetch errors
✅ **Faster builds** with retry logic handling transient network issues
✅ **Windows path compatibility** with hoisted dependencies
✅ **Vercel deployment success** with pnpm 9.x compatibility

## Troubleshooting

If issues persist:

1. **Clear Vercel Cache**: In Vercel dashboard → Settings → Clear Build Cache
2. **Verify Environment**: Ensure no PNPM environment variables override packageManager
3. **Check Node Version**: Vercel should use Node.js 18.x or 20.x (compatible with pnpm 9)
4. **Review Build Logs**: Check for any remaining registry or network errors

## Additional Notes

- **pnpm-lock.yaml** already uses lockfileVersion 9.0 (compatible with pnpm 9.x)
- **No dependency changes required** - this is purely a build configuration fix
- **Local builds remain functional** with existing setup
- **Backwards compatible** with existing development workflows

## Commit
```
fix: Downgrade pnpm to 9.15.0 and enhance .npmrc for Vercel compatibility

Fixes Vercel build failures with registry fetch errors caused by pnpm 10.18.3 incompatibility.
```

## References

- pnpm 9.x Documentation: https://pnpm.io/9.x/installation
- Vercel pnpm Support: https://vercel.com/docs/deployments/configure-a-build#package-managers
- Issue: URLSearchParams compatibility in pnpm 10.x on certain Node.js versions
