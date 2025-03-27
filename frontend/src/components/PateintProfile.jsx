import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUserInjured,
  FaCalendarAlt,
  FaClock,
  FaUserMd,
  FaNotesMedical,
  FaTrash,
} from "react-icons/fa";
import { IoMdRefresh } from "react-icons/io";
import { GiHealthNormal } from "react-icons/gi";
const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:6002";

const PatientProfile = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [patientData, setPatientData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const [appointmentsRes, patientRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/appointment/patient`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_BASE_URL}/api/user/me`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setAppointments(appointmentsRes.data);
        setPatientData(patientRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredAppointments = appointments.filter((appointment) => {
    const now = new Date();
    const appointmentDate = new Date(`${appointment.date}T${appointment.time}`);

    if (activeTab === "upcoming") return appointmentDate >= now;
    if (activeTab === "past") return appointmentDate < now;
    return true;
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

  const handleCancelAppointment = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/api/appointment/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(appointments.filter((app) => app._id !== id));
    } catch (err) {
      console.error("Error canceling appointment:", err);
      setError("Failed to cancel appointment");
    }
  };

  const retryFetch = () => {
    setError(null);
    setLoading(true);
    setTimeout(() => {
      const token = localStorage.getItem("token");
      axios
        .get(`${API_BASE_URL}/api/appointment/patient`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setAppointments(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching appointments:", err);
          setError("Failed to fetch appointments");
          setLoading(false);
        });
    }, 1000);
  };

  const AppointmentSkeleton = () => (
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
        {/* Profile Header */}
        <motion.div
          className="bg-white rounded-2xl shadow-xl p-6 mb-8"
          whileHover={{ y: -2 }}
        >
          <div className="flex flex-col md:flex-row items-center">
            <div className="relative mb-4 md:mb-0 md:mr-6">
              <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center">
                <FaUserInjured className="text-4xl text-blue-500" />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                Patient
              </div>
            </div>

            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-800">
                {patientData?.name || "Loading..."}
              </h1>
              <p className="text-gray-600 mt-1">
                {patientData?.email || "user@example.com"}
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-3">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {patientData?.age || "N/A"} years
                </span>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                  {patientData?.bloodGroup || "N/A"} blood type
                </span>
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                  {appointments.length} appointments
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Appointments Section */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab("upcoming")}
              className={`flex-1 py-4 px-6 text-center font-medium ${
                activeTab === "upcoming"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Upcoming Appointments
            </button>
            <button
              onClick={() => setActiveTab("past")}
              className={`flex-1 py-4 px-6 text-center font-medium ${
                activeTab === "past"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Past Appointments
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {loading ? (
              <div className="space-y-6">
                {[...Array(3)].map((_, i) => (
                  <AppointmentSkeleton key={i} />
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
                    <GiHealthNormal className="h-5 w-5 text-red-500" />
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
            ) : filteredAppointments.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <FaCalendarAlt className="mx-auto text-5xl text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No {activeTab} appointments found
                </h3>
                <p className="text-gray-500">
                  {activeTab === "upcoming"
                    ? "You don't have any upcoming appointments scheduled."
                    : "Your past appointments will appear here."}
                </p>
              </motion.div>
            ) : (
              <motion.div
                className="space-y-6"
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
                      className="bg-gray-50 rounded-xl p-6 border border-gray-200"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between">
                        {/* Doctor Info */}
                        <div className="flex items-start space-x-4 mb-4 md:mb-0">
                          <div className="relative">
                            <img
                              src={
                                appointment.doctorId.profilePic ||
                                "/default-doctor.png"
                              }
                              alt={appointment.doctorId.name}
                              className="w-16 h-16 rounded-full object-cover border-2 border-blue-100"
                            />
                            <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                              {appointment.doctorId.experience}+ yrs
                            </div>
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-800">
                              Dr. {appointment.doctorId.name}
                            </h3>
                            <p className="text-blue-600 font-medium">
                              {appointment.doctorId.specialization}
                            </p>
                            {appointment.notes && (
                              <div className="mt-2 flex items-start">
                                <FaNotesMedical className="text-gray-400 mt-1 mr-2 flex-shrink-0" />
                                <p className="text-gray-600 text-sm">
                                  {appointment.notes}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Appointment Details */}
                        <div className="flex flex-col items-start md:items-end space-y-2">
                          <div className="flex items-center text-gray-700">
                            <FaCalendarAlt className="mr-2 text-blue-500" />
                            <span>{formatDate(appointment.date)}</span>
                          </div>
                          <div className="flex items-center text-gray-700">
                            <FaClock className="mr-2 text-blue-500" />
                            <span>{appointment.time}</span>
                          </div>
                          {activeTab === "upcoming" && (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() =>
                                handleCancelAppointment(appointment._id)
                              }
                              className="mt-2 px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm flex items-center"
                            >
                              <FaTrash className="mr-1" /> Cancel
                            </motion.button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </div>

        {/* Health Summary (Placeholder for future expansion) */}
        <motion.div
          className="mt-8 bg-white rounded-2xl shadow-xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <GiHealthNormal className="text-blue-500 mr-2" /> Health Summary
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-800">Last Checkup</h3>
              <p className="text-gray-600">June 15, 2023</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-medium text-green-800">Medications</h3>
              <p className="text-gray-600">2 Active</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-medium text-purple-800">Allergies</h3>
              <p className="text-gray-600">None reported</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PatientProfile;
