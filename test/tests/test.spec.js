"use strict";

import { test, expect } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config();

const BASE_URL = `http://${process.env.HOST_DNS}:${process.env.PORT}`;
const email = "user@gmail.com";
const password = "12345678";
const passwordConfirm = "12345678";

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
  const body = { email, password, passwordConfirm };
  const method = "POST";

  const response = await fetch(url, { method, headers, body });
  expect(response.status).toBe(200);

  const data = await response.json();
  console.log({ signup: data });
});

// User /api/v1/users/signup
test("signup without email", async () => {
  const url = `${BASE_URL}/api/v1/users/signup`;
  const headers = { accept: "application/json" };
  const body = { password, passwordConfirm };
  const method = "POST";

  const response = await fetch(url, { method, headers, body });
  expect(response.status).toBe(400);

  const data = await response.json();
  expect(data.message).toEqual("Please provide email and password");
});

// User /api/v1/users/signup
test("signup without password", async () => {
  const url = `${BASE_URL}/api/v1/users/signup`;
  const headers = { accept: "application/json" };
  const body = { email, passwordConfirm };
  const method = "POST";

  const response = await fetch(url, { method, headers, body });
  expect(response.status).toBe(400);

  const data = await response.json();
  expect(data.message).toEqual("Please provide email and password");
});

// User /api/v1/users/signup
test("signup with invalid email", async () => {
  const url = `${BASE_URL}/api/v1/users/signup`;
  const headers = { accept: "application/json" };
  const body = { email: "abc", password, passwordConfirm };
  const method = "POST";

  const response = await fetch(url, { method, headers, body });
  expect(response.status).toBe(400);

  const data = await response.json();
  expect(data.message).toEqual("Please provide email and password");
});

// User /api/v1/users/signup
test("signup with invalid password", async () => {
  const url = `${BASE_URL}/api/v1/users/signup`;
  const headers = { accept: "application/json" };
  const body = { email, password: "123", passwordConfirm: "123" };
  const method = "POST";

  const response = await fetch(url, { method, headers, body });
  expect(response.status).toBe(400);

  const data = await response.json();
  expect(data.message).toEqual("Please provide email and password");
});

// User /api/v1/users/signup
test("signup with invalid passwordConfirm", async () => {
  const url = `${BASE_URL}/api/v1/users/signup`;
  const headers = { accept: "application/json" };
  const body = { email, password, passwordConfirm: passwordConfirm + " " };
  const method = "POST";

  const response = await fetch(url, { method, headers, body });
  expect(response.status).toBe(400);

  const data = await response.json();
  expect(data.message).toEqual("Please provide email and password");
});
