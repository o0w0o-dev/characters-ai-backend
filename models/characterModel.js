"use strict";

import mongoose from "mongoose";

const characterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Must have a name"],
    unique: true,
    trim: true,
    maxlength: [25, "The name must have less or equal then 25 characters"],
    minlength: [4, "The name must have more or equal then 4 characters"],
  },
  model: {
    type: String,
    default: "Model_A",
    enum: {
      values: ["Model_A", "Model_B", "Model_C"], // TODO: remove dev data
      message: "Model is either: Model_A, Model_B, Model_C",
    },
  },
  instructions: {
    type: String,
    trim: true,
    default: "I want you act as a helpful assistant.",
    maxlength: [
      250,
      "The instructions must have less or equal then 250 characters",
    ],
    minlength: [
      4,
      "The instructions must have more or equal then 4 characters",
    ],
  },
  avatar: {
    type: String,
    trim: true,
    default: "https://uploads.dailydot.com/2018/10/olli-the-polite-cat.jpg", // TODO: remove dev data
  },
  userId: {
    type: String,
    required: [true, "Must belong to a user"],
  },
  created_at: {
    type: Date,
    default: Date.now(),
  },
  updated_at: {
    type: Date,
    validate: {
      validator: function (val) {
        return !this.deleted_at || val < this.deleted_at;
      },
      message: "Cannot update after deleted.",
    },
  },
  deleted_at: {
    type: Date,
  },
});

// remove "__v" field in return
characterSchema.pre(/^find/, function (next) {
  this.select("-__v");
  next();
});

const Character = mongoose.model("Character", characterSchema);

export { Character };
