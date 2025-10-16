import { handlers } from "@/services/auth/auth";

// Force Node.js runtime for bcrypt compatibility
export const runtime = 'nodejs';

// Export the NextAuth handlers for GET and POST requests
export const { GET, POST } = handlers;