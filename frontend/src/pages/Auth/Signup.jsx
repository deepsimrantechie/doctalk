import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUser,
  FaUserMd,
  FaEnvelope,
  FaLock,
  FaBriefcaseMedical,
  FaUserShield,
  FaTimes,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { PulseLoader } from "react-spinners";

const categories = [
  {
    title: "Primary Care Physicians",
    specialties: [
      "General Practitioner (GP)",
      "Family Medicine Physician",
      "Internal Medicine Physician",
    ],
  },
  {
    title: "Medical Specialties",
    specialties: [
      "Cardiologist",
      "Dermatologist",
      "Gastroenterologist",
      "Pediatrician",
      "Gynecologist/Obstetrician",
      "Psychiatrist",
    ],
  },
  {
    title: "Surgical Specialties",
    specialties: ["General Surgeon", "Orthopedic Surgeon"],
  },
  {
    title: "Diagnostic and Imaging",
    specialties: ["Radiologist"],
  },
  {
    title: "Emergency and Critical Care",
    specialties: ["Emergency Medicine Physician"],
  },
  {
    title: "Rehabilitation and Therapy",
    specialties: ["Physical Therapist (PT)"],
  },
];

const Signup = ({ isOpen, onClose }) => {
  const [role, setRole] = useState("patient");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    specialization: "",
    experience: "",
    age: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setFormData(parsedUser);
      setRole(parsedUser.role || "patient");
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const userData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: role,
    };

    if (role === "doctor") {
      userData.specialization = formData.specialization;
      userData.experience = formData.experience;
    } else {
      userData.age = formData.age;
    }

    try {
      const response = await axios.post(
        "http://localhost:6002/api/user/register",
        userData
      );

      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("token", response.data.token);

      if (response.data?.user?.id) {
        localStorage.setItem("userId", response.data.user.id);
        if (response.data.user.role === "doctor") {
          localStorage.setItem("doctorId", response.data.user.id);
        }
      }

      onClose();
    } catch (err) {
      setError(
        err.response?.data?.message || "Something went wrong. Please try again."
      );
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
    setLoading(false);
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
              <h1 className="text-2xl font-bold">Create Your Account</h1>
              <button
                onClick={onClose}
                className="text-white hover:text-blue-200 transition"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>
            <p className="mt-1 opacity-90">
              Join our healthcare community as a {role}
            </p>
          </div>

          {/* Role Selector */}
          <div className="flex border-b">
            <button
              onClick={() => setRole("patient")}
              className={`flex-1 py-4 text-center font-medium ${
                role === "patient"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center justify-center">
                <FaUser className="mr-2" /> Patient
              </div>
            </button>
            <button
              onClick={() => setRole("doctor")}
              className={`flex-1 py-4 text-center font-medium ${
                role === "doctor"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center justify-center">
                <FaUserMd className="mr-2" /> Doctor
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

            <form onSubmit={handleSubmit}>
              {/* Name Field */}
              <div className="mb-4">
                <label className="block text-gray-700 mb-2 font-medium">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>

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
              </div>

              {/* Doctor Specific Fields */}
              {role === "doctor" && (
                <>
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2 font-medium">
                      Specialization
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaBriefcaseMedical className="text-gray-400" />
                      </div>
                      <select
                        name="specialization"
                        value={formData.specialization}
                        onChange={handleChange}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 appearance-none"
                        required
                      >
                        <option value="">Select Specialization</option>
                        {categories.map((category) => (
                          <optgroup key={category.title} label={category.title}>
                            {category.specialties.map((specialty) => (
                              <option key={specialty} value={specialty}>
                                {specialty}
                              </option>
                            ))}
                          </optgroup>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-gray-700 mb-2 font-medium">
                      Years of Experience
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaUserShield className="text-gray-400" />
                      </div>
                      <input
                        type="number"
                        name="experience"
                        value={formData.experience}
                        onChange={handleChange}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                        placeholder="5"
                        min="0"
                        required
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Patient Specific Field */}
              {role === "patient" && (
                <div className="mb-6">
                  <label className="block text-gray-700 mb-2 font-medium">
                    Age
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser className="text-gray-400" />
                    </div>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                      placeholder="30"
                      min="0"
                      max="120"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg shadow-md transition duration-300 flex items-center justify-center"
              >
                {loading ? (
                  <PulseLoader color="#ffffff" size={8} />
                ) : (
                  <>Sign Up as {role === "doctor" ? "Doctor" : "Patient"}</>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center my-6">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="mx-4 text-gray-500">or</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            {/* Login Link */}
            <div className="text-center">
              <p className="text-gray-600">
                Already have an account?{" "}
                <a
                  href="#"
                  className="text-blue-500 font-medium hover:underline"
                >
                  Log in
                </a>
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Signup;
