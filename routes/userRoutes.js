"use strict";

import express from "express";
import {
  signup,
  login,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";
import { getUser } from "../controllers/userController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/forgotPassword", forgotPassword);
router.patch("/resetPassword/:token", resetPassword);

router.route("/:id").get(getUser);

export { router };
