const SuperAdmin = require("../models/superAdminSchema");
const Admin = require("../models/adminSchema");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validateMongoId } = require("../config/validateMongoId");
const { default: mongoose } = require("mongoose");
const { verifyJwtToken } = require("../config/verifyJwtToken");

/--------------------------------------------------------------------------/;

/*****************
SUPER ADMIN SIGNUP
******************/

const signupSuperAdmin = asyncHandler(async (req, res) => {
  /* Get the email from req.body and find whether a user with this email exists or not */
  const { name, email, phone, password } = req.body;

  const findSuperAdmin = await SuperAdmin.findOne({ email: email });
  if (!findSuperAdmin) {
    const salt = await bcrypt.genSalt(5);
    const hashPassword = await bcrypt.hash(password, salt);
    //create super admin
    const newSuperAdmin = new SuperAdmin({
      name,
      email,
      phone,
      password: hashPassword,
    });
    await newSuperAdmin.save();
    res.status(201).json({
      status: true,
      message: "Singup Success!",
      newSuperAdmin,
    });
  } else {
    throw new Error("Something Went Wrong!");
  }
});

/--------------------------------------------------------------------------/;

/********************
GET SUPER ADMIN USERS
*********************/

const getSuperAdminUsers = asyncHandler(async (req, res) => {
  const superAdminId = req.params.id;
  validateMongoId(superAdminId);
  try {
    const superAdminUsers = await SuperAdmin.findById(superAdminId).populate(
      "admins"
    );
    if (!superAdminUsers) {
      return res.status(404).json({ message: "No Users Found!" });
    }
    return res.status(200).json({ admins: superAdminUsers.admins });
  } catch (error) {
    throw new Error(error);
  }
});

/--------------------------------------------------------------------------/;

/************
CREATE ADMINS
*************/

const createAdmins = asyncHandler(async (req, res) => {
  const {
    companyName,
    profileImage,
    email,
    phone,
    business,
    role,
    address,
    city,
    state,
    country,
    zip,
    gstin,
    website,
    password,
  } = req.body;

  const findAdmin = await Admin.findOne({ email: email });
  if (!findAdmin) {
    const salt = await bcrypt.genSalt(5);
    const hashPassword = await bcrypt.hash(password, salt);

    // super admin functionality
    const superAdminToken = req.cookies.authToken;
    const verifySAdmin = verifyJwtToken(superAdminToken);

    const superAdminId = verifySAdmin.id;

    const isSuperAdmin = await SuperAdmin.findById(superAdminId);

    validateMongoId(superAdminId);

    // create the user
    const newAdmin = new Admin({
      companyName,
      profileImage,
      email,
      phone,
      business,
      role,
      address,
      city,
      state,
      country,
      zip,
      gstin,
      website,
      password: hashPassword,
      superAdmin: isSuperAdmin._id,
    });
    try {
      const session = await mongoose.startSession();
      session.startTransaction();
      await newAdmin.save({ session });
      isSuperAdmin.admins.push(newAdmin);
      await isSuperAdmin.save({ session });
      await session.commitTransaction();
    } catch (error) {
      return console.log(error.message);
    }
    await newAdmin.save();
    res.status(201).json({
      status: true,
      message: "Signup Success!",
      newAdmin,
    });
  } else {
    throw new Error("User Already Exists!");
  }
});

/--------------------------------------------------------------------------/;

/***********************
DELETE SUPER ADMIN USERS
************************/

const deleteAdmins = asyncHandler(async (req, res) => {
  const adminId = req.params.id;
  validateMongoId(adminId);
  const sAdminToken = req.cookies.authToken;
  const verifyToken = verifyJwtToken(sAdminToken);
  if (verifyToken.id === adminId) {
    throw new Error("You Cannot Delete Yourself!");
  }
  try {
    const admin = await Admin.findByIdAndDelete({ _id: adminId }).populate(
      "superAdmin"
    );
    if (!admin) {
      return res
        .status(400)
        .json({ message: "Something Went Wrong! or User Not Found" });
    }
    await admin.superAdmin.admins.pull(admin);
    await admin.superAdmin.save();
    return res.status(200).json({ message: "User Deleted" });
  } catch (error) {
    throw new Error(error);
  }
});

/--------------------------------------------------------------------------/;

/****************
LOGIN SUPER ADMIN
*****************/

const loginSuperAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email && !password) {
    throw new Error("All Fields Are Required...");
  }
  try {
    const sAdminExists = await SuperAdmin.findOne({ email: email });
    if (!sAdminExists) {
      throw new Error("User Not Found!");
    }
    const isCorrectPassword = await bcrypt.compare(
      password,
      sAdminExists.password
    );
    if (!isCorrectPassword) {
      throw new Error("Wrong Credentials!");
    }

    const tokenData = {
      id: sAdminExists._id,
      email: sAdminExists.email,
      role: sAdminExists.role,
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
      role: sAdminExists?.role,
      name: sAdminExists?.name,
      id: sAdminExists?._id,
    });
  } catch (error) {
    throw new Error(error);
  }
});

/--------------------------------------------------------------------------/;

/******************
ADMIN PROFILE FETCH
*******************/

const superAdminProfile = asyncHandler(async (req, res) => {
  const superAdminId = req.params.id;
  validateMongoId(superAdminId);

  try {
    const superAdmin = await SuperAdmin.findById(superAdminId);
    if (!superAdmin) {
      throw new Error("User Not Found!");
    }
    res.status(200).json({
      status: true,
      message: `Welcome Super Admin ${superAdmin.name}`,
      superAdmin,
    });
  } catch (error) {
    throw new Error(error);
  }
});

/--------------------------------------------------------------------------/;

/**********
ADMIN BLOCK
***********/

const blockSAdminUser = asyncHandler(async (req, res) => {
  const cookieToken = req.cookies.authToken;
  const verifyToken = verifyJwtToken(cookieToken);

  const adminId = req.params.id;
  validateMongoId(adminId);

  if (verifyToken.id === adminId) {
    throw new Error("You Cannot Block Yourself!");
  }

  try {
    await Admin.findByIdAndUpdate(adminId, { isBlocked: true }, { new: true });
    res.status(200).json({ status: true, message: "Admin Blocked!" });
  } catch (error) {
    throw new Error(error);
  }
});

/--------------------------------------------------------------------------/;

/************
ADMIN UNBLOCK
*************/
const unBlockSAdminUser = asyncHandler(async (req, res) => {
  const cookieToken = req.cookies.authToken;
  const verifyToken = verifyJwtToken(cookieToken);

  const adminId = req.params.id;
  validateMongoId(adminId);

  if (verifyToken.id === adminId) {
    throw new Error("You Cannot Block Yourself!");
  }

  try {
    await Admin.findByIdAndUpdate(adminId, { isBlocked: false }, { new: true });
    res.status(200).json({ status: true, message: "Admin Unblocked!" });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  signupSuperAdmin,
  loginSuperAdmin,
  superAdminProfile,
  createAdmins,
  getSuperAdminUsers,
  blockSAdminUser,
  unBlockSAdminUser,
  deleteAdmins,
};
