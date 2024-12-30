"use strict";

import { test, expect } from "@playwright/test";
import {
  exampleTest,
  getTestResponse,
  init,
  login,
  verifyResult,
} from "./../../utils/testHelper.js";
import dotenv from "dotenv";

dotenv.config();

const BASE_URL = `http://${process.env.HOST_DNS}:${process.env.PORT}`;
const email = "updatePassword@o0w0o.com";
const passwordCurrent = "12345678Abc";
const password = "12345678Abc";
const passwordConfirm = "12345678Abc";
const url = `${BASE_URL}/api/v1/users/updatePassword`;

test.beforeAll(async () => {
  await init(email, password, passwordConfirm);
});

test.beforeAll(async () => {
  await init();
});

test.describe.serial("updatePassword test cases", () => {
  exampleTest(test, expect, BASE_URL);

  test("updatePassword", async () => {
    const data = await login(email, password);
    const response = await getTestResponse(
      url,
      "PATCH",
      { passwordCurrent, password, passwordConfirm },
      {
        "Content-Type": "application/json",
        Authorization: `Bearer ${data.token}`,
      }
    );
    await verifyResult(expect, response, 200, "success");

    // update password twice
    const response2 = await getTestResponse(
      url,
      "PATCH",
      { passwordCurrent, password, passwordConfirm },
      {
        "Content-Type": "application/json",
        Authorization: `Bearer ${data.token}`,
      }
    );
    await verifyResult(
      expect,
      response2,
      401,
      "fail",
      "User recently changed password! Please log in again"
    );
  });

  test("updatePassword with wrong current password", async () => {
    const data = await login(email, password);
    const response = await getTestResponse(
      url,
      "PATCH",
      { passwordCurrent: passwordCurrent + "1", password, passwordConfirm },
      {
        "Content-Type": "application/json",
        Authorization: `Bearer ${data.token}`,
      }
    );
    await verifyResult(
      expect,
      response,
      401,
      "fail",
      "Your current password is wrong"
    );
  });

  test("updatePassword with empty body", async () => {
    const data = await login(email, password);
    const response = await getTestResponse(
      url,
      "PATCH",
      {},
      {
        "Content-Type": "application/json",
        Authorization: `Bearer ${data.token}`,
      }
    );
    await verifyResult(
      expect,
      response,
      400,
      "fail",
      "Please provide valid password"
    );
  });

  test("updatePassword without passwordCurrent", async () => {
    const data = await login(email, password);
    const response = await getTestResponse(
      url,
      "PATCH",
      {
        password,
        passwordConfirm,
      },
      {
        "Content-Type": "application/json",
        Authorization: `Bearer ${data.token}`,
      }
    );
    await verifyResult(
      expect,
      response,
      400,
      "fail",
      "Please provide valid password"
    );
  });

  test("updatePassword without password", async () => {
    const data = await login(email, password);
    const response = await getTestResponse(
      url,
      "PATCH",
      {
        passwordCurrent,
        passwordConfirm,
      },
      {
        "Content-Type": "application/json",
        Authorization: `Bearer ${data.token}`,
      }
    );
    await verifyResult(
      expect,
      response,
      400,
      "fail",
      "Please provide valid password"
    );
  });

  test("updatePassword without passwordConfirm", async () => {
    const data = await login(email, password);
    const response = await getTestResponse(
      url,
      "PATCH",
      {
        passwordCurrent,
        password,
      },
      {
        "Content-Type": "application/json",
        Authorization: `Bearer ${data.token}`,
      }
    );
    await verifyResult(
      expect,
      response,
      400,
      "fail",
      "Please provide valid password"
    );
  });

  test("updatePassword with wrong password", async () => {
    const data = await login(email, password);
    const response = await getTestResponse(
      url,
      "PATCH",
      {
        passwordCurrent,
        password: password + "1",
        passwordConfirm,
      },
      {
        "Content-Type": "application/json",
        Authorization: `Bearer ${data.token}`,
      }
    );
    await verifyResult(
      expect,
      response,
      400,
      "fail",
      "Please provide valid password"
    );
  });

  test("updatePassword without auth", async () => {
    const response = await getTestResponse(
      url,
      "PATCH",
      { passwordCurrent, password, passwordConfirm },
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

  test("updatePassword with wrong jwt token", async () => {
    const response = await getTestResponse(
      url,
      "PATCH",
      { passwordCurrent, password, passwordConfirm },
      {
        "Content-Type": "application/json",
        Authorization: `Bearer wrong token`,
      }
    );
    await verifyResult(expect, response, 500, "error", "jwt malformed");
  });
});
