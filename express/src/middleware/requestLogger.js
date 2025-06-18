// middleware/requestLogger.js
import morgan from "morgan";
import logger from "../config/logger.js";

// Morgan token for better IP detection
morgan.token("remote-addr", (req) => req.ip || req.connection.remoteAddress);

const requestLogger = morgan(
  ":method :url :status :res[content-length] - :response-time ms :remote-addr",
  {
    stream: {
      write: (message) => logger.http(message.trim()),
    },
  }
);

export default requestLogger;
