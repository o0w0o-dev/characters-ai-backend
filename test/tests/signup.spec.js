"use strict";

import { test, expect } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config();

const BASE_URL = `http://${process.env.HOST_DNS}:${process.env.PORT}`;
const email = "test123@o0w0o.com";
const password = "12345678Abc";
const passwordConfirm = "12345678Abc";

test.describe.serial("signup test cases", () => {
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

  test("signup", async () => {
    const url = `${BASE_URL}/api/v1/users/signup`;
    const headers = { "Content-Type": "application/json" };
    const body = JSON.stringify({ email, password, passwordConfirm });
    const method = "POST";

    const response = await fetch(url, { method, headers, body });
    expect(response.status).toBe(201);

    const data = await response.json();
    expect(data.status).toEqual("success");
  });

  test("signup with empty body", async () => {
    const url = `${BASE_URL}/api/v1/users/signup`;
    const headers = { "Content-Type": "application/json" };
    const body = JSON.stringify({});
    const method = "POST";

    const response = await fetch(url, { method, headers, body });
    expect(response.status).toBe(400);

    const data = await response.json();
    expect(data.status).toEqual("fail");
    expect(data.message).toEqual("Please provide email and password");
  });

  test("signup without email", async () => {
    const url = `${BASE_URL}/api/v1/users/signup`;
    const headers = { "Content-Type": "application/json" };
    const body = JSON.stringify({ password, passwordConfirm });
    const method = "POST";

    const response = await fetch(url, { method, headers, body });
    expect(response.status).toBe(400);

    const data = await response.json();
    expect(data.status).toEqual("fail");
    expect(data.message).toEqual("Please provide email and password");
  });

  test("signup without password", async () => {
    const url = `${BASE_URL}/api/v1/users/signup`;
    const headers = { "Content-Type": "application/json" };
    const body = JSON.stringify({ email, passwordConfirm });
    const method = "POST";

    const response = await fetch(url, { method, headers, body });
    expect(response.status).toBe(400);

    const data = await response.json();
    expect(data.status).toEqual("fail");
    expect(data.message).toEqual("Please provide email and password");
  });

  test("signup with invalid email", async () => {
    const url = `${BASE_URL}/api/v1/users/signup`;
    const headers = { "Content-Type": "application/json" };
    const body = JSON.stringify({ email: "abc", password, passwordConfirm });
    const method = "POST";

    const response = await fetch(url, { method, headers, body });
    expect(response.status).toBe(500); // TODO: 400

    const data = await response.json();
    expect(data.status).toEqual("error");
    expect(data.message).toEqual(
      "User validation failed: email: Please provide a valid email"
    );
  });

  test("signup with invalid email2", async () => {
    const url = `${BASE_URL}/api/v1/users/signup`;
    const headers = { "Content-Type": "application/json" };
    const body = JSON.stringify({
      email: "emailWithMoreThan60Characters1234567890123456789012@o0w0o.com",
      password,
      passwordConfirm,
    });
    const method = "POST";

    const response = await fetch(url, { method, headers, body });
    expect(response.status).toBe(500); // TODO: 400

    const data = await response.json();
    expect(data.status).toEqual("error");
    expect(data.message).toEqual(
      "User validation failed: email: The email must have less or equal then 60 characters"
    );
  });

  test("signup with invalid email3", async () => {
    const url = `${BASE_URL}/api/v1/users/signup`;
    const headers = { "Content-Type": "application/json" };
    const body = JSON.stringify({
      email: "user@domain@o0w0o.com",
      password,
      passwordConfirm,
    });
    const method = "POST";

    const response = await fetch(url, { method, headers, body });
    expect(response.status).toBe(500); // TODO: 400

    const data = await response.json();
    expect(data.status).toEqual("error");
    expect(data.message).toEqual(
      "User validation failed: email: Please provide a valid email"
    );
  });

  test("signup with invalid password", async () => {
    const url = `${BASE_URL}/api/v1/users/signup`;
    const headers = { "Content-Type": "application/json" };
    const body = JSON.stringify({
      email: "a" + email,
      password: "123",
      passwordConfirm: "123",
    });
    const method = "POST";

    const response = await fetch(url, { method, headers, body });
    expect(response.status).toBe(500); // TODO: 400

    const data = await response.json();
    expect(data.status).toEqual("error");
    expect(data.message).toEqual(
      "User validation failed: password: The password must have more or equal then 8 characters"
    );
  });

  test("signup with invalid password2", async () => {
    const url = `${BASE_URL}/api/v1/users/signup`;
    const headers = { "Content-Type": "application/json" };
    const body = JSON.stringify({
      email: "b" + email,
      password: "12345678",
      passwordConfirm: "12345678",
    });
    const method = "POST";

    const response = await fetch(url, { method, headers, body });
    expect(response.status).toBe(500); // TODO: 400

    const data = await response.json();
    expect(data.status).toEqual("error");
    expect(data.message).toEqual(
      "User validation failed: password: The password contain at least 1 character of each: a-z, A-Z, 0-9"
    );
  });

  test("signup with invalid passwordConfirm", async () => {
    const url = `${BASE_URL}/api/v1/users/signup`;
    const headers = { "Content-Type": "application/json" };
    const body = JSON.stringify({
      email: "c" + email,
      password,
      passwordConfirm: passwordConfirm + "1",
    });
    const method = "POST";

    const response = await fetch(url, { method, headers, body });
    expect(response.status).toBe(500); // TODO: 400

    const data = await response.json();
    expect(data.status).toEqual("error");
    expect(data.message).toEqual(
      "User validation failed: passwordConfirm: Passwords are not the same"
    );
  });

  test("signup with upperCase", async () => {
    const url = `${BASE_URL}/api/v1/users/signup`;
    const headers = { "Content-Type": "application/json" };
    const body = JSON.stringify({
      email: email.toUpperCase(),
      password,
      passwordConfirm,
    });
    const method = "POST";

    const response = await fetch(url, { method, headers, body });
    expect(response.status).toBe(400);

    const data = await response.json();
    expect(data.status).toEqual("fail");
    expect(data.message).toEqual("The user already exists");
  });

  test("signup with exist user", async () => {
    const url = `${BASE_URL}/api/v1/users/signup`;
    const headers = { "Content-Type": "application/json" };
    const body = JSON.stringify({
      email: "existUser@o0w0o.com",
      password,
      passwordConfirm,
    });
    const method = "POST";

    const response = await fetch(url, { method, headers, body });
    expect(response.status).toBe(201);

    const response2 = await fetch(url, { method, headers, body });
    expect(response2.status).toBe(400);

    const data = await response2.json();
    expect(data.status).toEqual("fail");
    expect(data.message).toEqual("The user already exists");
  });

  test("signup with injection code", async () => {
    const url = `${BASE_URL}/api/v1/users/signup`;
    const headers = { "Content-Type": "application/json" };
    const body = JSON.stringify({
      email: "test123<h1>@o0w0o.com",
      password,
      passwordConfirm,
    });
    const method = "POST";

    const response = await fetch(url, { method, headers, body });
    expect(response.status).toBe(500); // TODO: 400

    const data = await response.json();
    expect(data.status).toEqual("error");
    expect(data.message).toEqual(
      "User validation failed: email: Please provide a valid email"
    );
  });

  test("signup with injection code2", async () => {
    const url = `${BASE_URL}/api/v1/users/signup`;
    const headers = { "Content-Type": "application/json" };
    const body = JSON.stringify({
      email: "d" + email,
      password: password + "<h1>",
      passwordConfirm: passwordConfirm + "<h1>",
    });
    const method = "POST";

    const response = await fetch(url, { method, headers, body });
    expect(response.status).toBe(500); // TODO: 400

    const data = await response.json();
    expect(data.status).toEqual("error");
    expect(data.message).toEqual(
      "User validation failed: password: The password contain at least 1 character of each: a-z, A-Z, 0-9"
    );
  });

  test("signup with injection code3", async () => {
    const url = `${BASE_URL}/api/v1/users/signup`;
    const headers = { "Content-Type": "application/json" };
    const body = JSON.stringify({
      email: "e" + email,
      password: password + "$",
      passwordConfirm: passwordConfirm + "$",
    });
    const method = "POST";

    const response = await fetch(url, { method, headers, body });
    expect(response.status).toBe(500); // TODO: 400

    const data = await response.json();
    expect(data.status).toEqual("error");
    expect(data.message).toEqual(
      "User validation failed: password: The password contain at least 1 character of each: a-z, A-Z, 0-9"
    );
  });
});
