import express from "express";

const router = express.Router();

// TODO: remove dev data
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

router.route("/").get(getAllCharacters).post(createCharacter);
router
  .route("/:id")
  .get(getCharacter)
  .put(updateCharacter)
  .delete(deleteCharacter);

export { router };
