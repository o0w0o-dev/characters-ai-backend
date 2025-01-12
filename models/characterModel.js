"use strict";

import mongoose from "mongoose";

const characterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Must have a name"],
    trim: true,
    maxlength: [25, "The name must have less or equal then 25 characters"],
    minlength: [4, "The name must have more or equal then 4 characters"],
  },
  model: {
    type: String,
    required: [true, "Must have a model ID"],
    trim: true,
    maxlength: [
      100,
      "The model ID must have less or equal then 100 characters",
    ],
    minlength: [1, "The model ID must have more or equal then 1 characters"],
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
    default: "https://s3.us-east-1.amazonaws.com/o0w0o.com/cat.jpg", // TODO: remove dev data
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
