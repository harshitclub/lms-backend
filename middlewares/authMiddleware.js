const User = require("../models/userSchema");
const asyncHandler = require("express-async-handler");
const { verifyJwtToken } = require("../config/verifyJwtToken");

/--------------------------------------------------------------------------/;

/*********************
LOGIN CHECK MIDDLEWARE
**********************/

const isLogin = asyncHandler(async (req, res, next) => {
  try {
    let token = req.cookies.authToken;

    if (!token) {
      res.status(404);
      throw new Error("Please Login!");
    }

    // verify the token
    const verifiedUserToken = verifyJwtToken(token);

    if (!verifiedUserToken) {
      res.status(401);
      throw new Error("Unauthorized! Invalid Token");
    }

    // get user id from token
    const user = await User.findById(verifiedUserToken.id);

    if (!user) {
      res.status(404);
      throw new Error("User Not Found...");
    }
    next();
  } catch (error) {
    throw new Error(error);
  }
});

/--------------------------------------------------------------------------/;

/**************************
INSTRUCTOR CHECK MIDDLEWARE
***************************/

const isInstructor = asyncHandler(async (req, res, next) => {
  try {
    let token = req.cookies.authToken;

    if (!token) {
      res.status(404);
      throw new Error("Token Not Found! Please Login...");
    }

    // verify the token
    const verifiedUserToken = verifyJwtToken(token);

    if (!verifiedUserToken) {
      res.status(401);
      throw new Error("Unauthorized! Invalid Token...");
    }

    // get user id from token
    const user = await User.findById(verifiedUserToken.id);

    if (!user) {
      res.status(404);
      throw new Error("User Not Found...");
    }

    if (user.role !== "instructor") {
      res.status(401);
      throw new Error("Unauthorized! Instructor Only...");
    }

    next();
  } catch (error) {
    throw new Error(error);
  }
});

/--------------------------------------------------------------------------/;

module.exports = { isLogin, isInstructor };
