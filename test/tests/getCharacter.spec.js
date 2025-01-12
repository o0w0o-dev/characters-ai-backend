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
const email = "getCharacter@o0w0o.com";
const password = "12345678Abc";
const passwordConfirm = "12345678Abc";
const model = "meta-llama/Llama-3.1-8B-Instruct";
const instructions = "I want you act as a helpful assistant.";

test.beforeAll(async () => {
  await init(email, password, passwordConfirm);
});

test.beforeEach(async () => {
  await sleep(5000);
});

test.describe.serial("getCharacter test cases", () => {
  test.skip(true, "skip");
  exampleTest(test, expect, BASE_URL);

  test("getCharacter", async ({}, testInfo) => {
    const data = await login(email, password);
    const data2 = await createCharacter(
      data.token,
      testInfo.title.slice(-10),
      model,
      instructions
    );
    const response = await getTestResponse(
      `http://${process.env.HOST_DNS}:${
        process.env.PORT
      }/api/v1/characters/${data2.data?.character?.id?.toString()}`,
      "GET",
      undefined,
      getHeadersWithToken(data.token)
    );
    await verifyResult(expect, response, 200, "success");

    // duplicate operation
    const response2 = await getTestResponse(
      `http://${process.env.HOST_DNS}:${
        process.env.PORT
      }/api/v1/characters/${data2.data?.character?.id?.toString()}`,
      "GET",
      undefined,
      getHeadersWithToken(data.token)
    );
    await verifyResult(expect, response2, 200, "success");
  });

  test("getCharacter with wrong id", async ({}, testInfo) => {
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
      .join(""); // TODO: test invalid id format
    const response = await getTestResponse(
      `http://${process.env.HOST_DNS}:${process.env.PORT}/api/v1/characters/${wrongId}`,
      "GET",
      undefined,
      getHeadersWithToken(data.token)
    );
    await verifyResult(expect, response, 404, "fail", "Invalid ID");
  });

  test("getCharacter without auth", async ({}, testInfo) => {
    const data = await login(email, password);
    const data2 = await createCharacter(
      data.token,
      testInfo.title.slice(-10),
      model,
      instructions
    );
    const response = await getTestResponse(
      `http://${process.env.HOST_DNS}:${
        process.env.PORT
      }/api/v1/characters/${data2.data?.character?.id?.toString()}`,
      "GET",
      undefined,
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

  test("getCharacter with wrong jwt token", async ({}, testInfo) => {
    const data = await login(email, password);
    const data2 = await createCharacter(
      data.token,
      testInfo.title.slice(-10),
      model,
      instructions
    );
    const response = await getTestResponse(
      `http://${process.env.HOST_DNS}:${
        process.env.PORT
      }/api/v1/characters/${data2.data?.character?.id?.toString()}`,
      "GET",
      undefined,
      getHeadersWithToken("wrong token")
    );
    await verifyResult(expect, response, 500, "error", "jwt malformed");
  });
});
