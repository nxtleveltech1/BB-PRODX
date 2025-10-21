-- Create NextAuth tables for authentication
-- These tables are required by NextAuth.js DrizzleAdapter

-- Accounts table for OAuth provider connections
CREATE TABLE IF NOT EXISTS accounts (
  "userId" integer NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type text NOT NULL,
  provider text NOT NULL,
  "providerAccountId" text NOT NULL,
  refresh_token text,
  access_token text,
  expires_at integer,
  token_type text,
  scope text,
  id_token text,
  session_state text,
  PRIMARY KEY (provider, "providerAccountId")
);

-- Sessions table for user sessions
CREATE TABLE IF NOT EXISTS sessions (
  "sessionToken" text PRIMARY KEY,
  "userId" integer NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires timestamp NOT NULL
);

-- Verification tokens table for email verification
CREATE TABLE IF NOT EXISTS "verificationTokens" (
  identifier text NOT NULL,
  token text NOT NULL,
  expires timestamp NOT NULL,
  PRIMARY KEY (identifier, token)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS accounts_userId_idx ON accounts("userId");
CREATE INDEX IF NOT EXISTS sessions_userId_idx ON sessions("userId");
