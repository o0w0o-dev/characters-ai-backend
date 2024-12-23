"use strict";

import { AppError } from "../utils/appError.js";
import { catchAsync } from "../utils/catchAsync.js";
import { User } from "../models/userModel.js";

const getUser = catchAsync(async (req, res) => {
  let user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError("Invalid ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: { user },
  });
});

export { getUser };
