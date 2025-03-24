import mongoose from "mongoose";
// import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationCode: {
      type: String,
    },
    verificationExpires: {
      type: Date,
    },
    resetCode: {
      type: String,
    },
    resetCodeExpires: {
      type: Date,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// userSchema.methods.generateToken = async function () {
//   try {
//     return jwt.sign(
//       {
//         userId: this._id.toString(),
//         email: this.email,
//         isAdmin: this.isAdmin,
//       },
//       process.env.secret_key,
//       {
//         expiresIn: "30d",
//       }
//     );
//   } catch (error) {
//     console.error("Token Error: ", error);
//   }
// };

const User = new mongoose.model("User", userSchema);

export default User;
