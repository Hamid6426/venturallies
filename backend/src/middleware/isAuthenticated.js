// middleware/isAuthenticated.js

import jwt from "jsonwebtoken";

const isAuthenticated = (req, res, next) => {
  const token =
    req.cookies?.authToken || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: decoded.id,
      role: decoded.role,
    };
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

export default isAuthenticated;
