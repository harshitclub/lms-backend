const Admin = require("../models/adminSchema");
const User = require("../models/userSchema");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validateMongoId } = require("../config/validateMongoId");
const { default: mongoose } = require("mongoose");
const { verifyJwtToken } = require("../config/verifyJwtToken");

/--------------------------------------------------------------------------/;

/****************
ADMIN REGISTRATION
*****************/

// const signupAdmin = asyncHandler(async (req, res) => {
//   /* Get the email from req.body and find whether a user with this email exists or not */
//   const {
//     companyName,
//     profileImage,
//     email,
//     phone,
//     business,
//     role,
//     address,
//     city,
//     state,
//     country,
//     zip,
//     gstin,
//     website,
//     password,
//   } = req.body;

//   const findAdmin = await Admin.findOne({ email: email });
//   if (!findAdmin) {
//     const salt = await bcrypt.genSalt(5);
//     const hashPassword = await bcrypt.hash(password, salt);
//     // create the user
//     const newAdmin = new Admin({
//       companyName,
//       profileImage,
//       email,
//       phone,
//       business,
//       role,
//       address,
//       city,
//       state,
//       country,
//       zip,
//       gstin,
//       website,
//       password: hashPassword,
//     });
//     await newAdmin.save();
//     res.status(201).json({
//       status: true,
//       message: "Signup Success!",
//       newAdmin,
//     });
//   } else {
//     throw new Error("User Already Exists!");
//   }
// });

/--------------------------------------------------------------------------/;

/*********************
ADMIN CREATE ITS USERS
**********************/

const createUser = asyncHandler(async (req, res) => {
  /* Get the email from req.body and find whether a user with this email exists or not */
  const {
    firstName,
    lastName,
    profileImage,
    email,
    phone,
    profession,
    role,
    isBlocked,
    password,
  } = req.body;
  const findUser = await User.findOne({ email: email });

  if (!findUser) {
    const salt = await bcrypt.genSalt(5);
    const hashPassword = await bcrypt.hash(password, salt);

    // admin functionality
    const adminToken = req.cookies.authToken;
    const verifyAdminId = verifyJwtToken(adminToken);
    const adminId = verifyAdminId.id;
    const isAdmin = await Admin.findById(adminId);
    validateMongoId(adminId);

    // create the user
    const newUser = new User({
      firstName,
      lastName,
      profileImage,
      email,
      phone,
      profession,
      role,
      isBlocked,
      password: hashPassword,
      admin: isAdmin._id,
    });
    try {
      const session = await mongoose.startSession();
      session.startTransaction();
      await newUser.save({ session });
      isAdmin.users.push(newUser);
      await isAdmin.save({ session });
      await session.commitTransaction();
    } catch (error) {
      return console.log(error.message);
    }
    await newUser.save();
    res.status(201).json({
      status: true,
      message: "Signup Success!",
      newUser,
    });
  } else {
    throw new Error("User Already Exists!");
  }
});

/--------------------------------------------------------------------------/;

/********************
ADMIN FETCH ITS USERS
*********************/

const getAdminUsers = asyncHandler(async (req, res) => {
  const adminId = req.params.id;
  validateMongoId(adminId);
  try {
    const adminUsers = await Admin.findById(adminId).populate("users");
    if (!adminUsers) {
      return res.status(404).json({ message: "No Users Found!" });
    }
    return res.status(200).json({ users: adminUsers.users });
  } catch (error) {
    throw new Error(error);
  }
});

/--------------------------------------------------------------------------/;

/**********
ADMIN LOGIN
***********/

const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  //   check if user exists or not
  if (!email && !password) {
    throw new Error("All Fields Are Required...");
  }
  const adminExists = await Admin.findOne({ email: email });
  if (!adminExists) {
    throw new Error("User Not Found!");
  }
  const isCorrectPassword = await bcrypt.compare(
    password,
    adminExists.password
  );
  if (!isCorrectPassword) {
    throw new Error("Wrong Credentials!");
  }
  if (isCorrectPassword) {
    const tokenData = {
      id: adminExists._id,
      email: adminExists.email,
      role: adminExists.role,
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
      role: adminExists?.role,
      name: adminExists?.companyName,
      id: adminExists?._id,
    });
  } else {
    throw new Error("Invalid Credentials!");
  }
});

/--------------------------------------------------------------------------/;

/******************
ADMIN PROFILE FETCH
*******************/

const getAdmin = asyncHandler(async (req, res) => {
  const adminId = req.params.id;
  validateMongoId(adminId);

  try {
    const admin = await Admin.findById(adminId);
    if (!admin) {
      throw new Error("User Not Found!");
    }
    res.status(200).json({ status: true, message: "User Found", admin });
  } catch (error) {
    throw new Error(error);
  }
});

/--------------------------------------------------------------------------/;

/*******************
ADMIN BLOCK ITS USER
********************/

const blockUser = asyncHandler(async (req, res) => {
  const cookieToken = req.cookies.authToken;
  const verifyToken = verifyJwtToken(cookieToken);
  const userId = req.params.id;
  validateMongoId(userId);
  if (verifyToken.id === userId) {
    throw new Error("You Cannot Block Yourself!");
  }
  try {
    await User.findByIdAndUpdate(userId, { isBlocked: true }, { new: true });
    res.status(200).json({ status: true, message: "User Blocked!" });
  } catch (error) {
    throw new Error(error);
  }
});

/--------------------------------------------------------------------------/;

/*********************
ADMIN UNBLOCK ITS USER
**********************/

const unBlockUser = asyncHandler(async (req, res) => {
  const cookieToken = req.cookies.authToken;
  const verifyToken = verifyJwtToken(cookieToken);
  const userId = req.params.id;
  if (verifyToken.id === userId) {
    throw new Error("You Cannot Unblock Yourself!");
  }
  validateMongoId(userId);
  try {
    await User.findByIdAndUpdate(userId, { isBlocked: false }, { new: true });
    res.status(200).json({ status: true, message: "User Unblocked!" });
  } catch (error) {
    throw new Error(error);
  }
});

/--------------------------------------------------------------------------/;

/***********************
ADMIN UPDATE ITS PROFILE
************************/

const updateProfile = asyncHandler(async (req, res) => {
  const adminId = req.params.id;
  validateMongoId(adminId);
  const adminToken = req.cookies.authToken;
  const adminTokenId = verifyJwtToken(adminToken);
  try {
    if (adminTokenId.id === adminId) {
      const admin = await Admin.findByIdAndUpdate(adminId, req.body, {
        new: true,
      });
      res.status(200).json({ status: true, message: "Profile Updated", admin });
    } else {
      throw new Error("Only Update Self Account");
    }
  } catch (error) {
    throw new Error(error);
  }
});

/--------------------------------------------------------------------------/;

/********************
ADMIN DELETE ITS USER
*********************/

const deleteAdminUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  validateMongoId(userId);
  const adminToken = req.cookies.authToken;
  const verifyToken = verifyJwtToken(adminToken);
  if (verifyToken.id === userId) {
    throw new Error("You Cannot Delete Yourself!");
  }
  try {
    const user = await User.findByIdAndDelete({ _id: userId }).populate(
      "admin"
    );
    if (!user) {
      return res
        .status(400)
        .json({ message: "somthing went wrong! or User Not Found" });
    }
    await user.admin.users.pull(user);
    await user.admin.save();
    return res.status(200).json({ message: "User Deleted" });
  } catch (error) {
    throw new Error(error);
  }
});

/--------------------------------------------------------------------------/;

/*************************
ADMIN CHANGE SELF PASSWORD
**************************/

const changePassword = asyncHandler(async (req, res) => {
  const adminId = req.params.id;
  validateMongoId(adminId);
  const { password, newPassword } = req.body;
  if (!password && !newPassword) {
    throw new Error("All fields are required!");
  }
  if (password === newPassword) {
    throw new Error("Do Not Provide Previous Password as New Password!");
  }
  try {
    const admin = await Admin.findById(adminId);
    const isCorrectPassword = await bcrypt.compare(password, admin.password);
    if (!isCorrectPassword) {
      res.status(406);
      throw new Error("Invalid Current Password!");
    }

    const salt = await bcrypt.genSalt(5);
    const hashPassword = await bcrypt.hash(newPassword, salt);
    admin.password = hashPassword;
    await admin.save();
    res
      .status(200)
      .json({ status: true, message: "Password Change Successfully" });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  // signupAdmin,
  adminLogin,
  getAdmin,
  blockUser,
  unBlockUser,
  updateProfile,
  deleteAdminUser,
  changePassword,
  createUser,
  getAdminUsers,
};
