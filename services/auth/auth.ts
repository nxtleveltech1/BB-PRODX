import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { db } from "@/lib/db/client-node";
import * as schema from "@/lib/db/schema";
import { env } from "@/lib/env";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { z } from "zod";

// Define the auth config
export const { handlers, auth, signIn, signOut } = NextAuth({
  // No adapter needed for JWT strategy - sessions stored in tokens, not database

  session: {
    strategy: "jwt", // Use JWT for session management
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  providers: [
    // GitHub OAuth provider
    ...(env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET
      ? [
          GitHub({
            clientId: env.GITHUB_CLIENT_ID,
            clientSecret: env.GITHUB_CLIENT_SECRET,
          }),
        ]
      : []),

    // Google OAuth provider
    ...(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET
      ? [
          Google({
            clientId: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),

    // Credentials provider for email/password login
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Validate input
        const parsedCredentials = z
          .object({
            email: z.string().email(),
            password: z.string().min(6),
          })
          .safeParse(credentials);

        if (!parsedCredentials.success) {
          return null;
        }

        const { email, password } = parsedCredentials.data;

        // Find user by email
        const user = await db
          .select()
          .from(schema.users)
          .where(eq(schema.users.email, email))
          .limit(1)
          .then((users) => users[0]);

        if (!user || !user.password) {
          return null;
        }

        // Check if account is locked
        if (user.lockedUntil && user.lockedUntil > new Date()) {
          return null;
        }

        // Verify password
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
          // Increment login attempts
          await db
            .update(schema.users)
            .set({
              loginAttempts: (user.loginAttempts || 0) + 1,
              // Lock account after 5 failed attempts
              lockedUntil:
                (user.loginAttempts || 0) >= 4
                  ? new Date(Date.now() + 30 * 60 * 1000) // Lock for 30 minutes
                  : null,
            })
            .where(eq(schema.users.id, user.id));

          return null;
        }

        // Reset login attempts and update last login
        await db
          .update(schema.users)
          .set({
            loginAttempts: 0,
            lockedUntil: null,
            lastLogin: new Date(),
          })
          .where(eq(schema.users.id, user.id));

        // Return user object for JWT
        return {
          id: user.id.toString(),
          email: user.email,
          name: user.name || `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email,
          image: user.image || user.profileImageUrl,
          role: user.role,
        };
      },
    }),
  ],

  callbacks: {
    // Customize JWT token
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || "user";
      }

      // Store provider info for first-time OAuth users
      if (account) {
        token.provider = account.provider;
      }

      return token;
    },

    // Customize session
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.provider = token.provider as string;
      }

      return session;
    },

    // Handle sign in
    async signIn({ user, account, profile }) {
      // Allow OAuth sign-ins
      if (account?.provider !== "credentials") {
        return true;
      }

      // For credentials provider, check if email is verified
      const dbUser = await db
        .select()
        .from(schema.users)
        .where(eq(schema.users.id, parseInt(user.id!)))
        .limit(1)
        .then((users) => users[0]);

      // You can add email verification requirement here
      // if (!dbUser?.emailVerified) {
      //   return "/auth/verify-email";
      // }

      return true;
    },

    // Handle redirects
    async redirect({ url, baseUrl }) {
      // Redirect to dashboard after sign in
      if (url === baseUrl) {
        return `${baseUrl}/dashboard`;
      }

      // Allow relative callback URLs
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }

      // Allow callback URLs on the same origin
      if (new URL(url).origin === baseUrl) {
        return url;
      }

      return baseUrl;
    },
  },

  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
    verifyRequest: "/auth/verify-request",
    newUser: "/auth/new-user",
  },

  // Enable debug logs in development
  debug: env.NODE_ENV === "development",

  // Security options
  trustHost: true,
  secret: env.NEXTAUTH_SECRET,
});