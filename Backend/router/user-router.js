import express from "express";
import {
  register,
  login,
  getAuthUser,
  logout,
  verifyEmail,
  resendVerificationEmail,
  sendResetPassCode,
  resetPassword,
  resendResetPassCode,
} from "../controller/user-controller.js";
import { verifyToken } from "../middleware/auth-middleware.js";
import {
  emailValidation,
  loginValidation,
  resendVerificationEmailValidation,
  resetPasswordValidation,
  sendResetPassCodeValidation,
  signupValidation,
  verifyEmailValidation,
} from "../middleware/validate-middleware.js";

const authRouter = express.Router();

authRouter.get("/me", verifyToken, getAuthUser);
authRouter.post("/register", signupValidation, register);
authRouter.post("/login", loginValidation, login);
authRouter.post("/logout", verifyToken, logout);
authRouter.post("/verifyEmail", verifyEmailValidation, verifyEmail);
authRouter.post(
  "/resendCode",
  resendVerificationEmailValidation,
  resendVerificationEmail
);
authRouter.post(
  "/sendResetPassCode",
  sendResetPassCodeValidation,
  sendResetPassCode
);
authRouter.post("/resetPass", resetPasswordValidation, resetPassword);
authRouter.post("/resendResetPassCode", emailValidation, resendResetPassCode);

export default authRouter;
