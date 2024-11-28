"use strict";

import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import { router as characterRouter } from "./routes/characterRoutes.js";

const app = express();
dotenv.config();

app.use(express.json());
app.use(morgan(":method :url :status - :response-time ms"));

const ENV = process.env;
const port = ENV.PORT || 8000;

app.use("/api/v1/characters", characterRouter);

app.get("/", (req, res) => {
  res.status(200).json({
    root: true,
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
