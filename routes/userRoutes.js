const express = require("express");
const {
  // signupUser,
  loginUser,
  // getAllUsers,
  updateUser,
  // deleteUser,
  getUser,
  changePassword,
  // blockUser,
  // unBlockUser,
} = require("../controllers/userControllers");
const { isLogin } = require("../middlewares/authMiddleware");
const userRouter = express.Router();

/--------------------------------------------------------------------------/;
/***********
POST REQUEST
************/
// userRouter.post("/signup", signupUser);
userRouter.post("/login", loginUser);

/--------------------------------------------------------------------------/;
/**********
GET REQUEST
***********/
// userRouter.get("/get-users", isAdmin, getAllUsers);
userRouter.get("/:id", isLogin, getUser);

/--------------------------------------------------------------------------/;
/**********
PUT REQUEST
***********/
userRouter.put("/update-profile/:id", isLogin, updateUser);
// userRouter.put("/block/:id", isAdmin, blockUser);
// userRouter.put("/unblock/:id", isAdmin, unBlockUser);
userRouter.put("/change-password/:id", isLogin, changePassword);

/--------------------------------------------------------------------------/;
/*************
DELETE REQUEST
**************/
// userRouter.delete("/delete-profile/:id", isAdmin, deleteUser);

module.exports = userRouter;
