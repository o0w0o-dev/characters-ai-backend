"use strict";

import { test, expect } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config();

const BASE_URL = `http://${process.env.HOST_DNS}:${process.env.PORT}`;

// Wait for server started
test.beforeEach(async () => {
  await new Promise((resolve) => setTimeout(resolve, 10000));
});

test("example test", async () => {
  const url = BASE_URL;
  const headers = { accept: "application/json" };

  const response = await fetch(url, {
    headers,
  });

  expect(response.status).toBe(200);

  const data = await response.json();
  expect(data).toEqual({ root: true });
});

// User /api/v1/users/signup
test("signup", async () => {
  const url = `${BASE_URL}/api/v1/users/signup`;
  const headers = { accept: "application/json" };
  const body = {};
  const method = "POST";

  const response = await fetch(url, { method, headers, body });
  expect(response.status).toBe(200);

  const data = await response.json();
  expect(data).toEqual({ root: true });
});
