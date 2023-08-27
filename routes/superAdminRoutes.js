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
const {
  isSAdminAuth,
} = require("../middlewares/sAdminMiddlewares.js/sAdminAuth");
const superAdminRouter = express.Router();

/--------------------------------------------------------------------------/;
/***********
POST REQUEST
************/
superAdminRouter.post("/signup", signupSuperAdmin);
superAdminRouter.post("/login", loginSuperAdmin);
superAdminRouter.post("/create-admin", isSAdminAuth, createAdmins);

/--------------------------------------------------------------------------/;
/**********
GET REQUEST
***********/
superAdminRouter.get("/:id", isSAdminAuth, superAdminProfile);
superAdminRouter.get("/get-admins/:id", isSAdminAuth, getSuperAdminUsers);

/--------------------------------------------------------------------------/;
/**********
PUT REQUEST
***********/
superAdminRouter.put("/block/:id", isSAdminAuth, blockSAdminUser);
superAdminRouter.put("/unblock/:id", isSAdminAuth, unBlockSAdminUser);
superAdminRouter.delete("/delete-admin/:id", isSAdminAuth, deleteAdmins);

module.exports = { superAdminRouter };
