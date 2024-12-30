"use strict";

import { test, expect } from "@playwright/test";
import {
  getTestResponse,
  verifyResult,
  exampleTest,
} from "./../../utils/testHelper.js";
import dotenv from "dotenv";

dotenv.config();

const BASE_URL = `http://${process.env.HOST_DNS}:${process.env.PORT}`;
const password = "12345678Abc";
const passwordConfirm = "12345678Abc";

test.describe.serial("resetPassword test cases", () => {
  exampleTest(test, expect, BASE_URL);

  test("resetPassword without token", async () => {
    const token = "";
    const url = `${BASE_URL}/api/v1/users/resetPassword/${token}`;
    const response = await getTestResponse(url, "PATCH", {
      password,
      passwordConfirm,
    });
    await verifyResult(
      expect,
      response,
      404,
      "fail",
      "Cannot find /api/v1/users/resetPassword/ on this server."
    );
  });

  test("resetPassword with invalid token", async () => {
    const token = "fakeToken";
    const url = `${BASE_URL}/api/v1/users/resetPassword/${token}`;
    const response = await getTestResponse(url, "PATCH", {
      password,
      passwordConfirm,
    });
    await verifyResult(
      expect,
      response,
      400,
      "fail",
      "Token is invalid or has expired"
    );
  });

  test("resetPassword with empty body", async () => {
    const token = "tempToken";
    const url = `${BASE_URL}/api/v1/users/resetPassword/${token}`;
    const response = await getTestResponse(url, "PATCH", {});
    await verifyResult(
      expect,
      response,
      400,
      "fail",
      "Please provide valid password"
    );
  });

  test("resetPassword without password", async () => {
    const token = "tempToken";
    const url = `${BASE_URL}/api/v1/users/resetPassword/${token}`;
    const response = await getTestResponse(url, "PATCH", { passwordConfirm });
    await verifyResult(
      expect,
      response,
      400,
      "fail",
      "Please provide valid password"
    );
  });

  test("resetPassword without passwordConfirm", async () => {
    const token = "tempToken";
    const url = `${BASE_URL}/api/v1/users/resetPassword/${token}`;
    const response = await getTestResponse(url, "PATCH", { password });
    await verifyResult(
      expect,
      response,
      400,
      "fail",
      "Please provide valid password"
    );
  });

  test("resetPassword with wrong password", async () => {
    const token = "tempToken";
    const url = `${BASE_URL}/api/v1/users/resetPassword/${token}`;
    const response = await getTestResponse(url, "PATCH", {
      password: password + "1",
      passwordConfirm,
    });
    await verifyResult(
      expect,
      response,
      400,
      "fail",
      "Please provide valid password"
    );
  });

  // TODO: manual test cases
  test("resetPassword", async () => {
    const token = process.env.TEST_RESET_TOKEN;
    test.skip(!token); // skip test if no token provided

    const url = `${BASE_URL}/api/v1/users/resetPassword/${token}`;
    const response = await getTestResponse(url, "PATCH", {
      password,
      passwordConfirm,
    });
    await verifyResult(expect, response, 200, "success");
  });
});
