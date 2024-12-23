"use strict";

import jwt from "jsonwebtoken";
import { AppError } from "../utils/appError.js";
import { catchAsync } from "../utils/catchAsync.js";
import { User } from "./../models/userModel.js";

function responseWithUser(user, statusCode, res) {
  user = { id: user._id, proUser: user.proUser };

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.status(statusCode).json({
    status: "success",
    token,
    data: { user },
  });
}

const signup = catchAsync(async (req, res, next) => {
  const { email, password, passwordConfirm } = req.body;
  const newUser = await User.create({ email, password, passwordConfirm });

  responseWithUser(newUser, 201, res);
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(new AppError("Please provide email and password", 400));

  const user = await User.findOne({ email });
  const isCorrect = user
    ? user.correctPassword(password, user.password)
    : false;

  if (!user || !isCorrect)
    return next(new AppError("Incorrect email or password", 401));

  responseWithUser(user, 200, res);
});

export { signup, login };
