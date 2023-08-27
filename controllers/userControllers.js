const User = require("../models/userSchema");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validateMongoId } = require("../config/validateMongoId");

/--------------------------------------------------------------------------/;

/****************
USER REGISTRATION
*****************/

// const signupUser = asyncHandler(async (req, res) => {
//   /* Get the email from req.body and find whether a user with this email exists or not */
//   const {
//     firstName,
//     lastName,
//     profileImage,
//     email,
//     phone,
//     profession,
//     role,
//     isBlocked,
//     password,
//   } = req.body;
//   const findUser = await User.findOne({ email: email });

//   if (!findUser) {
//     const salt = await bcrypt.genSalt(5);
//     const hashPassword = await bcrypt.hash(password, salt);
//     // create the user
//     const newUser = new User({
//       firstName,
//       lastName,
//       profileImage,
//       email,
//       phone,
//       profession,
//       role,
//       isBlocked,
//       password: hashPassword,
//     });
//     await newUser.save();
//     res.status(201).json({
//       status: true,
//       message: "Signup Success!",
//       newUser,
//     });
//   } else {
//     throw new Error("User Already Exists!");
//   }
// });

/--------------------------------------------------------------------------/;

/*********
USER LOGIN
**********/

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  //   check if user exists or not
  if (!email && !password) {
    throw new Error("All Fields Are Required...");
  }
  const userExists = await User.findOne({ email: email });
  const isCorrectPassword = await bcrypt.compare(password, userExists.password);
  if (isCorrectPassword) {
    const tokenData = {
      id: userExists._id,
      email: userExists.email,
      role: userExists.role,
    };
    const jwtToken = jwt.sign(tokenData, process.env.JWTSECRET, {
      expiresIn: "1d",
    });
    res.cookie("authToken", jwtToken, {
      expires: new Date(Date.now() + 9000000),
      httpOnly: true,
    });
    return res.status(200).json({
      status: true,
      message: "Login Success!",
      token: jwtToken,
      role: userExists?.role,
      name: userExists?.firstName + " " + userExists?.lastName,
      id: userExists?._id,
    });
  } else {
    throw new Error("Invalid Credentials!");
  }
});

/--------------------------------------------------------------------------/;

/*********
GET A USER
**********/

const getUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  validateMongoId(userId);

  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User Not Found!");
    }
    res.status(200).json({ status: true, message: "User Found", user });
  } catch (error) {
    throw new Error(error);
  }
});

/--------------------------------------------------------------------------/;

/*************************
GET ALL USERS (ADMIN ONLY)
**************************/

// const getAllUsers = asyncHandler(async (req, res) => {
//   try {
//     const allUsers = await User.find();
//     res
//       .status(200)
//       .json({ status: true, message: "All Users Fetched", allUsers });
//   } catch (error) {
//     throw new Error(error);
//   }
// });

/--------------------------------------------------------------------------/;

/**********************
BLOCK USER (ADMIN ONLY)
***********************/

// const blockUser = asyncHandler(async (req, res) => {
//   const cookieToken = req.cookies.authToken;
//   const verifyToken = jwt.verify(cookieToken, process.env.JWTSECRET);
//   const userId = req.params.id;
//   validateMongoId(userId);
//   if (verifyToken.id === userId) {
//     throw new Error("You Cannot Block Yourself!");
//   }
//   try {
//     await User.findByIdAndUpdate(userId, { isBlocked: true }, { new: true });
//     res.status(200).json({ status: true, message: "User Blocked!" });
//   } catch (error) {
//     throw new Error(error);
//   }
// });

/--------------------------------------------------------------------------/;

/************************
UNBLOCK USER (ADMIN ONLY)
*************************/

// const unBlockUser = asyncHandler(async (req, res) => {
//   const cookieToken = req.cookies.authToken;
//   const verifyToken = jwt.verify(cookieToken, process.env.JWTSECRET);
//   const userId = req.params.id;
//   if (verifyToken.id === userId) {
//     throw new Error("You Cannot Unblock Yourself!");
//   }
//   validateMongoId(userId);
//   try {
//     await User.findByIdAndUpdate(userId, { isBlocked: false }, { new: true });
//     res.status(200).json({ status: true, message: "User Unblocked!" });
//   } catch (error) {
//     throw new Error(error);
//   }
// });

/--------------------------------------------------------------------------/;

/******************
UPDATE USER PROFILE
*******************/

const updateUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  validateMongoId(userId);
  try {
    const user = await User.findByIdAndUpdate(userId, req.body, { new: true });
    res.status(200).json({ status: true, message: "Profile Updated", user });
  } catch (error) {
    throw new Error(error);
  }
});

/--------------------------------------------------------------------------/;

/***************************
DELETE THE USER (ADMIN ONLY)
****************************/

// const deleteUser = asyncHandler(async (req, res) => {
//   const userId = req.params.id;
//   validateMongoId(userId);
//   try {
//     await User.findByIdAndDelete(userId);
//     res.status(200).json({ status: true, messag: "Profile Deleted" });
//   } catch (error) {
//     throw new Error(error);
//   }
// });

/--------------------------------------------------------------------------/;

/**************
CHANGE PASSWORD
***************/

const changePassword = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  validateMongoId(userId);
  const { password, newPassword } = req.body;
  if (!password && !newPassword) {
    throw new Error("All fields are required!");
  }
  if (password === newPassword) {
    throw new Error("Do Not Provide Previous Password as New Password!");
  }
  try {
    const user = await User.findById(userId);
    const isCorrectPassword = await bcrypt.compare(password, user.password);
    if (!isCorrectPassword) {
      res.status(406);
      throw new Error("Invalid Current Password!");
    }

    const salt = await bcrypt.genSalt(5);
    const hashPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashPassword;
    await user.save();
    res
      .status(200)
      .json({ status: true, message: "Password Change Successfully" });
  } catch (error) {
    throw new Error(error);
  }
});

/--------------------------------------------------------------------------/;

module.exports = {
  // signupUser,
  loginUser,
  // getAllUsers,
  updateUser,
  // deleteUser,
  getUser,
  changePassword,
  // blockUser,
  // unBlockUser,
};
