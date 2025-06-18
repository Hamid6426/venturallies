const checkUserStatus = (req, res, next) => {
  if (req.user.status !== "active") {
    return res.status(403).json({ message: "Account is inactive" });
  }
  next();
};

export default checkUserStatus;

// will need to update token and isAutheticated file with a new line each

