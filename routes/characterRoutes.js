"use strict";

import express from "express";
import {
  getAllCharacters,
  getCharacter,
  createCharacter,
  updateCharacter,
  deleteCharacter,
  chat,
} from "../controllers/characterController.js";
import { protect } from "../controllers/authController.js";

const router = express.Router();

router.use(protect);

router.route("/").get(getAllCharacters).post(createCharacter);
router
  .route("/:id")
  .get(getCharacter)
  .put(updateCharacter)
  .delete(deleteCharacter);
router.route("/:id/chat").post(chat);

export { router };
