"use strict";

import dotenv from "dotenv";
import express from "express";

const app = express();

dotenv.config();

const ENV = process.env;
const port = ENV.PORT || 8000;

app.get("/", (req, res) => {
  res.status(200).json({
    root: true,
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
