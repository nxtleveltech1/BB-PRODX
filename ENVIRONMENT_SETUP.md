# Better Being Environment Configuration Guide

This guide explains how to set up environment variables for both the frontend (Next.js) and backend (Express.js) applications.

## 📁 Environment Files Structure

```
BB-PROD/
├── .env.local                    # Frontend production env (not committed)
├── .env.example                  # Frontend example/template (committed)
├── .env.development             # Frontend dev config (not committed)  
├── .env.production              # Frontend prod config (not committed)
└── server/
    ├── .env                     # Backend production env (not committed)
    └── .env.example             # Backend example/template (committed)
```

## 🚀 Quick Setup

### Frontend Environment (.env.local)
```bash
# Copy the example file
cp .env.example .env.local

# Edit with your actual values
# Key variables to configure:
# - NEXT_PUBLIC_API_URL (your backend API endpoint)
# - NEXT_PUBLIC_APP_URL (your frontend URL)
# - Database and external API keys as needed
```

### Backend Environment (server/.env)  
```bash
# Copy the example file
cp server/.env.example server/.env

# Edit with your actual values
# Key variables to configure:
# - FRONTEND_URL (your frontend URL for CORS)
# - JWT_SECRET (generate a secure secret)
# - API keys for external services
```

## 🔧 Environment Variables Explained

### Frontend Variables

#### Public Variables (NEXT_PUBLIC_*)
- **NEXT_PUBLIC_APP_NAME**: Application display name
- **NEXT_PUBLIC_APP_URL**: Your domain URL
- **NEXT_PUBLIC_API_URL**: Backend API endpoint
- **NEXT_PUBLIC_ENABLE_*****: Feature flags for functionality

#### Private Variables (Server-side only)
- **DATABASE_URL**: Database connection string
- **STRIPE_SECRET_KEY**: Stripe secret key for payments
- **API_URL**: Internal API URL for server-side requests

### Backend Variables

#### Core Configuration
- **NODE_ENV**: Environment (development/production)
- **PORT**: Server port (default: 3001)
- **FRONTEND_URL**: Frontend URL for CORS configuration
- **JWT_SECRET**: Secret key for JWT token signing

#### External Services (Optional)
- **DATABASE_URL**: Database connection
- **STRIPE_SECRET_KEY**: Payment processing
- **OPENAI_API_KEY**: AI recommendations
- **EMAIL_API_KEY**: Email notifications

## 🔒 Security Best Practices

### ✅ DO:
- Keep `.env.local` and `server/.env` files private (they're in .gitignore)
- Use strong, unique secrets for JWT_SECRET
- Rotate API keys regularly
- Use different values for development vs production

### ❌ DON'T:
- Commit actual environment files with secrets
- Use weak or default secrets in production
- Share environment files via email or chat
- Use production secrets in development

## 🌍 Environment-Specific Setup

### Development Environment
```bash
# Use .env.development for local development
# Contains relaxed security settings and local URLs
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Production Environment  
```bash
# Use .env.production for production deployment
# Contains strict security and production URLs
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## 📊 Feature Flags

Control application features using environment variables:

```bash
# Enable/disable features
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_SUBSCRIPTIONS=false
NEXT_PUBLIC_ENABLE_CHAT_SUPPORT=true
NEXT_PUBLIC_ENABLE_PWA=true
```

## 🚨 Deployment Notes

### Vercel Deployment
1. Add environment variables in Vercel dashboard
2. Set different values for Preview vs Production environments
3. Use Vercel's environment variable inheritance

### Railway/Heroku Deployment
1. Set environment variables in platform dashboard
2. Ensure all required variables are configured
3. Test with staging environment first

## 🛠 Troubleshooting

### Common Issues:

**"Cannot connect to API"**
- Check NEXT_PUBLIC_API_URL is correct
- Verify backend is running on specified port
- Ensure CORS is configured with correct FRONTEND_URL

**"Authentication failed"**  
- Verify JWT_SECRET matches between frontend/backend
- Check API keys are valid and not expired

**"Build fails in production"**
- Ensure all required NEXT_PUBLIC_ variables are set
- Check no private variables are used in client-side code

## 📝 Environment Checklist

Before deployment, verify:

- [ ] All example files copied to actual environment files
- [ ] JWT_SECRET is strong and unique (minimum 32 characters)
- [ ] API URLs point to correct endpoints
- [ ] CORS configuration includes all necessary origins  
- [ ] Feature flags are set for desired functionality
- [ ] External API keys are valid and have proper permissions
- [ ] Database connection string is correct (if using database)
- [ ] Environment-specific settings are configured

## 🆘 Support

If you encounter issues with environment configuration:
1. Check this guide first
2. Verify example files have latest configuration options
3. Test with development environment first
4. Contact development team with specific error messages

---

**Note**: Never commit actual `.env` files with real secrets. Only commit `.env.example` template files.