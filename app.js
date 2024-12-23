"use strict";

import dotenv from "dotenv";
import express from "express";
import rateLimit from express-rate-limit
import morgan from "morgan";
import { router as characterRouter } from "./routes/characterRoutes.js";
import { router as userRouter } from "./routes/userRoutes.js";
import { globalErrorHandler } from "./controllers/errorController.js";

const app = express();
dotenv.config();

const limiter = rateLimit({
	max: process.env.RATE_LIMIT * 1,
	windowMs: 60 * 60 * 1000,
	message: "Too many requests from this IP."
})

app.use("*", limiter)

app.use(express.json());
app.use(morgan(":method :url :status - :response-time ms"));

app.use("/api/v1/characters", characterRouter);
app.use("/api/v1/users", userRouter);

app.get("/", (req, res) => {
  res.status(200).json({
    root: true,
  });
});

app.all("*", (req, res) => {
  res.status(404).json({
    status: "fail",
    message: `Cannot find ${req.originalUrl} on this server.`,
  });
});

app.use(globalErrorHandler);

export { app };
