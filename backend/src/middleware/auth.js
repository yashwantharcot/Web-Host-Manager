// No-op authentication middleware
// This injects a default user into the request so routes that depend on req.user
// keep working without requiring JWT tokens. To re-enable authentication, restore
// JWT behavior.

const authenticate = (req, res, next) => {
  // default user — can be customized via env for testing
  const defaultUser = {
    id: process.env.DEFAULT_USER_ID || null,
    username: process.env.DEFAULT_USER || 'anonymous',
    role: process.env.DEFAULT_USER_ROLE || 'user'
  };
  req.user = defaultUser;
  next();
};

// Export both names so existing imports (`auth`) keep working
module.exports = { authenticate, auth: authenticate };
