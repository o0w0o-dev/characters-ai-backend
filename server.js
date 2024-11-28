"use strict";

import dotenv from "dotenv";
import { app } from "./app.js";

dotenv.config();

const ENV = process.env;
const port = ENV.PORT || 8000;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
