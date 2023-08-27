const User = require("../models/userSchema");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

/--------------------------------------------------------------------------/;

/*********************
LOGIN CHECK MIDDLEWARE
**********************/

const isLogin = asyncHandler(async (req, res, next) => {
  try {
    let token = req.cookies.authToken;

    if (!token) {
      res.status(404);
      throw new Error("Token Not Found! Please Login...");
    }

    // verify the token
    const verifiedUserToken = jwt.verify(token, process.env.JWTSECRET);

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
    next();
  } catch (error) {
    throw new Error(error);
  }
});

/--------------------------------------------------------------------------/;

/*********************
ADMIN CHECK MIDDLEWARE
**********************/

const isAdmin = asyncHandler(async (req, res, next) => {
  try {
    let token = req.cookies.authToken;

    if (!token) {
      res.status(404);
      throw new Error("Token Not Found! Please Login...");
    }

    // verify the token
    const verifiedUserToken = jwt.verify(token, process.env.JWTSECRET);

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

    if (user.role !== "admin") {
      res.status(401);
      throw new Error("Unauthorized! Admin Only...");
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
    const verifiedUserToken = jwt.verify(token, process.env.JWTSECRET);

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

module.exports = { isLogin, isAdmin, isInstructor };
