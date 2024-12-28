"use strict";

import { test, expect } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config();

const BASE_URL = `http://${process.env.HOST_DNS}:${process.env.PORT}`;
const email = "test123@o0w0o.com";
const password = "12345678Abc";
const passwordConfirm = "12345678Abc";

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

test("signup", async () => {
  const url = `${BASE_URL}/api/v1/users/signup`;
  const headers = { accept: "application/json" };
  const body = { email, password, passwordConfirm };
  const method = "POST";

  const response = await fetch(url, { method, headers, body });
  expect(response.status).toBe(201);

  const data = await response.json();
  expect(data.status).toEqual("success");
});

test("signup with empty body", async () => {
  const url = `${BASE_URL}/api/v1/users/signup`;
  const headers = { accept: "application/json" };
  const body = {};
  const method = "POST";

  const response = await fetch(url, { method, headers, body });
  expect(response.status).toBe(400);

  const data = await response.json();
  expect(data.status).toEqual("fail");
  expect(data.message).toEqual("Please provide email and password");
});

test("signup without email", async () => {
  const url = `${BASE_URL}/api/v1/users/signup`;
  const headers = { accept: "application/json" };
  const body = { password, passwordConfirm };
  const method = "POST";

  const response = await fetch(url, { method, headers, body });
  expect(response.status).toBe(400);

  const data = await response.json();
  expect(data.status).toEqual("fail");
  expect(data.message).toEqual("Please provide email and password");
});

test("signup without password", async () => {
  const url = `${BASE_URL}/api/v1/users/signup`;
  const headers = { accept: "application/json" };
  const body = { email, passwordConfirm };
  const method = "POST";

  const response = await fetch(url, { method, headers, body });
  expect(response.status).toBe(400);

  const data = await response.json();
  expect(data.status).toEqual("fail");
  expect(data.message).toEqual("Please provide email and password");
});

test("signup with invalid email", async () => {
  const url = `${BASE_URL}/api/v1/users/signup`;
  const headers = { accept: "application/json" };
  const body = { email: "abc", password, passwordConfirm };
  const method = "POST";

  const response = await fetch(url, { method, headers, body });
  expect(response.status).toBe(400);

  const data = await response.json();
  expect(data.status).toEqual("fail");
  expect(data.message).toEqual("Please provide email and password");
});

test("signup with invalid email2", async () => {
  const url = `${BASE_URL}/api/v1/users/signup`;
  const headers = { accept: "application/json" };
  const body = {
    email: "emailWithMoreThan60Characters1234567890123456789012@o0w0o.com",
    password,
    passwordConfirm,
  };
  const method = "POST";

  const response = await fetch(url, { method, headers, body });
  expect(response.status).toBe(400);

  const data = await response.json();
  expect(data.status).toEqual("fail");
  expect(data.message).toEqual("Please provide email and password");
});

test("signup with invalid email3", async () => {
  const url = `${BASE_URL}/api/v1/users/signup`;
  const headers = { accept: "application/json" };
  const body = {
    email: "user@domain@o0w0o.com",
    password,
    passwordConfirm,
  };
  const method = "POST";

  const response = await fetch(url, { method, headers, body });
  expect(response.status).toBe(400);

  const data = await response.json();
  expect(data.status).toEqual("fail");
  expect(data.message).toEqual("Please provide email and password");
});

test("signup with invalid password", async () => {
  const url = `${BASE_URL}/api/v1/users/signup`;
  const headers = { accept: "application/json" };
  const body = { email, password: "123", passwordConfirm: "123" };
  const method = "POST";

  const response = await fetch(url, { method, headers, body });
  expect(response.status).toBe(400);

  const data = await response.json();
  expect(data.status).toEqual("fail");
  expect(data.message).toEqual("Please provide email and password");
});

test("signup with invalid password2", async () => {
  const url = `${BASE_URL}/api/v1/users/signup`;
  const headers = { accept: "application/json" };
  const body = { email, password: "12345678", passwordConfirm: "12345678" };
  const method = "POST";

  const response = await fetch(url, { method, headers, body });
  expect(response.status).toBe(400);

  const data = await response.json();
  expect(data.status).toEqual("fail");
  expect(data.message).toEqual("Please provide email and password");
});

test("signup with invalid passwordConfirm", async () => {
  const url = `${BASE_URL}/api/v1/users/signup`;
  const headers = { accept: "application/json" };
  const body = { email, password, passwordConfirm: passwordConfirm + " " };
  const method = "POST";

  const response = await fetch(url, { method, headers, body });
  expect(response.status).toBe(400);

  const data = await response.json();
  expect(data.status).toEqual("fail");
  expect(data.message).toEqual("Please provide email and password");
});

test("signup with exist user", async () => {
  const url = `${BASE_URL}/api/v1/users/signup`;
  const headers = { accept: "application/json" };
  const body = { email: "existUser@o0w0o.com", password, passwordConfirm };
  const method = "POST";

  const response = await fetch(url, { method, headers, body });
  expect(response.status).toBe(201);

  const response2 = await fetch(url, { method, headers, body });
  expect(response.status).toBe(400);

  const data = await response2.json();
  expect(data.status).toEqual("fail");
  expect(data.message).toEqual("The user already exists.");
});

test("signup with injection code", async () => {
  const url = `${BASE_URL}/api/v1/users/signup`;
  const headers = { accept: "application/json" };
  const body = { email: "test123$@o0w0o.com", password, passwordConfirm };
  const method = "POST";

  const response = await fetch(url, { method, headers, body });
  expect(response.status).toBe(400);

  const data = await response.json();
  expect(data.status).toEqual("fail");
  expect(data.message).toEqual("Please provide email and password");
});

test("signup with injection code2", async () => {
  const url = `${BASE_URL}/api/v1/users/signup`;
  const headers = { accept: "application/json" };
  const body = { email: "test123<h1>@o0w0o.com", password, passwordConfirm };
  const method = "POST";

  const response = await fetch(url, { method, headers, body });
  expect(response.status).toBe(400);

  const data = await response.json();
  expect(data.status).toEqual("fail");
  expect(data.message).toEqual("Please provide email and password");
});

test("signup with injection code3", async () => {
  const url = `${BASE_URL}/api/v1/users/signup`;
  const headers = { accept: "application/json" };
  const body = {
    email,
    password: password + "$",
    passwordConfirm: passwordConfirm + "$",
  };
  const method = "POST";

  const response = await fetch(url, { method, headers, body });
  expect(response.status).toBe(400);

  const data = await response.json();
  expect(data.status).toEqual("fail");
  expect(data.message).toEqual("Please provide email and password");
});

test("signup with injection code4", async () => {
  const url = `${BASE_URL}/api/v1/users/signup`;
  const headers = { accept: "application/json" };
  const body = {
    email,
    password: password + "<h1>",
    passwordConfirm: passwordConfirm + "<h1>",
  };
  const method = "POST";

  const response = await fetch(url, { method, headers, body });
  expect(response.status).toBe(400);

  const data = await response.json();
  expect(data.status).toEqual("fail");
  expect(data.message).toEqual("Please provide email and password");
});
