"use strict";

import { test, expect } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config();

const BASE_URL = `http://${process.env.HOST_DNS}:${process.env.PORT}`;
const email = "test789@o0w0o.com";
const password = "12345678Abc";
const passwordConfirm = "12345678Abc";

test.describe.serial("forgotPassword test cases", () => {
  test("example test", async () => {
    const url = BASE_URL;
    const headers = { "Content-Type": "application/json" };

    const response = await fetch(url, {
      headers,
    });

    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data).toEqual({ root: true });
  });

  test("init", async () => {
    const url = `${BASE_URL}/api/v1/users/signup`;
    const headers = { "Content-Type": "application/json" };
    const body = JSON.stringify({ email, password, passwordConfirm });
    const method = "POST";

    const response = await fetch(url, { method, headers, body });
    expect(response.status).toBe(201);

    const data = await response.json();
    expect(data.status).toEqual("success");
  });

  test("forgotPassword", async () => {
    const url = `${BASE_URL}/api/v1/users/forgotPassword`;
    const headers = { "Content-Type": "application/json" };
    const body = JSON.stringify({ email });
    const method = "POST";

    const response = await fetch(url, { method, headers, body });
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.status).toEqual("success");
    expect(data.message).toEqual("Token sent to email");
  });

  test("forgotPassword with empty body", async () => {
    const url = `${BASE_URL}/api/v1/users/forgotPassword`;
    const headers = { "Content-Type": "application/json" };
    const body = JSON.stringify({});
    const method = "POST";

    const response = await fetch(url, { method, headers, body });
    expect(response.status).toBe(404);

    const data = await response.json();
    expect(data.status).toEqual("fail");
    expect(data.message).toEqual("There is no user with email address");
  });

  test("forgotPassword with invalid email", async () => {
    const url = `${BASE_URL}/api/v1/users/forgotPassword`;
    const headers = { "Content-Type": "application/json" };
    const body = JSON.stringify({ email: email.split("@")[0] });
    const method = "POST";

    const response = await fetch(url, { method, headers, body });
    expect(response.status).toBe(404);

    const data = await response.json();
    expect(data.status).toEqual("fail");
    expect(data.message).toEqual("There is no user with email address");
  });

  test("forgotPassword with upperCase", async () => {
    const url = `${BASE_URL}/api/v1/users/forgotPassword`;
    const headers = { "Content-Type": "application/json" };
    const body = JSON.stringify({ email: email.toUpperCase() });
    const method = "POST";

    const response = await fetch(url, { method, headers, body });
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.status).toEqual("success");
    expect(data.message).toEqual("Token sent to email");
  });

  test("forgotPassword with non exist user", async () => {
    const url = `${BASE_URL}/api/v1/users/forgotPassword`;
    const headers = { "Content-Type": "application/json" };
    const body = JSON.stringify({ email: "nonExistUser@o0w0o.com" });
    const method = "POST";

    const response = await fetch(url, { method, headers, body });
    expect(response.status).toBe(404);

    const data = await response.json();
    expect(data.status).toEqual("fail");
    expect(data.message).toEqual("There is no user with email address");
  });
});
