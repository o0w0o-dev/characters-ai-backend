"use strict";

import { Character } from "./../models/characterModel.js";

async function getAllCharacters(req, res) {
  const characters = await Character.find();
  try {
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
}

async function getCharacter(req, res) {
  try {
    const character = await Character.findById(req.params.id);

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
}

async function createCharacter(req, res) {
  const character = await Character.create(req.body);
  try {
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
}

async function updateCharacter(req, res) {
  const character = await Character.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  try {
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
}

async function deleteCharacter(req, res) {
  try {
    const character = await Character.findByIdAndDelete(req.params.id);

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
}

export {
  getAllCharacters,
  getCharacter,
  createCharacter,
  updateCharacter,
  deleteCharacter,
};
