const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: [true, "Please Enter Company Name"],
      trim: true,
    },
    profileImage: {
      type: String,
      default:
        "https://assets.stickpng.com/thumbs/585e4beacb11b227491c3399.png",
    },
    email: {
      type: String,
      required: [true, "Please Enter Company Email Address"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please Enter A Valid Email",
      ],
    },
    phone: {
      type: Number,
      required: [true, "Please Enter Company Phone Number"],
      unique: true,
      maxLength: 10,
      trim: true,
    },
    business: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      default: "admin",
    },
    address: {
      type: String,
      trim: true,
      default: "",
    },
    city: {
      type: String,
      default: "",
    },
    state: {
      type: String,
      default: "",
    },
    country: {
      type: String,
      default: "",
    },
    zip: {
      type: String,
      default: "",
    },
    gstin: {
      type: String,
      default: "",
    },
    website: {
      type: String,
      trim: true,
      default: "",
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      required: true,
    },
    superAdmin: {
      type: mongoose.Types.ObjectId,
      ref: "SuperAdmin",
      required: true,
    },
    users: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
    passwordChangeAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    stripe_account_id: String,
    stripe_seller: {},
    stripeSession: {},
  },
  {
    timestamps: true,
  }
);

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
