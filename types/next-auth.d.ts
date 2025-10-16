import type { DefaultSession, DefaultUser } from "next-auth";

// Extend the default NextAuth types to include our custom fields
declare module "next-auth" {
  /**
   * Returned by `auth()`, `useSession`, `getSession` and received as
   * a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's unique database ID */
      id: string;
      /** The user's role (user, admin, etc.) */
      role: string;
      /** OAuth provider used for sign in */
      provider?: string;
    } & DefaultSession["user"];
  }

  /**
   * The shape of the user object returned in the session
   */
  interface User extends DefaultUser {
    /** The user's role */
    role?: string;
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `auth()`, when using JWT sessions */
  interface JWT {
    /** The user's unique database ID */
    id?: string;
    /** The user's role */
    role?: string;
    /** OAuth provider used for sign in */
    provider?: string;
  }
}