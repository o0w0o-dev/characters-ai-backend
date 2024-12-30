"use strict";

import { test, expect } from "@playwright/test";
import {
  exampleTest,
  getHeadersWithToken,
  getTestResponse,
  init,
  login,
  verifyResult,
} from "./../../utils/testHelper.js";
import dotenv from "dotenv";

dotenv.config();

const BASE_URL = `http://${process.env.HOST_DNS}:${process.env.PORT}`;
const email = "createCharacter@o0w0o.com";
const password = "12345678Abc";
const passwordConfirm = "12345678Abc";
const model = "Model_A";
const instructions = "I want you act as  a helpful assistant.";
const url = `http://${process.env.HOST_DNS}:${process.env.PORT}/api/v1/characters`;

test.beforeAll(async () => {
  await init(email, password, passwordConfirm);
});

test.describe("createCharacter test cases", () => {
  exampleTest(test, expect, BASE_URL);

  test("createCharacter", async ({}, testInfo) => {
    const data = await login(email, password);
    const response = await getTestResponse(
      url,
      "POST",
      {
        name: testInfo.title.slice(-10),
        model,
        instructions,
      },
      getHeadersWithToken(data.token)
    );
    await verifyResult(expect, response, 201, "success");

    // duplicate character
    const response2 = await getTestResponse(
      url,
      "POST",
      {
        name: testInfo.title.slice(-10),
        model,
        instructions,
      },
      getHeadersWithToken(data.token)
    );
    await verifyResult(expect, response2, 400, "fail", "failMessage");
  });

  test("createCharacter with empty body", async ({}, testInfo) => {
    const data = await login(email, password);
    const response = await getTestResponse(
      url,
      "POST",
      {},
      getHeadersWithToken(data.token)
    );
    await verifyResult(expect, response, 400, "fail", "failMessage");
  });

  test("createCharacter without name", async ({}, testInfo) => {
    const data = await login(email, password);
    const response = await getTestResponse(
      url,
      "POST",
      {
        model,
        instructions,
      },
      getHeadersWithToken(data.token)
    );
    await verifyResult(expect, response, 400, "fail", "failMessage");
  });

  test("createCharacter without model", async ({}, testInfo) => {
    const data = await login(email, password);
    const response = await getTestResponse(
      url,
      "POST",
      {
        name: testInfo.title.slice(-10),
        instructions,
      },
      getHeadersWithToken(data.token)
    );
    await verifyResult(expect, response, 400, "fail", "failMessage");
  });

  test("createCharacter without instructions", async ({}, testInfo) => {
    const data = await login(email, password);
    const response = await getTestResponse(
      url,
      "POST",
      {
        name: testInfo.title.slice(-10),
        model,
      },
      getHeadersWithToken(data.token)
    );
    await verifyResult(expect, response, 400, "fail", "failMessage");
  });

  test("createCharacter with invalid name", async ({}, testInfo) => {
    const data = await login(email, password);
    const response = await getTestResponse(
      url,
      "POST",
      {
        name: "nameWithMoreThan25Characters",
        model,
        instructions,
      },
      getHeadersWithToken(data.token)
    );
    await verifyResult(expect, response, 400, "fail", "failMessage");
  });

  test("createCharacter with invalid model", async ({}, testInfo) => {
    const data = await login(email, password);
    const response = await getTestResponse(
      url,
      "POST",
      {
        name: testInfo.title.slice(-10),
        model: "notExistModel",
        instructions,
      },
      getHeadersWithToken(data.token)
    );
    await verifyResult(expect, response, 400, "fail", "failMessage");
  });

  test("createCharacter with invalid instructions", async ({}, testInfo) => {
    const data = await login(email, password);
    const response = await getTestResponse(
      url,
      "POST",
      {
        name: testInfo.title.slice(-10),
        model,
        instructions: "long".repeat(250),
      },
      getHeadersWithToken(data.token)
    );
    await verifyResult(expect, response, 400, "fail", "failMessage");
  });

  test("createCharacter without auth", async ({}, testInfo) => {
    const response = await getTestResponse(
      url,
      "POST",
      {
        name: testInfo.title.slice(-10),
        model,
        instructions,
      },
      {
        "Content-Type": "application/json",
      }
    );
    await verifyResult(
      expect,
      response,
      401,
      "fail",
      "You are not logged in! Please log in to get access"
    );
  });

  test("createCharacter with wrong jwt token", async ({}, testInfo) => {
    const response = await getTestResponse(
      url,
      "POST",
      {
        name: testInfo.title.slice(-10),
        model,
        instructions,
      },
      getHeadersWithToken("wrong token")
    );
    await verifyResult(expect, response, 500, "error", "jwt malformed");
  });
});
