import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import usersRouter from "./routes/userRoutes.js";
import sequelize from "./config/database.js";
import logger from "./config/logger.js";

dotenv.config();

const app = express();
app.use(express.json());

// HTTP request logging with morgan via Winston
app.use(
  morgan("combined", {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  })
);

// Routes
app.use("/api/users", usersRouter);

// Health check route
app.get("/", (req, res) => {
  res.send("Express server is up and running");
});

// Database connection check with proper logging
(async () => {
  try {
    await sequelize.authenticate();
    logger.info("Connection to SQL (MariaDB) has been established successfully.");
  } catch (error) {
    logger.error("Unable to connect to the database: %o", error);
  }
})();

export default app;
