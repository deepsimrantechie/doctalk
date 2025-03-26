import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUserMd,
  FaSearch,
  FaFilter,
  FaCalendarAlt,
  FaStar,
  FaRegStar,
  FaUserEdit,
  FaTrashAlt,
} from "react-icons/fa";
import { IoMdRefresh } from "react-icons/io";

const DoctorsList = () => {
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedCategory, setExpandedCategory] = useState(null);
  const navigate = useNavigate();

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

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUserRole(userData.role);
    }

    fetchDoctors();
  }, [selectedSpecialty]);

  const fetchDoctors = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `http://localhost:6002/api/user/getAlldoctor?specialty=${selectedSpecialty}`
      );
      setDoctors(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch doctors");
    }
    setLoading(false);
  };

  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleCategory = (title) => {
    setExpandedCategory(expandedCategory === title ? null : title);
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= rating ? (
          <FaStar key={i} className="text-yellow-400" />
        ) : (
          <FaRegStar key={i} className="text-gray-300" />
        )
      );
    }
    return stars;
  };

  const DoctorSkeleton = () => (
    <motion.div
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 0.8 }}
      transition={{ repeat: Infinity, repeatType: "reverse", duration: 1 }}
      className="bg-white p-6 rounded-xl shadow-md mb-6"
    >
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
        <div className="flex-1 space-y-2">
          <div className="h-5 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
        <div className="h-10 bg-gray-200 rounded w-24"></div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <motion.h1
            className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 md:mb-0 flex items-center"
            whileHover={{ scale: 1.02 }}
          >
            <FaUserMd className="mr-3 text-blue-500" /> Find Your Doctor
          </motion.h1>

          {/* Search */}
          <div className="relative w-full md:w-96">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search doctors by name or specialty..."
              className="pl-10 pr-4 py-2 rounded-full border-none shadow-md focus:ring-2 focus:ring-blue-300 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Specialty Filter */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-700 flex items-center">
              <FaFilter className="mr-2 text-blue-500" /> Filter by Specialty
            </h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedSpecialty("All")}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                selectedSpecialty === "All"
                  ? "bg-blue-500 text-white shadow-md"
                  : "bg-white text-gray-700 shadow-sm"
              }`}
            >
              Show All
            </motion.button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-4 rounded-xl shadow-md"
              >
                <button
                  onClick={() => toggleCategory(category.title)}
                  className="w-full flex justify-between items-center text-left font-medium text-gray-800"
                >
                  <span>{category.title}</span>
                  <span className="text-blue-500">
                    {expandedCategory === category.title ? "▲" : "▼"}
                  </span>
                </button>

                {expandedCategory === category.title && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-2 space-y-2 overflow-hidden"
                  >
                    {category.specialties.map((specialty, idx) => (
                      <motion.button
                        key={idx}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedSpecialty(specialty)}
                        className={`w-full text-left px-3 py-2 rounded-md transition ${
                          selectedSpecialty === specialty
                            ? "bg-blue-100 text-blue-600"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        {specialty}
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Current Filter */}
        {selectedSpecialty !== "All" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 bg-blue-100 text-blue-800 px-4 py-2 rounded-full inline-flex items-center"
          >
            <span className="font-medium">Current filter:</span>
            <span className="ml-2">{selectedSpecialty}</span>
            <button
              onClick={() => setSelectedSpecialty("All")}
              className="ml-3 text-blue-600 hover:text-blue-800"
            >
              &times;
            </button>
          </motion.div>
        )}

        {/* Doctors List */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            {selectedSpecialty === "All"
              ? "All Available Doctors"
              : `${selectedSpecialty} Specialists`}
          </h2>

          {loading ? (
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <DoctorSkeleton key={i} />
              ))}
            </div>
          ) : error ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FaUserMd className="h-5 w-5 text-red-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={fetchDoctors}
                  className="ml-auto flex items-center text-sm bg-red-100 text-red-700 px-3 py-1 rounded-md"
                >
                  <IoMdRefresh className="mr-1" /> Retry
                </motion.button>
              </div>
            </motion.div>
          ) : filteredDoctors.length > 0 ? (
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <AnimatePresence>
                {filteredDoctors.map((doctor, index) => (
                  <motion.div
                    key={doctor._id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ scale: 1.01 }}
                    className="bg-white p-6 rounded-xl shadow-md border border-gray-100"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                      {/* Doctor Info */}
                      <div className="flex items-start space-x-4">
                        <div className="relative">
                          <img
                            src={doctor.profilePic || "/default-doctor.png"}
                            alt={doctor.name}
                            className="w-20 h-20 rounded-full object-cover border-2 border-blue-100"
                          />
                          <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            {doctor.experience}+ yrs
                          </div>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">
                            {doctor.name}
                          </h3>
                          <p className="text-blue-600 font-medium">
                            {doctor.specialization}
                          </p>
                          <div className="flex items-center mt-1">
                            {renderStars(doctor.rating || 4)}
                            <span className="ml-2 text-sm text-gray-500">
                              ({doctor.reviews || 24} reviews)
                            </span>
                          </div>
                          <p className="text-gray-600 mt-1">
                            {doctor.qualifications || "MD, Board Certified"}
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                        {userRole === "admin" && (
                          <>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm flex items-center"
                            >
                              <FaTrashAlt className="mr-1" /> Delete
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="px-3 py-1 bg-yellow-100 text-yellow-600 rounded-full text-sm flex items-center"
                            >
                              <FaUserEdit className="mr-1" /> Edit
                            </motion.button>
                          </>
                        )}
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => navigate(`/appointment/${doctor._id}`)}
                          className="px-4 py-2 bg-blue-500 text-white rounded-full flex items-center shadow-md hover:shadow-lg"
                        >
                          <FaCalendarAlt className="mr-2" /> Book Appointment
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white p-8 rounded-xl shadow-md text-center"
            >
              <FaUserMd className="mx-auto text-5xl text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                {searchTerm
                  ? "No doctors match your search"
                  : "No doctors available in this specialty"}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm
                  ? "Try adjusting your search terms"
                  : "Please check back later or try another specialty"}
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSelectedSpecialty("All");
                  setSearchTerm("");
                }}
                className="px-6 py-2 bg-blue-500 text-white rounded-full"
              >
                View All Doctors
              </motion.button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default DoctorsList;
