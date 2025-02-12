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
const email = "deleteCharacter@o0w0o.com";
const password = "12345678Abc";
const passwordConfirm = "12345678Abc";
const model = "meta-llama/Llama-3.1-8B-Instruct";
const instructions = "I want you act as a helpful assistant.";
const url = `http://${process.env.HOST_DNS}:${process.env.PORT}/api/v1/characters/`;

test.beforeAll(async () => {
  await init(email, password, passwordConfirm);
});

test.beforeEach(async () => {
  await sleep(5000);
});

test.describe.serial("deleteCharacter test cases", () => {
  test.skip(false, "skip");
  exampleTest(test, expect, BASE_URL);

  test("deleteCharacter", async ({}, testInfo) => {
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
      "DELETE",
      undefined,
      getHeadersWithToken(data.token)
    );
    await verifyResult(expect, response, 204, undefined);

    // duplicate operation
    const response2 = await getTestResponse(
      url + id,
      "DELETE",
      undefined,
      getHeadersWithToken(data.token)
    );
    await verifyResult(expect, response2, 404, "fail", "Invalid ID");
  });

  test("deleteCharacter without id", async ({}, testInfo) => {
    const data = await login(email, password);
    const response = await getTestResponse(
      url,
      "DELETE",
      undefined,
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

  test("deleteCharacter with wrong id", async ({}, testInfo) => {
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
      "DELETE",
      undefined,
      getHeadersWithToken(data.token)
    );
    await verifyResult(expect, response, 404, "fail", "Invalid ID");
  });

  test("deleteCharacter without auth", async ({}, testInfo) => {
    const data = await login(email, password);
    const data2 = await createCharacter(
      data.token,
      testInfo.title.slice(-10),
      model,
      instructions
    );
    const id = data2.data?.character?.id?.toString();
    const response = await getTestResponse(url + id, "DELETE", undefined, {
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

  test("deleteCharacter with wrong jwt token", async ({}, testInfo) => {
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
      "DELETE",
      undefined,
      getHeadersWithToken("wrong token")
    );
    await verifyResult(expect, response, 500, "error", "jwt malformed");
  });
});
