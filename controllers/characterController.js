"use strict";

import { AppError } from "../utils/appError.js";
import { catchAsync } from "../utils/catchAsync.js";
import { Character } from "./../models/characterModel.js";
import { Agent } from "../utils/agent.js";

function filterCharacterInfo(character) {
  const { _id, name, model, instructions } = character;
  return { id: _id.toString(), name, model, instructions };
}

const getAllCharacters = catchAsync(async (req, res) => {
  let characters = await Character.find({ userId: req.user._id }).sort(
    "-updated_at -created_at"
  );
  characters = characters.filter((character) => !character.deleted_at);
  characters = characters.map((character) => filterCharacterInfo(character));

  res.status(200).json({
    status: "success",
    results: characters.length,
    data: { characters },
  });
});

const getCharacter = catchAsync(async (req, res, next) => {
  let character = await Character.findOne({
    _id: req.params?.id,
    userId: req.user._id,
  });
  character = character?.deleted_at ? undefined : character;

  if (!character) {
    return next(new AppError("Invalid ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: { character: filterCharacterInfo(character) },
  });
});

const createCharacter = catchAsync(async (req, res) => {
  const { name, model, instructions } = req.body;
  const userId = req.user._id;
  const character = await Character.create({
    name,
    model,
    instructions,
    userId,
  });

  res.status(201).json({
    status: "success",
    data: { character: filterCharacterInfo(character) },
  });
});

const updateCharacter = catchAsync(async (req, res, next) => {
  const id = req.params?.id;
  const { name, model, instructions } = req.body;

  if (!name) {
    return next(new AppError("Invalid Name", 400));
  }

  // check if exist
  let character = await Character.findOne({
    _id: req.params?.id,
    userId: req.user._id,
  });
  character = character?.deleted_at ? undefined : character;
  if (!character) {
    return next(new AppError("Invalid ID", 404));
  }

  character = await Character.findByIdAndUpdate(
    id,
    { name, model, instructions, updated_at: Date.now() },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!character) {
    return next(new AppError("Invalid ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: { character: filterCharacterInfo(character) },
  });
});

const deleteCharacter = catchAsync(async (req, res, next) => {
  const id = req.params?.id;

  // check if exist
  let character = await Character.findOne({
    _id: req.params?.id,
    userId: req.user._id,
  });
  character = character?.deleted_at ? undefined : character;
  if (!character) {
    return next(new AppError("Invalid ID", 404));
  }

  character = await Character.findByIdAndUpdate(
    req.params.id,
    {
      deleted_at: Date.now(),
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!character) {
    return next(new AppError("Invalid ID", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});

const chat = catchAsync(async (req, res, next) => {
  let character = await Character.findOne({
    _id: req.params?.id,
    userId: req.user._id,
  });
  character = character?.deleted_at ? undefined : character;

  if (!character) {
    return next(new AppError("Invalid ID", 404));
  }

  const { id, name, model, instructions } = character;
  const { prompt, fileUrl } = req.body;
  const agent = new Agent(id, name, model, instructions);

  console.log({ id, name, model, instructions, prompt, fileUrl });

  const message = await agent.chat(prompt, fileUrl);

  res.status(200).json({
    status: "success",
    data: { message: message },
  });
});

export {
  getAllCharacters,
  getCharacter,
  createCharacter,
  updateCharacter,
  deleteCharacter,
  chat,
};
