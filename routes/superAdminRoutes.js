const express = require("express");
const {
  signupSuperAdmin,
  loginSuperAdmin,
  superAdminProfile,
  createAdmins,
  getSuperAdminUsers,
  blockSAdminUser,
  unBlockSAdminUser,
  deleteAdmins,
} = require("../controllers/sAdminControllers");
const superAdminRouter = express.Router();

superAdminRouter.post("/signup", signupSuperAdmin);
superAdminRouter.post("/login", loginSuperAdmin);
superAdminRouter.get("/:id", superAdminProfile);
superAdminRouter.post("/create-admin", createAdmins);
superAdminRouter.get("/get-admins/:id", getSuperAdminUsers);
superAdminRouter.put("/block/:id", blockSAdminUser);
superAdminRouter.put("/unblock/:id", unBlockSAdminUser);
superAdminRouter.delete("/delete-admin/:id", deleteAdmins);

module.exports = { superAdminRouter };
