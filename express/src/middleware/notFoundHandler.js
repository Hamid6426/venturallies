// middleware/notFoundHandler.js

const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    message: `Route ${req.originalUrl} not found`,
  });
};

export default notFoundHandler;
