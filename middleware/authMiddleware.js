const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/userSchema');

// Middleware to authenticate JWT token
const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, config.secretKey, async (err, decodedToken) => {
      if (err) {
        return res.sendStatus(403);
      }

      const user = await User.findById(decodedToken.id);
      if (!user) {
        return res.sendStatus(403);
      }

      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

// Middleware to check if user is admin
const checkAdmin = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.sendStatus(403);
  }
  next();
};

module.exports = {
  authenticateUser,
  checkAdmin
};
