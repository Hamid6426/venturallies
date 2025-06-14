import { createLogger, format, transports } from "winston";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// Resolve project root directory regardless of where logger.js is located
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logDir = path.resolve(__dirname, "..", "..", "logs"); // go up two level to project root

// Ensure logs directory exists
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const logger = createLogger({
  level: "info", // minimum level to log
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.errors({ stack: true }), // capture stack trace in errors
    format.splat(), // for printf-style string interpolation
    format.json() // output logs as JSON by default (great for files)
  ),
  transports: [
    // Console transport with colored and pretty print
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.printf(({ timestamp, level, message, stack }) => {
          return `${timestamp} [${level}]: ${stack || message}`;
        })
      ),
    }),

    // File transport for errors only
    new transports.File({
      filename: path.resolve("logs", "error.log"),
      level: "error",
      format: format.combine(
        format.timestamp(),
        format.errors({ stack: true }),
        format.json()
      ),
      handleExceptions: true,
      maxsize: 5 * 1024 * 1024, // 5MB
      maxFiles: 5,
      tailable: true,
    }),

    // File transport for all logs (info and above)
    new transports.File({
      filename: path.resolve("logs", "combined.log"),
      format: format.combine(format.timestamp(), format.json()),
      maxsize: 10485760, // 10MB
      maxFiles: 5,
      tailable: true,
    }),
  ],
  exitOnError: false, // do not exit on handled exceptions
});

export default logger;
