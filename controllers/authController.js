"use strict";

import { AppError } from "../utils/appError.js";
import { catchAsync } from "../utils/catchAsync.js";
import { User } from "./../models/userModel.js";

function responseWithUser(user, statusCode, res) {
  user = { id: user._id, proUser: user.proUser };

  res.status(statusCode).json({
    status: "success",
    data: { user },
  });
}

const signup = catchAsync(async (req, res, next) => {
  const { email, password, passwordConfirm } = req.body;
  const newUser = await User.create({ email, password, passwordConfirm });

  responseWithUser(newUser, 201, res);
});

export { signup };
