"use strict";

import { test, expect } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config();

const BASE_URL = `http://${process.env.HOST_DNS}:${process.env.PORT}`;
const email = "test456@o0w0o.com";
const password = "12345678Abc";
const passwordConfirm = "12345678Abc";

test.describe.serial("login test cases", () => {
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

  test("login", async () => {
    const url = `${BASE_URL}/api/v1/users/login`;
    const headers = { "Content-Type": "application/json" };
    const body = JSON.stringify({ email, password });
    const method = "POST";

    const response = await fetch(url, { method, headers, body });
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.status).toEqual("success");
  });

  test("login with empty body", async () => {
    const url = `${BASE_URL}/api/v1/users/login`;
    const headers = { "Content-Type": "application/json" };
    const body = JSON.stringify({});
    const method = "POST";

    const response = await fetch(url, { method, headers, body });
    expect(response.status).toBe(400);

    const data = await response.json();
    expect(data.status).toEqual("fail");
  });

  test("login without email", async () => {
    const url = `${BASE_URL}/api/v1/users/login`;
    const headers = { "Content-Type": "application/json" };
    const body = JSON.stringify({ password });
    const method = "POST";

    const response = await fetch(url, { method, headers, body });
    expect(response.status).toBe(400);

    const data = await response.json();
    expect(data.status).toEqual("fail");
    expect(data.message).toEqual("Please provide email and password");
  });

  test("login without password", async () => {
    const url = `${BASE_URL}/api/v1/users/login`;
    const headers = { "Content-Type": "application/json" };
    const body = JSON.stringify({ email });
    const method = "POST";

    const response = await fetch(url, { method, headers, body });
    expect(response.status).toBe(400);

    const data = await response.json();
    expect(data.status).toEqual("fail");
    expect(data.message).toEqual("Please provide email and password");
  });

  test("login with invalid email", async () => {
    const url = `${BASE_URL}/api/v1/users/login`;
    const headers = { "Content-Type": "application/json" };
    const body = JSON.stringify({ email: email.split("@")[0], password });
    const method = "POST";

    const response = await fetch(url, { method, headers, body });
    expect(response.status).toBe(401);

    const data = await response.json();
    expect(data.status).toEqual("fail");
    expect(data.message).toEqual("Incorrect email or password");
  });

  test("login with invalid password", async () => {
    const url = `${BASE_URL}/api/v1/users/login`;
    const headers = { "Content-Type": "application/json" };
    const body = JSON.stringify({ email, password: "wrongPassword" });
    const method = "POST";

    const response = await fetch(url, { method, headers, body });
    expect(response.status).toBe(401);

    const data = await response.json();
    expect(data.status).toEqual("fail");
    expect(data.message).toEqual("Incorrect email or password");
  });

  test("login with upperCase", async () => {
    const url = `${BASE_URL}/api/v1/users/login`;
    const headers = { "Content-Type": "application/json" };
    const body = JSON.stringify({ email: email.toUpperCase(), password });
    const method = "POST";

    const response = await fetch(url, { method, headers, body });
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.status).toEqual("success");
  });

  test("login with non exist user", async () => {
    const url = `${BASE_URL}/api/v1/users/login`;
    const headers = { "Content-Type": "application/json" };
    const body = JSON.stringify({ email: "nonExistUser@o0w0o.com", password });
    const method = "POST";

    const response = await fetch(url, { method, headers, body });
    expect(response.status).toBe(401);

    const data = await response.json();
    expect(data.status).toEqual("fail");
    expect(data.message).toEqual("Incorrect email or password");
  });
});
