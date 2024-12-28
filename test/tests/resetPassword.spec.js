"use strict";

import { test, expect } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config();

const BASE_URL = `http://${process.env.HOST_DNS}:${process.env.PORT}`;
const email = "test1011@o0w0o.com";
const password = "12345678Abc";
const passwordConfirm = "12345678Abc";

test.describe("resetPassword test cases", () => {
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

  test("resetPassword without token", async () => {
    const token = "";
    const url = `${BASE_URL}/api/v1/users/resetPassword/${token}`;
    const headers = { "Content-Type": "application/json" };
    const body = JSON.stringify({ password, passwordConfirm });
    const method = "PATCH";

    const response = await fetch(url, { method, headers, body });
    expect(response.status).toBe(404);

    const data = await response.json();
    expect(data.status).toEqual("fail");
    expect(data.message).toEqual(
      "Cannot find /api/v1/users/resetPassword/ on this server."
    );
  });

  test("resetPassword with empty body", async () => {
    const token = "tempToken";
    const url = `${BASE_URL}/api/v1/users/resetPassword/${token}`;
    const headers = { "Content-Type": "application/json" };
    const body = JSON.stringify({});
    const method = "PATCH";

    const response = await fetch(url, { method, headers, body });
    expect(response.status).toBe(400);

    const data = await response.json();
    expect(data.status).toEqual("fail");
    expect(data.message).toEqual("Please provide valid password");
  });

  test("resetPassword without password", async () => {
    const token = "tempToken";
    const url = `${BASE_URL}/api/v1/users/resetPassword/${token}`;
    const headers = { "Content-Type": "application/json" };
    const body = JSON.stringify({ passwordConfirm });
    const method = "PATCH";

    const response = await fetch(url, { method, headers, body });
    expect(response.status).toBe(400);

    const data = await response.json();
    expect(data.status).toEqual("fail");
    expect(data.message).toEqual("Please provide valid password");
  });

  test("resetPassword without passwordConfirm", async () => {
    const token = "tempToken";
    const url = `${BASE_URL}/api/v1/users/resetPassword/${token}`;
    const headers = { "Content-Type": "application/json" };
    const body = JSON.stringify({ password });
    const method = "PATCH";

    const response = await fetch(url, { method, headers, body });
    expect(response.status).toBe(400);

    const data = await response.json();
    expect(data.status).toEqual("fail");
    expect(data.message).toEqual("Please provide valid password");
  });

  test("resetPassword with wrong password", async () => {
    const token = "tempToken";
    const url = `${BASE_URL}/api/v1/users/resetPassword/${token}`;
    const headers = { "Content-Type": "application/json" };
    const body = JSON.stringify({ password: password + "1", passwordConfirm });
    const method = "PATCH";

    const response = await fetch(url, { method, headers, body });
    expect(response.status).toBe(400);

    const data = await response.json();
    expect(data.status).toEqual("fail");
    expect(data.message).toEqual("Please provide valid password");
  });
});
