"use strict";

import express from "express";
import { signup, login, reset } from "../controllers/authController.js";
import { getUser } from "../controllers/userController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/reset", reset);

router.route("/:id").get(getUser);

export { router };
