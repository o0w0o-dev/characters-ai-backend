"use strict";

import express from "express";
import { signup } from "../controllers/authController.js";
import { getUser } from "../controllers/userController.js";

const router = express.Router();

router.post("/signup", signup);
router.route("/:id").get(getUser);

export { router };
