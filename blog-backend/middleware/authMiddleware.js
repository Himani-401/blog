const jwt = require('jsonwebtoken');

// Middleware to protect routes requiring authentication
const authenticateToken = (req, res, next) => {
  // Get the token from the Authorization header
  const token = req.header('Authorization')?.split(' ')[1]; // Format: 'Bearer <token>'

  if (!token) {
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach the user data to the request
    next(); // Move to the next middleware or route handler
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authenticateToken;
