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

const protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  )
    token = req.headers.authorization.split(" ")[1];

  if (!token)
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const freshUser = await User.findById(decoded.id);

  if (!freshUser)
    return next(
      new AppError(
        "The user belonging to this token does no longer exist.",
        401
      )
    );

  if (freshUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("User recently changed password! Please log in again.", 401)
    );
  }

  req.user = freshUser;

  next();
});

const reset = catchAsync(async (req, res, next) => {
  const email = req.body.email;
  const user = User.findOne({ email });

  if (!user)
    return next(new AppError("There is no user with email address.", 404));

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetPassword/${resetToken}`;
  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;
  const subject = `Your password reset token (valid for ${process.env.RESET_TOKEN_EXPIRES_IN} min)`;

  try {
    await sendEmail({ email: user.email, subject, message });

    res.status(200).json({
      status: "success",
      message: "Token sent to email!",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    return next(
      new AppError(
        "There was an error sending the email. Try again later!",
        500
      )
    );
  }
});

export { signup, login, protect, reset };
