const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.JWT_SECRET;

const verifyToken = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(403).json({ message: "Access denied" });

  try {
    const verified = jwt.verify(token.replace("Bearer ", ""), SECRET_KEY);
    req.user = verified;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

const checkRole = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res
      .status(403)
      .json({ message: "Forbidden: You don't have access" });
  }
  next();
};

module.exports = { verifyToken, checkRole };
