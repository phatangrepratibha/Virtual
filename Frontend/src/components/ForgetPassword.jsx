import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import {
  forgetPassword,
  resendResetPasswordCode,
  resetPassword,
} from "../services/AuthService";

function ForgetPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [step, setStep] = useState(1);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  const clearMessages = () => {
    setError("");
    setSuccessMessage("");
    setResendMessage("");
  };

  const handleRequestCode = async () => {
    setLoading(true);
    clearMessages();

    try {
      await forgetPassword(email);
      setSuccessMessage("Reset code sent to your email. Redirecting...");
      toast.success("Reset code sent to your email.");
      setTimeout(() => {
        clearMessages();
        setStep(2);
      }, 2000);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    }
    setLoading(false);
  };

  const handleResetPassword = async () => {
    setLoading(true);
    clearMessages();

    try {
      await resetPassword(email, code, newPassword);
      setSuccessMessage("Password reset successful!");
      toast.success("Password reset successful!");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    }
    setLoading(false);
  };

  const handleResendCode = async () => {
    setResendLoading(true);
    clearMessages();

    try {
      await resendResetPasswordCode(email);
      setResendMessage("A new reset code has been sent to your email.");
      toast.info("A new reset code has been sent to your email.");
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
    }
    setResendLoading(false);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg border border-gray-100">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Reset Password
        </h1>
        <div>
          {step === 1 && (
            <>
              <p className="mb-6 text-gray-600 text-center">
                Enter your email address to receive a verification code for
                resetting your password.
              </p>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 mb-4 text-gray-800 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={handleRequestCode}
                disabled={loading}
                className="w-full p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all"
              >
                {loading ? "Sending Code..." : "Send Verification Code"}
              </button>
              {error && (
                <p className="mt-4 text-center text-red-500">{error}</p>
              )}
              {successMessage && (
                <p className="mt-4 text-center text-green-500">
                  {successMessage}
                </p>
              )}
            </>
          )}

          {step === 2 && (
            <>
              <p className="mb-6 text-gray-600 text-center">
                A verification code has been sent to your email:{" "}
                <b className="text-gray-800">{email}</b>. Enter the code and set
                a new password.
              </p>
              <input
                type="text"
                placeholder="Enter Verification Code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full p-3 mb-4 text-gray-800 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="password"
                placeholder="Enter New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-3 mb-4 text-gray-800 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={handleResetPassword}
                disabled={loading}
                className="w-full p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all"
              >
                {loading ? "Processing..." : "Reset Password"}
              </button>
              <p className="mt-4 text-gray-600 text-center">
                Didn't receive the code?{" "}
                <span
                  onClick={handleResendCode}
                  className={`cursor-pointer text-blue-500 underline ${
                    resendLoading ? "opacity-50" : "hover:text-blue-600"
                  }`}
                >
                  {resendLoading ? "Resending..." : "Resend Code"}
                </span>
              </p>
              {error && (
                <p className="mt-4 text-center text-red-500">{error}</p>
              )}
              {successMessage && (
                <p className="mt-4 text-center text-green-500">
                  {successMessage}
                </p>
              )}
              {resendMessage && (
                <p className="mt-4 text-center text-green-500">
                  {resendMessage}
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ForgetPassword;
