"use strict";

export async function getTestResponse(
  url,
  method,
  body = {},
  headers = { "Content-Type": "application/json" }
) {
  const options =
    method === "GET"
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
