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
const email = "createCharacter@o0w0o.com";
const password = "12345678Abc";
const passwordConfirm = "12345678Abc";
const model = "Model_A";
const instructions = "I want you act as a helpful assistant.";
const url = `http://${process.env.HOST_DNS}:${process.env.PORT}/api/v1/characters`;

test.beforeAll(async () => {
  await init(email, password, passwordConfirm);
});

test.beforeEach(async () => {
  await sleep(5000);
});

test.describe.serial("createCharacter test cases", () => {
  test.skip(true, "skip");
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

    // duplicate operation
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
    await verifyResult(
      expect,
      response2,
      500,
      "error",
      `E11000 duplicate key error collection: characters_ai.characters index: name_1 dup key: { name: "eCharacter" }`
    ); // TODO: update message
  });

  test("createCharacter with empty body", async ({}, testInfo) => {
    const data = await login(email, password);
    const response = await getTestResponse(
      url,
      "POST",
      {},
      getHeadersWithToken(data.token)
    );
    await verifyResult(
      expect,
      response,
      500,
      "error",
      "Character validation failed: name: Must have a name"
    );
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
    await verifyResult(
      expect,
      response,
      500,
      "error",
      "Character validation failed: name: Must have a name"
    );
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
    await verifyResult(expect, response, 201, "success");
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
    await verifyResult(expect, response, 201, "success");
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
    await verifyResult(
      expect,
      response,
      500,
      "error",
      "Character validation failed: name: The name must have less or equal then 25 characters"
    );
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
    await verifyResult(
      expect,
      response,
      500,
      "error",
      "Character validation failed: model: Model is either: Model_A, Model_B, Model_C"
    );
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
    await verifyResult(
      expect,
      response,
      500,
      "error",
      "Character validation failed: instructions: The instructions must have less or equal then 250 characters"
    );
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
