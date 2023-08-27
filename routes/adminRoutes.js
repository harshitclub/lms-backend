const express = require("express");
const {
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
} = require("../controllers/adminControllers");
const { isAdminAuth } = require("../middlewares/adminMiddlewares/adminAuth");
const adminRouter = express.Router();

/--------------------------------------------------------------------------/;
/***********
POST REQUEST
************/
// adminRouter.post("/signup", signupAdmin);
adminRouter.post("/login", adminLogin);
adminRouter.post("/create-user", isAdminAuth, createUser);

/--------------------------------------------------------------------------/;
/**********
GET REQUEST
***********/
adminRouter.get("/:id", isAdminAuth, getAdmin);
adminRouter.get("/get-users/:id", isAdminAuth, getAdminUsers);

/--------------------------------------------------------------------------/;
/**********
PUT REQUEST
***********/
adminRouter.put("/update-profile/:id", isAdminAuth, updateProfile);
adminRouter.put("/block/:id", isAdminAuth, blockUser);
adminRouter.put("/unblock/:id", isAdminAuth, unBlockUser);
adminRouter.put("/change-password/:id", isAdminAuth, changePassword);

/--------------------------------------------------------------------------/;
/*************
DELETE REQUEST
**************/
adminRouter.delete("/delete-profile/:id", isAdminAuth, deleteAdminUser);

module.exports = adminRouter;
