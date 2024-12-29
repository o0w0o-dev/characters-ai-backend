"use strict";

import crypto from "crypto";
import jwt from "jsonwebtoken";
import { promisify } from "util";
import { AppError } from "../utils/appError.js";
import { catchAsync } from "../utils/catchAsync.js";
import { sendEmail } from "./../utils/email.js";
import { User } from "./../models/userModel.js";

function responseWithUser(user, statusCode, res) {
  user = { id: user._id, proUser: user.proUser };

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.cookie("jwt", token, cookieOptions);

  res.status(statusCode).json({
    status: "success",
    token,
    data: { user },
  });
}

const signup = catchAsync(async (req, res, next) => {
  const email = req.body.email?.toLowerCase();
  const { password, passwordConfirm } = req.body;
  if (!email || !password || !passwordConfirm)
    return next(new AppError("Please provide email and password", 400));

  const isExist = !!(await User.findOne({ email }));
  if (isExist) return next(new AppError("The user already exists", 400));

  const newUser = await User.create({ email, password, passwordConfirm });

  responseWithUser(newUser, 201, res);
});

const login = catchAsync(async (req, res, next) => {
  const email = req.body.email?.toLowerCase();
  const { password } = req.body;
  if (!email || !password)
    return next(new AppError("Please provide email and password", 400));

  const user = await User.findOne({ email });
  const isCorrect = user
    ? await user.correctPassword(password, user.password)
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
      new AppError("You are not logged in! Please log in to get access", 401)
    );

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const freshUser = await User.findById(decoded.id);

  if (!freshUser)
    return next(
      new AppError("The user belonging to this token does no longer exist", 401)
    );

  if (freshUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("User recently changed password! Please log in again", 401)
    );
  }

  req.user = freshUser;

  next();
});

const forgotPassword = catchAsync(async (req, res, next) => {
  const email = req.body.email?.toLowerCase();
  if (!email)
    return next(new AppError("There is no user with email address", 404));

  const user = await User.findOne({ email });
  if (!user)
    return next(new AppError("There is no user with email address", 404));

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
      message: "Token sent to email",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    console.log({ sendEmail: err });

    return next(
      new AppError("There was an error sending the email. Try again later", 500)
    );
  }
});

const resetPassword = catchAsync(async (req, res, next) => {
  const token = req.params.token;
  if (!token) return next(new AppError("Token is invalid or has expired", 400));

  const { password, passwordConfirm } = req.body;
  if (!password || !passwordConfirm || password !== passwordConfirm)
    return next(new AppError("Please provide valid password", 400));

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) return next(new AppError("Token is invalid or has expired", 400));

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.resetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  responseWithUser(user, 200, res);
});

const updatePassword = catchAsync(async (req, res, next) => {
  const { passwordCurrent, password, passwordConfirm } = req.body;
  if (
    !passwordCurrent ||
    !password ||
    !passwordConfirm ||
    password !== passwordConfirm
  )
    return next(new AppError("Please provide valid password", 400));

  const user = await User.findById(req.user._id);
  if (!user) return next(new AppError("User not found", 404));

  const isCorrect = await user.correctPassword(passwordCurrent, user.password);

  if (!isCorrect)
    return next(new AppError("Your current password is wrong", 401));

  user.password = password;
  user.passwordConfirm = passwordConfirm;
  await user.save();

  responseWithUser(user, 200, res);
});

export {
  signup,
  login,
  protect,
  forgotPassword,
  resetPassword,
  updatePassword,
};
