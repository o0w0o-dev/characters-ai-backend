"use strict";

import { test, expect } from "@playwright/test";
import {
  exampleTest,
  getHeadersWithToken,
  getTestResponse,
  init,
  login,
  sleep,
  verifyResult,
} from "./../../utils/testHelper.js";
import dotenv from "dotenv";

dotenv.config();

const BASE_URL = `http://${process.env.HOST_DNS}:${process.env.PORT}`;
const email = "getAllCharacters@o0w0o.com";
const password = "12345678Abc";
const passwordConfirm = "12345678Abc";
const url = `http://${process.env.HOST_DNS}:${process.env.PORT}/api/v1/characters`;

test.beforeAll(async () => {
  await init(email, password, passwordConfirm);
});

test.beforeEach(async () => {
  await sleep(5000);
});

test.describe.serial("getAllCharacters test cases", () => {
  test.skip(true, "skip");
  exampleTest(test, expect, BASE_URL);

  test("getAllCharacters", async () => {
    const data = await login(email, password);
    const response = await getTestResponse(
      url,
      "GET",
      undefined,
      getHeadersWithToken(data.token)
    );
    await verifyResult(expect, response, 200, "success");

    // duplicate operation
    const response2 = await getTestResponse(
      url,
      "GET",
      undefined,
      getHeadersWithToken(data.token)
    );
    await verifyResult(expect, response2, 200, "success");
  });

  test("getAllCharacters without auth", async () => {
    const response = await getTestResponse(url, "GET", undefined, {
      "Content-Type": "application/json",
    });
    await verifyResult(
      expect,
      response,
      401,
      "fail",
      "You are not logged in! Please log in to get access"
    );
  });

  test("getAllCharacters with wrong jwt token", async () => {
    const response = await getTestResponse(
      url,
      "GET",
      undefined,
      getHeadersWithToken("wrong token")
    );
    await verifyResult(expect, response, 500, "error", "jwt malformed");
  });
});
