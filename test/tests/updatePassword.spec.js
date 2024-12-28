"use strict";

import { test, expect } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config();

const BASE_URL = `http://${process.env.HOST_DNS}:${process.env.PORT}`;
const password = "12345678Abc";
const passwordConfirm = "12345678Abc";

// TODO: test manually
test.describe.serial("updatePassword test cases", () => {
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

  test("updatePassword with empty body", async () => {
    const url = `${BASE_URL}/api/v1/users/updatePassword`;
    const headers = { "Content-Type": "application/json" };
    const body = JSON.stringify({});
    const method = "PATCH";

    const response = await fetch(url, { method, headers, body });
    expect(response.status).toBe(400);

    const data = await response.json();
    expect(data.status).toEqual("fail");
    expect(data.message).toEqual("Please provide valid password");
  });

  test("updatePassword without password", async () => {
    const url = `${BASE_URL}/api/v1/users/updatePassword`;
    const headers = { "Content-Type": "application/json" };
    const body = JSON.stringify({ passwordConfirm });
    const method = "PATCH";

    const response = await fetch(url, { method, headers, body });
    expect(response.status).toBe(400);

    const data = await response.json();
    expect(data.status).toEqual("fail");
    expect(data.message).toEqual("Please provide valid password");
  });

  test("updatePassword without passwordConfirm", async () => {
    const url = `${BASE_URL}/api/v1/users/updatePassword`;
    const headers = { "Content-Type": "application/json" };
    const body = JSON.stringify({ password });
    const method = "PATCH";

    const response = await fetch(url, { method, headers, body });
    expect(response.status).toBe(400);

    const data = await response.json();
    expect(data.status).toEqual("fail");
    expect(data.message).toEqual("Please provide valid password");
  });

  test("updatePassword with wrong password", async () => {
    const url = `${BASE_URL}/api/v1/users/updatePassword`;
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
