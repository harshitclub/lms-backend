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
const adminRouter = express.Router();

// adminRouter.post("/signup", signupAdmin);
adminRouter.post("/login", adminLogin);
adminRouter.get("/:id", getAdmin);
adminRouter.put("/update-profile/:id", updateProfile);
adminRouter.put("/block/:id", blockUser);
adminRouter.put("/unblock/:id", unBlockUser);
adminRouter.put("/change-password/:id", changePassword);
adminRouter.delete("/delete-profile/:id", deleteAdminUser);
adminRouter.post("/create-user", createUser);
adminRouter.get("/get-users/:id", getAdminUsers);

module.exports = adminRouter;
