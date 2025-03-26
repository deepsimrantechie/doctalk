import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUserMd,
  FaSearch,
  FaFilter,
  FaStar,
  FaRegStar,
  FaClock,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { IoMdRefresh } from "react-icons/io";
import assets from "../../assets/assets";

const DoctorPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");
  const [specialties, setSpecialties] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          "http://localhost:6002/api/user/getAlldoctor"
        );
        setDoctors(response.data);

        // Extract unique specialties
        const uniqueSpecialties = [
          ...new Set(response.data.map((doctor) => doctor.specialization)),
        ].filter(Boolean);
        setSpecialties(["All", ...uniqueSpecialties]);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch doctors");
      }
      setLoading(false);
    };
    fetchDoctors();
  }, []);

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialization?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty =
      selectedSpecialty === "All" ||
      doctor.specialization === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  const retryFetch = () => {
    setError(null);
    setLoading(true);
    setTimeout(() => {
      axios
        .get("http://localhost:6002/api/user/getAlldoctor")
        .then((response) => {
          setDoctors(response.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching doctors:", err);
          setError("Failed to fetch doctors. Please try again.");
          setLoading(false);
        });
    }, 1000);
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
      className="bg-white rounded-xl shadow-md overflow-hidden"
    >
      <div className="h-48 bg-gray-200"></div>
      <div className="p-6">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-6"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white px-4 md:px-8 lg:px-16 py-16">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-700">
              Our Medical Experts
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Highly qualified professionals dedicated to your health and
            well-being
          </motion.p>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-md p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search doctors by name or specialty..."
                className="pl-10 pr-4 py-2 rounded-full border border-gray-300 w-full focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <FaFilter className="text-gray-400" />
              <select
                className="px-4 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
              >
                {specialties.map((specialty) => (
                  <option key={specialty} value={specialty}>
                    {specialty}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Doctors Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
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
                onClick={retryFetch}
                className="ml-auto flex items-center text-sm bg-red-100 text-red-700 px-3 py-1 rounded-md"
              >
                <IoMdRefresh className="mr-1" /> Retry
              </motion.button>
            </div>
          </motion.div>
        ) : filteredDoctors.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-xl shadow-md p-8 text-center"
          >
            <FaUserMd className="mx-auto text-5xl text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No doctors found
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || selectedSpecialty !== "All"
                ? "Try adjusting your search or filter"
                : "No doctors are currently available"}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setSearchTerm("");
                setSelectedSpecialty("All");
              }}
              className="px-6 py-2 bg-blue-500 text-white rounded-full"
            >
              Reset Filters
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <AnimatePresence>
              {filteredDoctors.map((doctor) => (
                <motion.div
                  key={doctor._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 cursor-pointer"
                  onClick={() => navigate(`/appointment/${doctor._id}`)}
                >
                  <div className="relative">
                    <img
                      src={doctor.profilePic || assets.Doctor}
                      alt={doctor.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <h3 className="text-white font-bold text-xl">
                        {doctor.name}
                      </h3>
                      <p className="text-blue-200">
                        {doctor.specialization || "Medical Specialist"}
                      </p>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center mb-3">
                      {renderStars(doctor.rating || 4)}
                      <span className="ml-2 text-sm text-gray-500">
                        (24 reviews)
                      </span>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      {doctor.experience && (
                        <div className="flex items-center">
                          <FaClock className="mr-2 text-blue-500" />
                          <span>{doctor.experience}+ years experience</span>
                        </div>
                      )}
                      {doctor.phone && (
                        <div className="flex items-center">
                          <FaPhone className="mr-2 text-blue-500" />
                          <span>{doctor.phone}</span>
                        </div>
                      )}
                      {doctor.location && (
                        <div className="flex items-start">
                          <FaMapMarkerAlt className="mr-2 mt-1 text-blue-500 flex-shrink-0" />
                          <span>{doctor.location}</span>
                        </div>
                      )}
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="mt-6 w-full bg-blue-500 text-white py-2 rounded-lg shadow-sm"
                    >
                      Book Appointment
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mt-16 text-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            View All Specialists
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default DoctorPage;
