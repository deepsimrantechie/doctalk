import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUserMd,
  FaUserInjured,
  FaLock,
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaTimes,
} from "react-icons/fa";
import { PulseLoader } from "react-spinners";
const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:6002";

const Login = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "doctor",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [shake, setShake] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(`${API_BASE_URL}/api/user/login`, {
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });

      // Store user data
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("token", response.data.token);

      if (response.data?.user?.id) {
        localStorage.setItem("userId", response.data.user.id);
        if (response.data.user.role === "doctor") {
          localStorage.setItem("doctorId", response.data.user.id);
        }
      }

      // Navigate based on role
      const redirectPath =
        response.data.user.role === "doctor"
          ? "/doctor-portal"
          : "/user-profile";

      navigate(redirectPath);
      window.location.reload();
    } catch (err) {
      console.error("Login Error:", err.response?.data || err.message);
      const errorMsg = err.response?.data?.message || "Invalid credentials";
      setError(errorMsg);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{
            scale: 1,
            y: 0,
            x: shake ? [0, -10, 10, -10, 10, 0] : 0,
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 25,
            duration: shake ? 0.5 : 0.3,
          }}
          className="relative bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">Welcome Back</h1>
              <button
                onClick={onClose}
                className="text-white hover:text-blue-200 transition"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>
            <p className="mt-1 opacity-90">
              Sign in to access your {formData.role} dashboard
            </p>
          </div>

          {/* Role Selector */}
          <div className="flex border-b">
            <button
              onClick={() => setFormData({ ...formData, role: "doctor" })}
              className={`flex-1 py-4 text-center font-medium ${
                formData.role === "doctor"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center justify-center">
                <FaUserMd className="mr-2" /> Doctor
              </div>
            </button>
            <button
              onClick={() => setFormData({ ...formData, role: "patient" })}
              className={`flex-1 py-4 text-center font-medium ${
                formData.role === "patient"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center justify-center">
                <FaUserInjured className="mr-2" /> Patient
              </div>
            </button>
          </div>

          {/* Form */}
          <div className="p-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border-l-4 border-red-500 p-3 rounded mb-4"
              >
                <p className="text-red-700">{error}</p>
              </motion.div>
            )}

            <form onSubmit={handleLogin}>
              {/* Email Field */}
              <div className="mb-4">
                <label className="block text-gray-700 mb-2 font-medium">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="mb-6">
                <label className="block text-gray-700 mb-2 font-medium">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <FaEyeSlash className="text-gray-400 hover:text-gray-600" />
                    ) : (
                      <FaEye className="text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                <div className="text-right mt-1">
                  <a href="#" className="text-sm text-blue-500 hover:underline">
                    Forgot password?
                  </a>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg shadow-md transition duration-300 flex items-center justify-center"
              >
                {loading ? (
                  <PulseLoader color="#ffffff" size={8} />
                ) : (
                  <>
                    Sign In as{" "}
                    {formData.role === "doctor" ? "Doctor" : "Patient"}
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center my-6">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="mx-4 text-gray-500">or</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            {/* Sign Up Link */}
            <div className="text-center">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <a
                  href="#"
                  className="text-blue-500 font-medium hover:underline"
                >
                  Sign up
                </a>
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Login;
