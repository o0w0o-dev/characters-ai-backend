"use strict";

import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import hpp from "hpp";
import mongoSanitize from "express-mongo-sanitize";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import xss from "xss-clean";
import { globalErrorHandler } from "./controllers/errorController.js";
import { router as characterRouter } from "./routes/characterRoutes.js";
import { router as userRouter } from "./routes/userRoutes.js";
import swaggerDocs from "./utils/swagger.js";

dotenv.config();

const PORT = process.env.PORT || 8000;
const RATE_LIMIT = process.env.RATE_LIMIT * 1 || 100;

const app = express();

app.use(helmet());

const limiter = rateLimit({
  max: RATE_LIMIT,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP.",
});

app.use("*", limiter);
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

app.use(express.json({ limit: "10kb" }));
app.use(morgan(":method :url :status - :response-time ms"));

swaggerDocs(app, PORT);
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
