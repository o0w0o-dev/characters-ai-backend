"use strict";

import { catchAsync } from "../utils/catchAsync.js";
import { Character } from "./../models/characterModel.js";

const getAllCharacters = catchAsync(async (req, res) => {
  let characters = await Character.find().sort("-updated_at -created_at");
  characters = characters.filter((character) => !character.deleted_at);

  res.status(200).json({
    status: "success",
    results: characters.length,
    data: { characters },
  });
});

const getCharacter = catchAsync(async (req, res) => {
  let character = await Character.findById(req.params.id);
  character = character?.deleted_at ? undefined : character;

  if (!character) {
    res.status(404).json({
      status: "fail",
      message: "Invalid ID",
    });
  } else {
    res.status(200).json({
      status: "success",
      data: { character },
    });
  }
});

const createCharacter = catchAsync(async (req, res) => {
  const character = await Character.create(req.body);

  res.status(201).json({
    status: "success",
    data: character,
  });
});

const updateCharacter = catchAsync(async (req, res) => {
  const character = await Character.findByIdAndUpdate(
    req.params.id,
    { ...req.body, updated_at: Date.now() },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: "success",
    data: character,
  });
});

const deleteCharacter = catchAsync(async (req, res) => {
  const character = await Character.findByIdAndUpdate(
    req.params.id,
    { deleted_at: Date.now() },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!character) {
    res.status(404).json({
      status: "fail",
      message: "Invalid ID",
    });
  } else {
    res.status(204).json({
      status: "success",
      data: null,
    });
  }
});

export {
  getAllCharacters,
  getCharacter,
  createCharacter,
  updateCharacter,
  deleteCharacter,
};
