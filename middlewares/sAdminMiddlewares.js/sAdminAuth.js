const { verifyJwtToken } = require("../../config/verifyJwtToken");
const SuperAdmin = require("../../models/superAdminSchema");
const asyncHandler = require("express-async-handler");

const isSAdminAuth = asyncHandler(async (req, res, next) => {
  try {
    let token = req.cookies.authToken;
    if (!token) {
      res.status(404);
      throw new Error("Please Login!");
    }

    //verify the token
    const verifiedSAdminToken = verifyJwtToken(token);
    if (!verifiedSAdminToken) {
      res.status(401);
      throw new Error("Unauthorized! Invalid Token");
    }

    // get user id from token
    const superAdmin = await SuperAdmin.findById(verifiedSAdminToken.id);

    if (!superAdmin) {
      res.status(404);
      throw new Error("Not Found!");
    }

    if (superAdmin.role !== "superAdmin") {
      res.status(401);
      throw new Error("Super Admin Only!");
    }
    next();
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = { isSAdminAuth };
