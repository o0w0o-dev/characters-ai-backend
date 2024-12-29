"use strict";

import { AppError } from "../utils/appError.js";
import { catchAsync } from "../utils/catchAsync.js";
import { responseWithUser } from "../utils/responseWithUser.js";
import { User } from "../models/userModel.js";

const getUser = catchAsync(async (req, res) => {
  let user = await User.findById(req.params?.id);

  if (!user) {
    return next(new AppError("Invalid ID", 404));
  }

  responseWithUser(user, 200, res);
});

export { getUser };
