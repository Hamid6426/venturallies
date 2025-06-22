// middleware/errorHandler.js
import logger from "../config/logger.js";

const errorHandler = (err, req, res, next) => {
  logger.error(err.stack || err.message);

  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode).json({
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
};

export default errorHandler;
