"use strict";

import { test, expect } from "@playwright/test";
import {
  exampleTest,
  getTestResponse,
  init,
  verifyResult,
} from "./../../utils/testHelper.js";
import dotenv from "dotenv";

dotenv.config();

const BASE_URL = `http://${process.env.HOST_DNS}:${process.env.PORT}`;
const email = "login@o0w0o.com";
const password = "12345678Abc";
const passwordConfirm = "12345678Abc";
const url = `${BASE_URL}/api/v1/users/login`;

test.beforeAll(async () => {
  await init(email, password, passwordConfirm);
});

test.describe.serial("login test cases", () => {
  exampleTest(test, expect, BASE_URL);

  test("login", async () => {
    const response = await getTestResponse(url, "POST", { email, password });
    await verifyResult(expect, response, 200, "success");
  });

  test("login with empty body", async () => {
    const response = await getTestResponse(url, "POST", {});
    await verifyResult(
      expect,
      response,
      400,
      "fail",
      "Please provide email and password"
    );
  });

  test("login without email", async () => {
    const response = await getTestResponse(url, "POST", { password });
    await verifyResult(
      expect,
      response,
      400,
      "fail",
      "Please provide email and password"
    );
  });

  test("login without password", async () => {
    const response = await getTestResponse(url, "POST", { email });
    await verifyResult(
      expect,
      response,
      400,
      "fail",
      "Please provide email and password"
    );
  });

  test("login with invalid email", async () => {
    const response = await getTestResponse(url, "POST", {
      email: email.split("@")[0],
      password,
    });
    await verifyResult(
      expect,
      response,
      401,
      "fail",
      "Incorrect email or password"
    );
  });

  test("login with invalid password", async () => {
    const response = await getTestResponse(url, "POST", {
      email,
      password: "wrongPassword",
    });
    await verifyResult(
      expect,
      response,
      401,
      "fail",
      "Incorrect email or password"
    );
  });

  test("login with upperCase", async () => {
    const response = await getTestResponse(url, "POST", {
      email: email.toUpperCase(),
      password,
    });
    await verifyResult(expect, response, 200, "success");
  });

  test("login with non exist user", async () => {
    const response = await getTestResponse(url, "POST", {
      email: "nonExistUser@o0w0o.com",
      password,
    });
    await verifyResult(
      expect,
      response,
      401,
      "fail",
      "Incorrect email or password"
    );
  });
});
