"use strict";

import { test, expect } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT;

// Wait for server started
test.beforeEach(async () => {
  await new Promise((resolve) => setTimeout(resolve, 10000));
});

const headers = { accept: "application/json" };

test("example test", async () => {
  const response = await fetch(`http://localhost:${PORT}`, {
    headers,
  });
  expect(response.status).toBe(200);

  const data = await response.json();
  expect(data).toEqual({ root: true });
});
