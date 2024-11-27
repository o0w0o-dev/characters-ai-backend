const dotenv = require("dotenv");
const express = require("express");
const app = express();

require("dotenv").config();

const ENV = process.env;
const port = ENV.PORT || 8000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
