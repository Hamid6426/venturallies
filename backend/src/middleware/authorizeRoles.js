// middleware/authorizeRoles.js

const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user?.role;

    if (!userRole) {
      return res.status(403).json({ message: "User role not found in request" });
    }

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ message: "You do not have permission to access this resource" });
    }

    next();
  };
};

export default authorizeRoles;
