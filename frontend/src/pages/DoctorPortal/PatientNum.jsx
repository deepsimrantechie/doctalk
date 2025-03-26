import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUserInjured,
  FaCalendarAlt,
  FaClock,
  FaEnvelope,
  FaPhone,
  FaSearch,
  FaFilter,
} from "react-icons/fa";
import { IoMdRefresh } from "react-icons/io";

const PatientNum = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "http://localhost:6002/api/appointment/doctor",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAppointments(res.data);
    } catch (err) {
      console.error("Error fetching appointments:", err);
      setError("Failed to load patient data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filteredAppointments = appointments.filter((appointment) => {
    // Search filter
    const matchesSearch =
      appointment.patientId?.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      appointment.patientId?.email
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

    // Date filter
    const matchesDate = filterDate ? appointment.date === filterDate : true;

    // Status filter
    const now = new Date();
    const appointmentDate = new Date(`${appointment.date}T${appointment.time}`);
    let matchesStatus = true;

    if (activeTab === "upcoming") matchesStatus = appointmentDate > now;
    if (activeTab === "past") matchesStatus = appointmentDate <= now;

    return matchesSearch && matchesDate && matchesStatus;
  });

  const formatDate = (dateString) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const PatientSkeleton = () => (
    <motion.div
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 0.8 }}
      transition={{ repeat: Infinity, repeatType: "reverse", duration: 1 }}
      className="bg-white p-4 rounded-lg shadow-sm mb-4"
    >
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
      <div className="mt-3 space-y-2">
        <div className="h-3 bg-gray-200 rounded w-full"></div>
        <div className="h-3 bg-gray-200 rounded w-4/5"></div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
              <FaUserInjured className="text-blue-500 mr-3" /> Patient
              Management
            </h1>
            <p className="text-gray-600">
              View and manage your patient appointments
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchAppointments}
            className="mt-4 md:mt-0 px-4 py-2 bg-white text-blue-500 rounded-full shadow-sm flex items-center"
          >
            <IoMdRefresh className="mr-2" /> Refresh
          </motion.button>
        </div>

        {/* Stats Card */}
        <motion.div
          className="bg-white rounded-xl shadow-md p-6 mb-8 grid grid-cols-1 md:grid-cols-4 gap-4"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-600 font-medium">Total Patients</p>
            <p className="text-3xl font-bold text-blue-800">
              {appointments.length}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-green-600 font-medium">Upcoming</p>
            <p className="text-3xl font-bold text-green-800">
              {
                appointments.filter(
                  (a) => new Date(`${a.date}T${a.time}`) > new Date()
                ).length
              }
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-purple-600 font-medium">Completed</p>
            <p className="text-3xl font-bold text-purple-800">
              {
                appointments.filter(
                  (a) => new Date(`${a.date}T${a.time}`) <= new Date()
                ).length
              }
            </p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-sm text-yellow-600 font-medium">This Month</p>
            <p className="text-3xl font-bold text-yellow-800">
              {
                appointments.filter((a) => {
                  const appDate = new Date(a.date);
                  const now = new Date();
                  return (
                    appDate.getMonth() === now.getMonth() &&
                    appDate.getFullYear() === now.getFullYear()
                  );
                }).length
              }
            </p>
          </div>
        </motion.div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            {/* Search */}
            <div className="relative flex-1 md:mr-4">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search patients by name or email..."
                className="pl-10 pr-4 py-2 rounded-full border border-gray-200 w-full focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Date Filter */}
            <div className="flex items-center space-x-2">
              <FaFilter className="text-gray-400" />
              <input
                type="date"
                className="px-3 py-2 rounded-md border border-gray-200 focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
              />
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b mt-6">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 font-medium ${
                activeTab === "all"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              All Appointments
            </button>
            <button
              onClick={() => setActiveTab("upcoming")}
              className={`px-4 py-2 font-medium ${
                activeTab === "upcoming"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setActiveTab("past")}
              className={`px-4 py-2 font-medium ${
                activeTab === "past"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Past
            </button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <PatientSkeleton key={i} />
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
                <FaUserInjured className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={fetchAppointments}
                className="ml-auto flex items-center text-sm bg-red-100 text-red-700 px-3 py-1 rounded-md"
              >
                <IoMdRefresh className="mr-1" /> Retry
              </motion.button>
            </div>
          </motion.div>
        ) : filteredAppointments.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-xl shadow-md p-8 text-center"
          >
            <FaUserInjured className="mx-auto text-5xl text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {searchTerm || filterDate || activeTab !== "all"
                ? "No matching patients found"
                : "No patient appointments yet"}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || filterDate || activeTab !== "all"
                ? "Try adjusting your search or filters"
                : "Your patient appointments will appear here"}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setSearchTerm("");
                setFilterDate("");
                setActiveTab("all");
              }}
              className="px-6 py-2 bg-blue-500 text-white rounded-full"
            >
              Reset Filters
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <AnimatePresence>
              {filteredAppointments.map((appointment) => (
                <motion.div
                  key={appointment._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ scale: 1.01 }}
                  className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100"
                >
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                      {/* Patient Info */}
                      <div className="flex items-start space-x-4 mb-4 md:mb-0">
                        <div className="bg-blue-100 p-3 rounded-full">
                          <FaUserInjured className="text-blue-500 text-xl" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-800">
                            {appointment.patientId?.name || "Unknown Patient"}
                          </h3>
                          <div className="flex flex-wrap items-center gap-2 mt-1">
                            <div className="flex items-center text-sm text-gray-600">
                              <FaEnvelope className="mr-1 text-blue-400" />
                              <span>
                                {appointment.patientId?.email || "No email"}
                              </span>
                            </div>
                            {appointment.patientId?.phone && (
                              <div className="flex items-center text-sm text-gray-600">
                                <FaPhone className="mr-1 text-green-400" />
                                <span>{appointment.patientId.phone}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Appointment Info */}
                      <div className="flex flex-col items-start md:items-end space-y-2">
                        <div className="flex items-center text-blue-600">
                          <FaCalendarAlt className="mr-2" />
                          <span>{formatDate(appointment.date)}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <FaClock className="mr-2" />
                          <span>{appointment.time}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default PatientNum;
