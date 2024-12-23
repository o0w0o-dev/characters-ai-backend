"use strict";

import { catchAsync } from "../utils/catchAsync.js";
import { Character } from "./../models/characterModel.js";

const getAllCharacters = catchAsync(async (req, res) => {
  try {
    let characters = await Character.find().sort("-updated_at -created_at");
    characters = characters.filter((character) => !character.deleted_at);

    res.status(200).json({
      status: "success",
      results: characters.length,
      data: { characters },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
});

const getCharacter = catchAsync(async (req, res) => {
  try {
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
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
});

const createCharacter = catchAsync(async (req, res) => {
  try {
    const character = await Character.create(req.body);

    res.status(201).json({
      status: "success",
      data: character,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
});

const updateCharacter = catchAsync(async (req, res) => {
  try {
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
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
});

const deleteCharacter = catchAsync(async (req, res) => {
  try {
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
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
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
