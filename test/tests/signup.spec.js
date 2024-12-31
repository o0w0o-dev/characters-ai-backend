"use strict";

import { test, expect } from "@playwright/test";
import {
  exampleTest,
  getTestResponse,
  sleep,
  verifyResult,
} from "./../../utils/testHelper.js";
import dotenv from "dotenv";

dotenv.config();

const BASE_URL = `http://${process.env.HOST_DNS}:${process.env.PORT}`;
const email = "signup@o0w0o.com";
const password = "12345678Abc";
const passwordConfirm = "12345678Abc";
const url = `${BASE_URL}/api/v1/users/signup`;

test.beforeEach(async () => {
  await sleep(5000);
});

test.describe.serial("signup test cases", () => {
  test.skip(false, "skip");
  exampleTest(test, expect, BASE_URL);

  test("signup", async () => {
    const response = await getTestResponse(url, "POST", {
      email,
      password,
      passwordConfirm,
    });
    await verifyResult(expect, response, 201, "success");
  });

  test("signup with empty body", async () => {
    const response = await getTestResponse(url, "POST");
    await verifyResult(
      expect,
      response,
      400,
      "fail",
      "Please provide email and password"
    );
  });

  test("signup without email", async () => {
    const response = await getTestResponse(url, "POST", {
      password,
      passwordConfirm,
    });
    await verifyResult(
      expect,
      response,
      400,
      "fail",
      "Please provide email and password"
    );
  });

  test("signup without password", async () => {
    const response = await getTestResponse(url, "POST", {
      email,
      passwordConfirm,
    });
    await verifyResult(
      expect,
      response,
      400,
      "fail",
      "Please provide email and password"
    );
  });

  test("signup with invalid email", async () => {
    const response = await getTestResponse(url, "POST", {
      email: "abc",
      password,
      passwordConfirm,
    });
    await verifyResult(
      expect,
      response,
      500, // TODO: 400
      "error",
      "User validation failed: email: Please provide a valid email"
    );
  });

  test("signup with invalid email2", async () => {
    const response = await getTestResponse(url, "POST", {
      email: "emailWithMoreThan60Characters1234567890123456789012@o0w0o.com",
      password,
      passwordConfirm,
    });
    await verifyResult(
      expect,
      response,
      500,
      "error",
      "User validation failed: email: The email must have less or equal then 60 characters"
    );
  });

  test("signup with invalid email3", async () => {
    const response = await getTestResponse(url, "POST", {
      email: "user@domain@o0w0o.com",
      password,
      passwordConfirm,
    });
    await verifyResult(
      expect,
      response,
      500, // TODO: 400
      "error",
      "User validation failed: email: Please provide a valid email"
    );
  });

  test("signup with invalid password", async () => {
    const response = await getTestResponse(url, "POST", {
      email: "a" + email,
      password: "123",
      passwordConfirm: "123",
    });
    await verifyResult(
      expect,
      response,
      500, // TODO: 400
      "error",
      "User validation failed: password: The password must have more or equal then 8 characters"
    );
  });

  test("signup with invalid password2", async () => {
    const response = await getTestResponse(url, "POST", {
      email: "b" + email,
      password: "12345678",
      passwordConfirm: "12345678",
    });
    await verifyResult(
      expect,
      response,
      500, // TODO: 400
      "error",
      "User validation failed: password: The password contain at least 1 character of each: a-z, A-Z, 0-9"
    );
  });

  test("signup with invalid passwordConfirm", async () => {
    const response = await getTestResponse(url, "POST", {
      email: "c" + email,
      password,
      passwordConfirm: passwordConfirm + "1",
    });
    await verifyResult(
      expect,
      response,
      500, // TODO: 400
      "error",
      "User validation failed: passwordConfirm: Passwords are not the same"
    );
  });

  test("signup with upperCase", async () => {
    const response = await getTestResponse(url, "POST", {
      email: email.toUpperCase(),
      password,
      passwordConfirm,
    });
    await verifyResult(
      expect,
      response,
      400,
      "fail",
      "The user already exists"
    );
  });

  test("signup with exist user", async () => {
    const response = await getTestResponse(url, "POST", {
      email: "existUser@o0w0o.com",
      password,
      passwordConfirm,
    });
    await verifyResult(expect, response, 201, "success");

    const response2 = await getTestResponse(url, "POST", {
      email: "existUser@o0w0o.com",
      password,
      passwordConfirm,
    });
    await verifyResult(
      expect,
      response2,
      400,
      "fail",
      "The user already exists"
    );
  });

  test("signup with injection code", async () => {
    const response = await getTestResponse(url, "POST", {
      email: "test123<h1>@o0w0o.com",
      password,
      passwordConfirm,
    });
    await verifyResult(
      expect,
      response,
      500, // TODO: 400
      "error",
      "User validation failed: email: Please provide a valid email"
    );
  });

  test("signup with injection code2", async () => {
    const response = await getTestResponse(url, "POST", {
      email: "d" + email,
      password: password + "<h1>",
      passwordConfirm: passwordConfirm + "<h1>",
    });
    await verifyResult(
      expect,
      response,
      500, // TODO: 400
      "error",
      "User validation failed: password: The password contain at least 1 character of each: a-z, A-Z, 0-9"
    );
  });

  test("signup with injection code3", async () => {
    const response = await getTestResponse(url, "POST", {
      email: "e" + email,
      password: password + "$",
      passwordConfirm: passwordConfirm + "$",
    });
    await verifyResult(
      expect,
      response,
      500, // TODO: 400
      "error",
      "User validation failed: password: The password contain at least 1 character of each: a-z, A-Z, 0-9"
    );
  });
});
