# 🗄️ Neon PostgreSQL Database Setup Guide

## Quick Setup (5 minutes)

### Step 1: Create Neon Account & Database
1. Go to https://console.neon.tech
2. Sign up (free tier available)
3. Create a new project
4. Copy your connection string (looks like: `postgresql://user:password@host/dbname`)

### Step 2: Get Your Connection String
In Neon Dashboard:
- Click on your project
- Go to "Connection details"
- Select "Connection string"
- Copy the full string

### Step 3: Configure `.env.local`
```bash
# Edit K:\.ProductionDevelopmentENV\BB-PRODX\BB-PRODX\.env.local

DATABASE_URL=postgresql://user:password@projectname.us-east-1.neon.tech/neondb
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-32-char-secret-here
JWT_SECRET=your-32-char-secret-here
```

### Step 4: Generate Secrets
```bash
# Generate two random secrets (use 32+ characters)
openssl rand -base64 32

# Do this twice and paste both into .env.local
```

### Step 5: Run Migrations
```bash
cd K:\.ProductionDevelopmentENV\BB-PRODX\BB-PRODX

# Create all database tables
pnpm db:migrate

# Seed with sample data
pnpm db:seed
```

### Step 6: Verify Connection
```bash
# Should show your database in Drizzle Studio
pnpm db:studio
```

### Step 7: Restart Dev Server
```bash
# Kill current server (Ctrl+C)
# Restart
pnpm dev
```

---

## 🔗 Neon Setup Details

### Get Your Connection String:
1. **Go to:** https://console.neon.tech
2. **Select Project** → Click your project name
3. **Connection Details Panel** (top right)
4. **Select Node.js** from dropdown
5. **Copy the full connection string**

### The Connection String Format:
```
postgresql://[user]:[password]@[host]/[database]
```

Example:
```
postgresql://neondb_owner:abcd1234@ep-cool-lake-123456.us-east-1.neon.tech/neondb
```

---

## ⚡ Free Tier Limits (Neon)
- ✅ Up to 3 projects
- ✅ 3 GB storage
- ✅ Full PostgreSQL features
- ✅ Perfect for development & small production apps

---

## 🚨 Common Issues

### "Connection refused"
→ Check DATABASE_URL is correct
→ Verify your IP is not blocked in Neon firewall

### "Authentication failed"
→ Double-check username and password in connection string
→ Make sure you copied the full string

### "Database does not exist"
→ Run `pnpm db:migrate` to create tables

### "Migrations failed"
→ Check SHADOW_DATABASE_URL if using (optional)
→ Run: `pnpm db:migrate --force` to retry

---

## ✅ After Setup Complete

Your application will:
- ✅ Load without 500 errors
- ✅ Store user data in Neon
- ✅ Handle authentication properly
- ✅ Be ready for production deployment

---

## 📝 Environment Variables Explained

| Variable | Purpose | Example |
|----------|---------|---------|
| DATABASE_URL | PostgreSQL connection | `postgresql://user:pass@host/db` |
| NEXTAUTH_URL | Auth callback URL | `http://localhost:3000` |
| NEXTAUTH_SECRET | Session encryption | 32+ random characters |
| JWT_SECRET | Token signing | 32+ random characters |

---

**Once you complete these steps, refresh http://localhost:3000 and everything will work!** ✅
