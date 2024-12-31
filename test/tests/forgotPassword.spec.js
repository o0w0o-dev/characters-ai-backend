"use strict";

import { test, expect } from "@playwright/test";
import {
  exampleTest,
  getTestResponse,
  init,
  login,
  sleep,
  verifyResult,
} from "./../../utils/testHelper.js";
import dotenv from "dotenv";

dotenv.config();

const BASE_URL = `http://${process.env.HOST_DNS}:${process.env.PORT}`;
const email = "forgotPassword@o0w0o.com";
const password = "12345678Abc";
const passwordConfirm = "12345678Abc";
const url = `${BASE_URL}/api/v1/users/forgotPassword`;

test.beforeAll(async () => {
  await init(email, password, passwordConfirm);
});

test.beforeEach(async () => {
  await sleep(5000);
});

test.describe.serial("forgotPassword test cases", () => {
  test.skip(true, "skip");
  exampleTest(test, expect, BASE_URL);

  test("forgotPassword", async () => {
    const response = await getTestResponse(url, "POST", { email });
    await verifyResult(expect, response, 200, "success", "Token sent to email");

    // duplicate operation
    const response2 = await getTestResponse(url, "POST", { email });
    await verifyResult(
      expect,
      response2,
      200,
      "success",
      "Token sent to email"
    );
  });

  test("forgotPassword with empty body", async () => {
    const response = await getTestResponse(url, "POST", {});
    await verifyResult(
      expect,
      response,
      404,
      "fail",
      "There is no user with email address"
    );
  });

  test("forgotPassword with invalid email", async () => {
    const response = await getTestResponse(url, "POST", {
      email: email.split("@")[0],
    });
    await verifyResult(
      expect,
      response,
      404,
      "fail",
      "There is no user with email address"
    );
  });

  test("forgotPassword with upperCase", async () => {
    const response = await getTestResponse(url, "POST", {
      email: email.toUpperCase(),
    });
    await verifyResult(expect, response, 200, "success", "Token sent to email");
  });

  test("forgotPassword with non exist user", async () => {
    const response = await getTestResponse(url, "POST", {
      email: "nonExistUser@o0w0o.com",
    });
    await verifyResult(
      expect,
      response,
      404,
      "fail",
      "There is no user with email address"
    );
  });
});
