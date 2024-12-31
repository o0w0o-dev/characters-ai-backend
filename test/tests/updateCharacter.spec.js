"use strict";

import { test, expect } from "@playwright/test";
import {
  createCharacter,
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
const email = "updateCharacter@o0w0o.com";
const password = "12345678Abc";
const passwordConfirm = "12345678Abc";
const model = "Model_A";
const instructions = "I want you act as a helpful assistant.";
const url = `http://${process.env.HOST_DNS}:${process.env.PORT}/api/v1/characters/`;

test.beforeAll(async () => {
  await init(email, password, passwordConfirm);
});

test.beforeEach(async () => {
  await sleep(5000);
});

test.describe.serial("updateCharacter test cases", () => {
  test.skip(false, "skip");
  exampleTest(test, expect, BASE_URL);

  test("updateCharacter", async ({}, testInfo) => {
    const data = await login(email, password);
    const data2 = await createCharacter(
      data.token,
      testInfo.title.slice(-10),
      model,
      instructions
    );
    const id = data2.data?.character?.id?.toString();
    const response = await getTestResponse(
      url + id,
      "PUT",
      {
        name: testInfo.title.slice(-10),
        model,
        instructions,
      },
      getHeadersWithToken(data.token)
    );
    await verifyResult(expect, response, 200, "success");

    // duplicate operation
    const response2 = await getTestResponse(
      url + id,
      "PUT",
      {
        name: testInfo.title.slice(-10),
        model,
        instructions,
      },
      getHeadersWithToken(data.token)
    );
    await verifyResult(expect, response2, 200, "success");
  });

  test("updateCharacter without id", async ({}, testInfo) => {
    const data = await login(email, password);
    const response = await getTestResponse(
      url,
      "PUT",
      {
        name: testInfo.title.slice(-10),
        model,
        instructions,
      },
      getHeadersWithToken(data.token)
    );
    await verifyResult(
      expect,
      response,
      404,
      "fail",
      "Cannot find /api/v1/characters/ on this server."
    );
  });

  test("updateCharacter with wrong id", async ({}, testInfo) => {
    const data = await login(email, password);
    const data2 = await createCharacter(
      data.token,
      testInfo.title.slice(-10),
      model,
      instructions
    );
    const wrongId = data2.data?.character?.id
      ?.toString()
      .split("")
      .sort()
      .join("");
    const response = await getTestResponse(
      url + wrongId,
      "PUT",
      {
        name: testInfo.title.slice(-10),
        model,
        instructions,
      },
      getHeadersWithToken(data.token)
    );
    await verifyResult(expect, response, 404, "fail", "Invalid ID");
  });

  test("updateCharacter with empty body", async ({}, testInfo) => {
    const data = await login(email, password);
    const data2 = await createCharacter(
      data.token,
      testInfo.title.slice(-10),
      model,
      instructions
    );
    const id = data2.data?.character?.id?.toString();
    const response = await getTestResponse(
      url + id,
      "PUT",
      {},
      getHeadersWithToken(data.token)
    );
    await verifyResult(expect, response, 400, "fail", "Invalid Name");
  });

  test("updateCharacter without name", async ({}, testInfo) => {
    const data = await login(email, password);
    const data2 = await createCharacter(
      data.token,
      testInfo.title.slice(-10),
      model,
      instructions
    );
    const id = data2.data?.character?.id?.toString();
    const response = await getTestResponse(
      url + id,
      "PUT",
      {
        model,
        instructions,
      },
      getHeadersWithToken(data.token)
    );
    await verifyResult(expect, response, 400, "fail", "Invalid Name");
  });

  test("updateCharacter without model", async ({}, testInfo) => {
    const data = await login(email, password);
    const data2 = await createCharacter(
      data.token,
      testInfo.title.slice(-10),
      model,
      instructions
    );
    const id = data2.data?.character?.id?.toString();
    const response = await getTestResponse(
      url + id,
      "PUT",
      {
        name: testInfo.title.slice(-10),
        instructions,
      },
      getHeadersWithToken(data.token)
    );
    await verifyResult(expect, response, 200, "success");
  });

  test("updateCharacter without instructions", async ({}, testInfo) => {
    const data = await login(email, password);
    const data2 = await createCharacter(
      data.token,
      testInfo.title.slice(-10),
      model,
      instructions
    );
    const id = data2.data?.character?.id?.toString();
    const response = await getTestResponse(
      url + id,
      "PUT",
      {
        name: testInfo.title.slice(-10),
        model,
      },
      getHeadersWithToken(data.token)
    );
    await verifyResult(expect, response, 200, "success");
  });

  test("updateCharacter with invalid name", async ({}, testInfo) => {
    const data = await login(email, password);
    const data2 = await createCharacter(
      data.token,
      testInfo.title.slice(-10),
      model,
      instructions
    );
    const id = data2.data?.character?.id?.toString();
    const response = await getTestResponse(
      url + id,
      "PUT",
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
      "Validation failed: name: The name must have less or equal then 25 characters"
    );
  });

  test("updateCharacter with invalid model", async ({}, testInfo) => {
    const data = await login(email, password);
    const data2 = await createCharacter(
      data.token,
      testInfo.title.slice(-10),
      model,
      instructions
    );
    const id = data2.data?.character?.id?.toString();
    const response = await getTestResponse(
      url + id,
      "PUT",
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
      "Validation failed: model: Model is either: Model_A, Model_B, Model_C"
    );
  });

  test("updateCharacter with invalid instructions", async ({}, testInfo) => {
    const data = await login(email, password);
    const data2 = await createCharacter(
      data.token,
      testInfo.title.slice(-11),
      model,
      instructions
    );
    const id = data2.data?.character?.id?.toString();
    const response = await getTestResponse(
      url + id,
      "PUT",
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
      "Validation failed: instructions: The instructions must have less or equal then 250 characters"
    );
  });

  test("updateCharacter without auth", async ({}, testInfo) => {
    const data = await login(email, password);
    const data2 = await createCharacter(
      data.token,
      testInfo.title.slice(-10),
      model,
      instructions
    );
    const id = data2.data?.character?.id?.toString();
    const response = await getTestResponse(
      url + id,
      "PUT",
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

  test("updateCharacter with wrong jwt token", async ({}, testInfo) => {
    const data = await login(email, password);
    const data2 = await createCharacter(
      data.token,
      testInfo.title.slice(-10),
      model,
      instructions
    );
    const id = data2.data?.character?.id?.toString();
    const response = await getTestResponse(
      url + id,
      "PUT",
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
