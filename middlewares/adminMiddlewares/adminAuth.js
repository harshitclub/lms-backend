const { verifyJwtToken } = require("../../config/verifyJwtToken");
const Admin = require("../../models/adminSchema");
const asyncHandler = require("express-async-handler");

const isAdminAuth = asyncHandler(async (req, res, next) => {
  try {
    let token = req.cookies.authToken;
    if (!token) {
      res.status(404);
      throw new Error("Please Login!");
    }

    //verify the token
    const verifiedAdminToken = verifyJwtToken(token);
    if (!verifiedAdminToken) {
      res.status(401);
      throw new Error("Unauthorized! Invalid Token");
    }

    // get user id from token
    const admin = await Admin.findById(verifiedAdminToken.id);

    if (!admin) {
      res.status(404);
      throw new Error("Not Found!");
    }

    if (admin.role !== "admin") {
      res.status(401);
      throw new Error("Admin Only!");
    }
    next();
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = { isAdminAuth };
