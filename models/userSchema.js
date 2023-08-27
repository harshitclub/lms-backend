const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
      default:
        "https://assets.stickpng.com/thumbs/585e4beacb11b227491c3399.png",
    },
    email: {
      type: String,
      required: true,
      match: /^\S+@\S+\.\S+$/,
      unique: true,
    },
    phone: {
      type: Number,
      require: [true, "Please Enter Your Phone Number"],
      unique: true,
      trim: true,
    },
    profession: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "user",
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      required: true,
    },
    admin: {
      type: mongoose.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
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

/*********************************************************************************
THE PRE FUNCTION THAT IS USE TO HASH THE PASSWORD BEFORE SAVING IT TO THE DATABASE
**********************************************************************************/

// userSchema.pre("save", async function (next) {
//   const salt = await bcrypt.genSalt(5);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

const User = mongoose.model("User", userSchema);

module.exports = User;
