"use strict";

import express from "express";
import {
  getAllCharacters,
  getCharacter,
  createCharacter,
  updateCharacter,
  deleteCharacter,
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

export { router };
