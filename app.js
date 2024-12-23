"use strict";

import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import { router as characterRouter } from "./routes/characterRoutes.js";

const app = express();
dotenv.config();

app.use(express.json());
app.use(morgan(":method :url :status - :response-time ms"));

app.use("/api/v1/characters", characterRouter);

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

export { app };
