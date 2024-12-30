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
const email = "getUser@o0w0o.com";
const password = "12345678Abc";
const passwordConfirm = "12345678Abc";

async function init() {
  await fetch(
    `http://${process.env.HOST_DNS}:${process.env.PORT}/api/v1/users/signup`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        passwordConfirm,
      }),
    }
  );
}

async function login() {
  const response = await fetch(
    `http://${process.env.HOST_DNS}:${process.env.PORT}/api/v1/users/login`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
      }),
    }
  );

  return await response.json();
}

test.beforeAll(async () => {
  await init();
});

test.describe("getUser test cases", () => {
  exampleTest(test, expect, BASE_URL);

  test("getUser", async () => {
    const data = await login();
    const response = await getTestResponse(
      `http://${process.env.HOST_DNS}:${process.env.PORT}/api/v1/users/${data.data?.user?.id}`,
      "GET",
      undefined,
      {
        "Content-Type": "application/json",
        Authorization: `Bearer ${data.token}`,
      }
    );
    await verifyResult(expect, response, 200, "success");
  });

  test("getUser without id", async () => {
    const data = await login();
    const response = await getTestResponse(
      `http://${process.env.HOST_DNS}:${process.env.PORT}/api/v1/users/`,
      "GET",
      undefined,
      {
        "Content-Type": "application/json",
        Authorization: `Bearer ${data.token}`,
      }
    );
    await verifyResult(
      expect,
      response,
      404,
      "fail",
      "Cannot find /api/v1/users/ on this server."
    );
  });

  test("getUser with wrong id", async () => {
    const data = await login();
    const wrongId = data.data?.user?.id.split("").sort().join("");
    const response = await getTestResponse(
      `http://${process.env.HOST_DNS}:${process.env.PORT}/api/v1/users/${wrongId}`,
      "GET",
      undefined,
      {
        "Content-Type": "application/json",
        Authorization: `Bearer ${data.token}`,
      }
    );
    await verifyResult(expect, response, 404, "fail", "Invalid ID");
  });

  test("getUser without auth", async () => {
    const data = await login();
    const response = await getTestResponse(
      `http://${process.env.HOST_DNS}:${process.env.PORT}/api/v1/users/${data.data?.user?.id}`,
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

  test("getUser with wrong jwt token", async () => {
    const data = await login();
    const response = await getTestResponse(
      `http://${process.env.HOST_DNS}:${process.env.PORT}/api/v1/users/${data.data?.user?.id}`,
      "GET",
      undefined,
      {
        "Content-Type": "application/json",
        Authorization: `Bearer wrong token`,
      }
    );
    await verifyResult(expect, response, 500, "error", "jwt malformed");
  });
});
