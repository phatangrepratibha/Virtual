import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getAuthUser,
  resendVerificationEmail,
  verifyAccount,
} from "../services/AuthService";
import AuthModal from "./AuthModal";

function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get("email");

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const [isVerified, setIsVerified] = useState(null);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    const checkVerification = async () => {
      try {
        const user = await getAuthUser();
        if (user.user.isVerified) {
          setSuccessMessage("Your account is already verified! Redirecting...");
          setIsVerified(true);
          setTimeout(() => {
            navigate("/");
          }, 5000);
        } else {
          setIsVerified(false);
        }
      } catch (err) {
        console.error("Error: ", err);
        setError("Failed to fetch user data!");
        setIsVerified(false);
      }
    };

    checkVerification();
  }, [navigate]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
    }
  }, [successMessage]);

  const handleVerify = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await verifyAccount(email, code);
      setSuccessMessage("Account verified successfully! Redirecting...");
      console.log(response);
      setTimeout(() => {
        setIsAuthModalOpen(true);
      }, 2000);
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setResendLoading(true);
    setResendMessage("");
    setError("");

    try {
      await resendVerificationEmail(email);
      setResendMessage("A new verification code has been sent to your email!");
      toast.info("A new verification code has been sent to your email!");
      setCode("");
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
    } finally {
      setResendLoading(false);
    }
  };

  if (isVerified === null) {
    return <p className="text-center text-gray-600">Loading...</p>;
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg border border-gray-100">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Verify Your Email
        </h1>
        {isVerified ? (
          <p className="text-center text-green-500">{successMessage}</p>
        ) : (
          <div className="space-y-6">
            <p className="text-gray-600 text-center">
              A verification code has been sent to your email:{" "}
              <b className="text-gray-800">{email}</b>. Enter the code to verify
              your account.
            </p>
            <input
              type="text"
              placeholder="Enter Verification Code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full p-3 text-gray-800 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleVerify}
              disabled={loading}
              className="w-full p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all"
            >
              {loading ? "Verifying..." : "Verify"}
            </button>
            {error && <p className="text-center text-red-500">{error}</p>}
            {successMessage && (
              <p className="text-center text-green-500">{successMessage}</p>
            )}

            <p className="text-gray-600 text-center">
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

            {resendMessage && (
              <p className="text-center text-green-500">{resendMessage}</p>
            )}
          </div>
        )}
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          defaultToLogin={true}
        />
      </div>
    </div>
  );
}

export default VerifyEmail;
