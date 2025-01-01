"use strict";

// TODO: use swaggerJsDoc
import swaggerUi from "swagger-ui-express";

const spec = {
  openapi: "3.0.3",
  info: {
    title: "REST API Docs",
    version: "1.0.0",
  },
  servers: [
    {
      url: "https://www.o0w0o.com/api/v1",
    },
    {
      url: "http://localhost/api/v1",
    },
  ],
  tags: [
    {
      name: "users",
      description: "Operations about user",
    },
    {
      name: "characters",
      description: "Operations about characters",
    },
  ],
  paths: {
    "/users/signup": {
      post: {
        tags: ["users"],
        summary: "Create user",
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/createUser",
              },
            },
            "application/xml": {
              schema: {
                $ref: "#/components/schemas/createUser",
              },
            },
            "application/x-www-form-urlencoded": {
              schema: {
                $ref: "#/components/schemas/createUser",
              },
            },
          },
        },
        responses: {
          201: {
            description: "User created",
          },
        },
      },
    },
    "/users/login": {
      post: {
        tags: ["users"],
        summary: "User login",
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/userLogin",
              },
            },
            "application/xml": {
              schema: {
                $ref: "#/components/schemas/userLogin",
              },
            },
            "application/x-www-form-urlencoded": {
              schema: {
                $ref: "#/components/schemas/userLogin",
              },
            },
          },
        },
        responses: {
          200: {
            description: "User logged in",
          },
        },
      },
    },
    "/users/forgotPassword": {
      post: {
        tags: ["users"],
        summary: "Forgot password",
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/userForgotPassword",
              },
            },
            "application/xml": {
              schema: {
                $ref: "#/components/schemas/userForgotPassword",
              },
            },
            "application/x-www-form-urlencoded": {
              schema: {
                $ref: "#/components/schemas/userForgotPassword",
              },
            },
          },
        },
        responses: {
          200: {
            description: "Reset password URL sent to email",
          },
        },
      },
    },
    "/users/resetPassword/{token}": {
      patch: {
        tags: ["users"],
        summary: "Reset password",
        security: [],
        parameters: [
          {
            name: "token",
            in: "path",
            description: "Reset token",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/userResetPassword",
              },
            },
            "application/xml": {
              schema: {
                $ref: "#/components/schemas/userResetPassword",
              },
            },
            "application/x-www-form-urlencoded": {
              schema: {
                $ref: "#/components/schemas/userResetPassword",
              },
            },
          },
        },
        responses: {
          200: {
            description: "User password reset",
          },
        },
      },
    },
    "/users/updatePassword": {
      patch: {
        tags: ["users"],
        summary: "Update user's password",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/userUpdatePassword",
              },
            },
            "application/xml": {
              schema: {
                $ref: "#/components/schemas/userUpdatePassword",
              },
            },
            "application/x-www-form-urlencoded": {
              schema: {
                $ref: "#/components/schemas/userUpdatePassword",
              },
            },
          },
        },
        responses: {
          200: {
            description: "User's password updated",
          },
        },
      },
    },
    "/users/{id}": {
      get: {
        tags: ["users"],
        summary: "Get user by ID",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            description: "User ID",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "Successful operation",
          },
        },
      },
    },
    "/characters": {
      get: {
        tags: ["characters"],
        summary: "Get all characters",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Successful operation",
          },
        },
      },
      post: {
        tags: ["characters"],
        summary: "Create character",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/createCharacter",
              },
            },
            "application/xml": {
              schema: {
                $ref: "#/components/schemas/createCharacter",
              },
            },
            "application/x-www-form-urlencoded": {
              schema: {
                $ref: "#/components/schemas/createCharacter",
              },
            },
          },
        },
        responses: {
          200: {
            description: "Successful operation",
          },
        },
      },
    },
    "/characters/{id}": {
      get: {
        tags: ["characters"],
        summary: "Get character by ID",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            description: "Characters ID",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "Successful operation",
          },
        },
      },
      put: {
        tags: ["characters"],
        summary: "Update character by ID",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            description: "Characters ID",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/updateCharacter",
              },
            },
            "application/xml": {
              schema: {
                $ref: "#/components/schemas/updateCharacter",
              },
            },
            "application/x-www-form-urlencoded": {
              schema: {
                $ref: "#/components/schemas/updateCharacter",
              },
            },
          },
        },
        responses: {
          200: {
            description: "Successful operation",
          },
        },
      },
      delete: {
        tags: ["characters"],
        summary: "Delete character by ID",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            description: "Characters ID",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          204: {
            description: "Successful operation",
          },
        },
      },
    },
  },
  components: {
    schemas: {
      createUser: {
        type: "object",
        properties: {
          email: {
            type: "string",
            example: "exampleUser@o0w0o.com",
          },
          password: {
            type: "string",
            example: "StrongPassword123",
          },
          passwordConfirm: {
            type: "string",
            example: "StrongPassword123",
          },
        },
      },
      userLogin: {
        type: "object",
        properties: {
          email: {
            type: "string",
            example: "exampleUser@o0w0o.com",
          },
          password: {
            type: "string",
            example: "StrongPassword123",
          },
        },
      },
      userForgotPassword: {
        type: "object",
        properties: {
          email: {
            type: "string",
            example: "exampleUser@o0w0o.com",
          },
        },
      },
      userResetPassword: {
        type: "object",
        properties: {
          password: {
            type: "string",
            example: "StrongPassword123",
          },
          passwordConfirm: {
            type: "string",
            example: "StrongPassword123",
          },
        },
      },
      userUpdatePassword: {
        type: "object",
        properties: {
          passwordCurrent: {
            type: "string",
            example: "StrongPassword123",
          },
          password: {
            type: "string",
            example: "NewStrongPassword123",
          },
          passwordConfirm: {
            type: "string",
            example: "NewStrongPassword123",
          },
        },
      },
      createCharacter: {
        type: "object",
        properties: {
          name: {
            type: "string",
            example: "My assistant",
          },
          model: {
            type: "string",
            example: "Model_A",
          },
          instructions: {
            type: "string",
            example: "I want you act as a helpful assistant.",
          },
        },
      },
      updateCharacter: {
        type: "object",
        properties: {
          name: {
            type: "string",
            example: "My assistant",
          },
          model: {
            type: "string",
            example: "Model_A",
          },
          instructions: {
            type: "string",
            example: "I want you act as a helpful assistant.",
          },
        },
      },
    },
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};

function swaggerDocs(app, port) {
  // Swagger page
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(spec));

  // Docs in JSON format
  app.get("/docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(spec);
  });

  console.log(`Docs avaiable at http://localhost:${port}/docs`);
}

export default swaggerDocs;
