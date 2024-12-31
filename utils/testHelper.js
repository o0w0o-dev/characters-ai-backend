"use strict";

import dotenv from "dotenv";
dotenv.config();

export async function getTestResponse(
  url,
  method,
  body = {},
  headers = { "Content-Type": "application/json" }
) {
  const options =
    method === "GET" || method === "DELETE"
      ? {
          method,
          headers,
        }
      : { method, headers, body: JSON.stringify(body) };
  const response = await fetch(url, options);
  return response;
}

export async function verifyResult(
  expect,
  response,
  expectedStatusCode,
  expectedStatus,
  expectedMessage = undefined
) {
  expect(response.status).toBe(expectedStatusCode);

  if (expectedStatusCode === 204) return;
  const data = await response.json();
  expect(data.status).toEqual(expectedStatus);
  if (expectedMessage) expect(data.message).toEqual(expectedMessage);
}

export async function exampleTest(test, expect, url) {
  test("example test", async () => {
    const headers = { "Content-Type": "application/json" };

    const response = await fetch(url, {
      headers,
    });

    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data).toEqual({ root: true });
  });
}

export async function init(email, password, passwordConfirm) {
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

export async function login(email, password) {
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

export async function createCharacter(token, name, model, instructions) {
  const response = await fetch(
    `http://${process.env.HOST_DNS}:${process.env.PORT}/api/v1/characters`,
    {
      method: "POST",
      headers: getHeadersWithToken(token),
      body: JSON.stringify({
        name,
        model,
        instructions,
      }),
    }
  );

  return await response.json();
}

export function getHeadersWithToken(token) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
