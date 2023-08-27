const express = require("express");
const app = express();
const mongoose = require("mongoose");
const userRouter = require("./routes/userRoutes");
const { notFound, handleError } = require("./middlewares/errorHandler");
const cookieParser = require("cookie-parser");
const adminRouter = require("./routes/adminRoutes");
const { superAdminRouter } = require("./routes/superAdminRoutes");
require("dotenv").config();

/********************************************
PARSE THE INCOMING REQUESTS WITH JSON PAYLOAD
*********************************************/
app.use(express.json());

/--------------------------------------------------/;

/**************************************************
PARSE COOKIES ATTACHED TO THE CLIENT REQUEST OBJECT
***************************************************/
app.use(cookieParser());

/--------------------/;

/********************
USING THE USER ROUTES
*********************/
app.use("/api/super-admin", superAdminRouter);
app.use("/api/admin", adminRouter);
app.use("/api/user", userRouter);

/--------------------/;

/********************
CUSTOM ERROR HANDLERS
*********************/
app.use(notFound);
app.use(handleError);

/--------------------------------------------------------------------------/;

/**************************************************************************
ACCESSING AND ASSIGNING THE PORT AND MONGODB_URL USING ENVIRONMENT VARIABLE
***************************************************************************/
const PORT = process.env.PORT || 2002;
const mongodb_uri = process.env.MONGODB_URI;

/--------------------------------------------------/;

/**************************************************
CONNECTING THE MONGODB ATLAS DATABASE WITH MONGOOSE
***************************************************/
mongoose
  .connect(mongodb_uri)
  .then(console.log("Database Connected!"))
  .then(
    app.listen(PORT, () => {
      console.log(`https://localhost:${PORT}`);
    })
  );
