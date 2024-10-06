const jwt = require('jsonwebtoken');

function authenticate(req, res, next) {
  const token = req.header('Authorization').replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;  // Attach user ID to the request object
    next();  // Move to the next middleware/route handler
  } catch (err) {
    res.status(401).json({ error: 'Token is not valid' });
  }
}

module.exports = authenticate;
