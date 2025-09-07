import express from 'express';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Helpers
function ok(res, body = {}) {
  return res.status(200).json({ success: true, ...body });
}
function fail(res, status = 400, code = 'BAD_REQUEST', message = 'Request failed', details = {}) {
  return res.status(status).json({ success: false, code, message, details });
}

// Mock user and tokens
function makeMockUser(overrides = {}) {
  return {
    id: 1,
    email: 'user@betterbeing.com',
    firstName: 'Better',
    lastName: 'Being',
    emailVerified: true,
    ...overrides,
  };
}
function makeTokens() {
  return {
    accessToken: `acc_${uuidv4()}`,
    refreshToken: `ref_${uuidv4()}`,
  };
}

// GET /api/auth/me
router.get('/me', (req, res) => {
  try {
    const auth = req.get('authorization') || req.get('Authorization');
    if (!auth || !auth.toLowerCase().startsWith('bearer ')) {
      // For UX, return a 200 with success false so frontend can treat as unauthenticated
      return fail(res, 401, 'UNAUTHORIZED', 'Not authenticated');
    }
    return ok(res, { user: makeMockUser() });
  } catch (e) {
    return fail(res, 500, 'SERVER_ERROR', 'Failed to fetch current user');
  }
});

// POST /api/auth/login
router.post('/login', (req, res) => {
  try {
    const { email } = req.body || {};
    const tokens = makeTokens();
    // In a real app set httpOnly cookie for access token; for now return tokens in body
    return ok(res, {
      user: makeMockUser({ email: email || 'user@betterbeing.com' }),
      tokens,
      requiresEmailVerification: false,
      message: 'Logged in',
    });
  } catch (e) {
    return fail(res, 500, 'SERVER_ERROR', 'Login failed');
  }
});

// POST /api/auth/register
router.post('/register', (req, res) => {
  try {
    const { email } = req.body || {};
    const tokens = makeTokens();
    return ok(res, {
      user: makeMockUser({ email: email || 'newuser@betterbeing.com' }),
      tokens,
      emailVerificationToken: uuidv4(),
      message: 'Registered',
    });
  } catch (e) {
    return fail(res, 500, 'SERVER_ERROR', 'Register failed');
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  try {
    // Accept refreshToken but simply respond OK
    return ok(res, { message: 'Logged out' });
  } catch (e) {
    return fail(res, 500, 'SERVER_ERROR', 'Logout failed');
  }
});

// POST /api/auth/refresh
router.post('/refresh', (req, res) => {
  try {
    const tokens = makeTokens();
    return ok(res, {
      user: makeMockUser(),
      tokens,
      message: 'Token refreshed',
    });
  } catch (e) {
    return fail(res, 500, 'SERVER_ERROR', 'Refresh failed');
  }
});

// POST /api/auth/verify-email
router.post('/verify-email', (req, res) => {
  try {
    return ok(res, { user: makeMockUser({ emailVerified: true }) });
  } catch (e) {
    return fail(res, 500, 'SERVER_ERROR', 'Verify email failed');
  }
});

// POST /api/auth/forgot-password
router.post('/forgot-password', (req, res) => {
  try {
    return ok(res, { message: 'Password reset email sent if the email exists.' });
  } catch (e) {
    return fail(res, 500, 'SERVER_ERROR', 'Forgot password failed');
  }
});

// POST /api/auth/reset-password
router.post('/reset-password', (req, res) => {
  try {
    return ok(res, { user: makeMockUser() });
  } catch (e) {
    return fail(res, 500, 'SERVER_ERROR', 'Reset password failed');
  }
});

export default router;
