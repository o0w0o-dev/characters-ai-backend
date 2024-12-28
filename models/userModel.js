"use strict";

import bcrypt from "bcryptjs";
import crypto from "crypto";
import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    lowercase: true,
    maxlength: [60, "The email must have less or equal then 60 characters"],
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  proUser: {
    type: Boolean,
    default: false,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: [8, "The password must have more or equal then 8 characters"],
    maxlength: [60, "The password must have less or equal then 60 characters"],
    validate: {
      validator: function (el) {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]+$/.test(el);
      },
      message:
        "The password contain at least 1 character of each: a-z, A-Z, 0-9",
    },
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same",
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;

  next();
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.methods.correctPassword = async function (
  plainTextPassword,
  userPassword
) {
  return await bcrypt.compare(plainTextPassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = this.passwordChangedAt.getTime();
    return JWTTimestamp * 1000 < changedTimestamp;
  }

  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires =
    Date.now() + process.env.RESET_TOKEN_EXPIRES_IN * 60 * 1000;

  return resetToken;
};

const User = mongoose.model("User", userSchema);

export { User };
