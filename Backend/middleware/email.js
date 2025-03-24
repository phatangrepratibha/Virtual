import {
  confirmPasswordResetEmailTemplate,
  forgotPasswordEmailTemplate,
  verificationEmailTemplate,
  welcomeEmailTemplate,
} from "../config/emailTemplate.js";
import { transporter } from "../config/nodemailer.config.js";
import dotenv from "dotenv";

dotenv.config();

export const sendVerificationCode = async (email, verificationCode) => {
  try {
    const emailBody = verificationEmailTemplate(verificationCode); //Call the function
    console.log("Generated Email Body: ", emailBody);

    const response = await transporter.sendMail({
      from: `"Bliss" <${process.env.EMAIL_USER}>`, // sender address
      to: email, // list of receivers
      subject: "Verify Your Email", // Subject line
      text: `Your Verification Code: ${verificationCode}`, // plain text body
      html: emailBody, //Pass Generated email body
    });
    console.log("Email Sent Successfully!!", response);
  } catch (error) {
    console.log("Error while sending Email!", error);
  }
};

export const sendWelcomeEmail = async (email, name) => {
  const emailBody = welcomeEmailTemplate(name); //Call the function
  console.log("Generated Email Body: ", emailBody);
  try {
    const response = await transporter.sendMail({
      from: `"Bliss" <${process.env.EMAIL_USER}>`, // sender address
      to: email, // list of receivers
      subject: "Welcome to Bliss!", // Subject line
      text: `Welcome, ${name}!`, // plain text body
      html: emailBody, //Pass Generated email body
    });
    console.log("Welcome Email Sent Successfully!!", response);
  } catch (error) {
    console.error("Error Sending Welcome Email: ", error);
  }
};

export const sendForgetPassCode = async (email, verificationCode) => {
  try {
    const emailBody = forgotPasswordEmailTemplate(verificationCode); //Call the function
    console.log("Generated Email Body: ", emailBody);

    const response = await transporter.sendMail({
      from: `"Bliss" <${process.env.EMAIL_USER}>`, // sender address
      to: email, // list of receivers
      subject: "Reset Password", // Subject line
      text: `Your Verification Code: ${verificationCode}`, // plain text body
      html: emailBody, //Pass Generated email body
    });
    console.log("Email Sent Successfully!!", response);
  } catch (error) {
    console.log("Error while sending Email!", error);
  }
};

export const sendPassChangeConfirmEmail = async (email, name) => {
  const emailBody = confirmPasswordResetEmailTemplate(name); //Call the function
  console.log("Generated Email Body: ", emailBody);
  try {
    const response = await transporter.sendMail({
      from: `"Bliss" <${process.env.EMAIL_USER}>`, // sender address
      to: email, // list of receivers
      subject: "Password Changed Successfully!", // Subject line
      text: `Hello, ${name}!, Your Password has been changed successfully!`, // plain text body
      html: emailBody, //Pass Generated email body
    });
    console.log(
      "Password Changed Confirmation Email Sent Successfully!!",
      response
    );
  } catch (error) {
    console.error("Error Sending Password Changed Confirmation Email: ", error);
  }
};
