"use strict";

import express from "express";
import {
  getAllCharacters,
  getCharacter,
  createCharacter,
  updateCharacter,
  deleteCharacter,
} from "../controllers/characterController.js";

const router = express.Router();

router.route("/").get(getAllCharacters).post(createCharacter);
router
  .route("/:id")
  .get(getCharacter)
  .put(updateCharacter)
  .delete(deleteCharacter);

export { router };
