"use strict";

import dotenv from "dotenv";
import express from "express";

const app = express();
dotenv.config();

app.use(express.json());

const ENV = process.env;
const port = ENV.PORT || 8000;

const characters = [
  {
    id: "1",
    name: "characterName1",
    model: "characterModel1",
    instructions: "characterInstructions1",
    avatar: "characterAvatar1",
    createAt: Date.now(),
  },
  {
    id: "2",
    name: "characterName2",
    model: "characterModel2",
    instructions: "characterInstructions2",
    avatar: "characterAvatar2",
    createAt: Date.now(),
  },
  {
    id: "3",
    name: "characterName3",
    model: "characterModel3",
    instructions: "characterInstructions3",
    avatar: "characterAvatar3",
    createAt: Date.now(),
  },
  {
    id: "4",
    name: "characterName4",
    model: "characterModel4",
    instructions: "characterInstructions4",
    avatar: "characterAvatar4",
    createAt: Date.now(),
  },
];

function getAllCharacters(req, res) {
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

function getCharacter(req, res) {
  try {
    const id = req.params.id;
    const character = characters.find((character) => character.id === id);

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

function createCharacter(req, res) {
  try {
    res.status(201).json({
      status: "success",
      data: req.body,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
}

function updateCharacter(req, res) {
  try {
    res.status(201).json({
      status: "success",
      data: req.body,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
}

function deleteCharacter(req, res) {
  try {
    const id = req.params.id;
    const character = characters.find((character) => character.id === id);

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

app.get("/api/v1/characters", getAllCharacters);
app.get("/api/v1/characters/:id", getCharacter);
app.post("/api/v1/characters", createCharacter);
app.put("/api/v1/characters/:id", updateCharacter);
app.delete("/api/v1/characters/:id", deleteCharacter);

app.get("/", (req, res) => {
  res.status(200).json({
    root: true,
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
