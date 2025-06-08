import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/user.routes";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", ( res: Response) => {
  res.send("Hello, TypeScript Express!");
});

app.use("/api", userRoutes);

export default app;