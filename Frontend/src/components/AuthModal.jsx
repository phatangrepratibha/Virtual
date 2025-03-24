import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AppContent } from "../context/AppContext";
import { login, register } from "../services/AuthService";
import registerImage from "../assets/register1.jpg";
import loginImage from "../assets/login1.jpg";
import "../styles/authmodal.css";

function AuthModal({ isOpen, onClose, defaultToLogin = false }) {
  const [isSignup, setIsSignup] = useState(!defaultToLogin);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { setIsLoggedIn, setUserData } = useContext(AppContent);

  const toggleForm = () => {
    setIsSignup(!isSignup);
    setFormData({ username: "", email: "", password: "" });
    setErrors({});
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateFields = () => {
    let newErrors = {};
    if (isSignup && !formData.username.trim())
      newErrors.name = "Name is required!";
    if (!formData.email.trim()) newErrors.email = "Email is required!";
    if (!formData.password.trim())
      newErrors.password = "Password cannot be empty!";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    if (!validateFields()) return;

    setLoading(true);
    setErrors({});

    try {
      const response = isSignup
        ? await register(formData)
        : await login(formData);

      if (isSignup) {
        toast.success("Signup Successful! Please Verify your Email!");
        onClose();
        navigate(`/verify?email=${formData.email}`);
        setTimeout(() => window.location.reload(), 500);
      } else {
        setIsLoggedIn(true);
        setUserData(response.user);
        toast.success("Login successful!");
        onClose();
      }
    } catch (error) {
      console.error("Auth Error:", error);
      const formattedErrors = error.errors?.reduce((acc, curr) => {
        acc[curr.field] = curr.message;
        return acc;
      }, {});

      setErrors(formattedErrors || {});
      toast.error(error.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    isOpen && (
      <div
        className="modal-overlay flex justify-center items-center h-screen bg-gray-100 bg-opacity-50 z-50"
        onClick={onClose}
      >
        <div
          className="modal-content flex max-w-[800px] h-[500px] bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-500"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Image Section */}
          <div
            className={`image-section max-w-1/2 h-full flex items-center justify-center transition-all duration-500 ${
              isSignup ? "order-1" : "order-2"
            }`}
          >
            <img
              src={isSignup ? registerImage : loginImage}
              alt="Auth Illustration"
              className="auth-image w-full h-full object-cover"
            />
          </div>

          {/* Form Section */}
          <div
            className={`form-section w-1/2 p-10 flex flex-col justify-center transition-all duration-500 ${
              isSignup ? "order-2" : "order-1"
            }`}
          >
            <button className="close-btn" onClick={onClose}>
              ×
            </button>
            <h2 className="text-center text-3xl font-bold text-gray-700">
              {isSignup ? "Sign Up" : "Login"}
            </h2>

            <form onSubmit={handleSubmit} className="auth-form mt-6">
              {isSignup && (
                <>
                  <input
                    type="text"
                    name="username"
                    placeholder="Your Name"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full px-2 py-2 border-b border-gray-500 focus:border-gray-700 focus:outline-none bg-transparent"
                  />
                  {errors.name && (
                    <span className="error text-red-500 text-sm">
                      {errors.name}
                    </span>
                  )}
                </>
              )}

              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-2 py-2 border-b border-gray-500 focus:border-gray-700 focus:outline-none bg-transparent"
              />
              {errors.email && (
                <span className="error text-red-500 text-sm">
                  {errors.email}
                </span>
              )}

              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-2 py-2 border-b border-gray-500 focus:border-gray-700 focus:outline-none bg-transparent"
              />
              {errors.password && (
                <span className="error text-red-500 text-sm">
                  {errors.password}
                </span>
              )}

              {!isSignup && (
                <p className="fpass text-right text-sm">
                  <span
                    onClick={(e) => {
                      e.preventDefault();
                      onClose && onClose();
                      navigate("/forgetPass");
                    }}
                  >
                    Forgot Password?
                  </span>
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 bg-gray-800 text-white py-2 rounded-md hover:opacity-90"
              >
                {loading ? "Processing..." : isSignup ? "Sign Up" : "Login"}
              </button>
            </form>

            <p className="toggle-text text-gray-800">
              {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
              <span
                onClick={toggleForm}
                className="text-gray-700 font-bold ml-1"
              >
                {isSignup ? "Login" : "Sign Up"}
              </span>
            </p>
          </div>
        </div>
      </div>
    )
  );
}

export default AuthModal;
