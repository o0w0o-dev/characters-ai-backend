"use strict";

import dotenv from "dotenv";
import mongoose from "mongoose";
import { app } from "./app.js";

dotenv.config();

const ENV = process.env;
const port = ENV.PORT || 8000;
const DB_URI = ENV.DB_URI;

if (DB_URI === undefined) console.error("DB_URI is undefined");

mongoose
  .connect(DB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
