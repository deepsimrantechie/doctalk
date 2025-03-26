import React from "react";
import { motion } from "framer-motion";
import {
  FaUserMd,
  FaCalendarAlt,
  FaUserInjured,
  FaShieldAlt,
  FaStethoscope,
  FaChartLine,
  FaBell,
  FaFileMedical,
} from "react-icons/fa";

const DoctorInfo = () => {
  const features = [
    {
      id: 1,
      title: "Appointment Management",
      description:
        "View upcoming appointments, check patient details, and manage your schedule with our intuitive calendar interface.",
      icon: <FaCalendarAlt className="text-3xl" />,
      color: "bg-blue-100",
      border: "border-blue-500",
    },
    {
      id: 2,
      title: "Patient Information",
      description:
        "Access comprehensive patient profiles including medical history, prescriptions, and treatment plans.",
      icon: <FaUserInjured className="text-3xl" />,
      color: "bg-green-100",
      border: "border-green-500",
    },
    {
      id: 3,
      title: "Secure & Confidential",
      description:
        "HIPAA-compliant platform with end-to-end encryption to ensure patient data remains private and secure.",
      icon: <FaShieldAlt className="text-3xl" />,
      color: "bg-purple-100",
      border: "border-purple-500",
    },
    {
      id: 4,
      title: "Medical Records",
      description:
        "Quickly access and update patient records, lab results, and diagnostic reports in one centralized location.",
      icon: <FaFileMedical className="text-3xl" />,
      color: "bg-yellow-100",
      border: "border-yellow-500",
    },
    {
      id: 5,
      title: "Performance Analytics",
      description:
        "Track your practice metrics with detailed reports and visualizations of your clinical activities.",
      icon: <FaChartLine className="text-3xl" />,
      color: "bg-indigo-100",
      border: "border-indigo-500",
    },
    {
      id: 6,
      title: "Real-time Alerts",
      description:
        "Get instant notifications for critical patient updates, appointment changes, and important messages.",
      icon: <FaBell className="text-3xl" />,
      color: "bg-red-100",
      border: "border-red-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center justify-center mb-6"
          >
            <div className="bg-blue-500 p-3 rounded-full shadow-lg">
              <FaUserMd className="text-white text-4xl" />
            </div>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold text-gray-800 mb-4"
          >
            Welcome to Your <span className="text-blue-600">Doctor Portal</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Streamline your practice with our comprehensive healthcare
            management platform designed exclusively for medical professionals.
          </motion.p>
        </div>

        {/* Quick Stats */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <FaCalendarAlt className="text-blue-500 text-xl" />
              </div>
              <div>
                <p className="text-gray-500">Today's Appointments</p>
                <p className="text-2xl font-bold text-gray-800">5</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-full mr-4">
                <FaUserInjured className="text-green-500 text-xl" />
              </div>
              <div>
                <p className="text-gray-500">Active Patients</p>
                <p className="text-2xl font-bold text-gray-800">124</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-yellow-500">
            <div className="flex items-center">
              <div className="bg-yellow-100 p-3 rounded-full mr-4">
                <FaStethoscope className="text-yellow-500 text-xl" />
              </div>
              <div>
                <p className="text-gray-500">Pending Follow-ups</p>
                <p className="text-2xl font-bold text-gray-800">8</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Practice Management Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.id}
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className={`p-6 rounded-xl shadow-sm border-l-4 ${feature.border} ${feature.color} h-full flex flex-col`}
              >
                <div className="mb-4 text-gray-700">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 flex-grow">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-xl p-8 text-center"
        >
          <h3 className="text-2xl font-bold text-white mb-4">
            Ready to Enhance Your Practice?
          </h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Discover how our platform can save you time, reduce paperwork, and
            improve patient outcomes.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold shadow-lg"
          >
            Explore Premium Features
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default DoctorInfo;
