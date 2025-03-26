import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import assets from "../../assets/assets";
import { motion } from "framer-motion"; // For animations

const DoctorHome = () => {
  const [doctorId, setDoctorId] = useState(null);

  useEffect(() => {
    const storedDoctorId = localStorage.getItem("doctorId");
    if (storedDoctorId) {
      setDoctorId(storedDoctorId);
    } else {
      console.error("Doctor ID is missing. Ensure it's stored after login.");
    }
  }, []);

  const cards = [
    { id: 1, title: "Appointment", image: assets.Appointment, path: "/bloog" },
    { id: 2, title: "Patients", image: assets.list, path: "/patientCount" },
    { id: 3, title: "Medical Reports", image: assets.income, path: "" },
    { id: 4, title: "Prescriptions", image: assets.prescription, path: "" },
    { id: 5, title: "Earnings", image: assets.blogs, path: "" },
    {
      id: 6,
      title: "Settings",
      image: assets.profile,
      path: doctorId ? `/doctor-profile/${doctorId}` : "#",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-center text-gray-800 mb-12"
        >
          Doctor Dashboard
        </motion.h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                to={card.path}
                className={`block no-underline ${
                  card.path === "#" ? "pointer-events-none" : ""
                }`}
              >
                <div
                  className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl ${
                    card.path === "#" ? "opacity-60" : "hover:border-blue-400"
                  } border border-gray-200`}
                >
                  <div className="p-6 flex items-center space-x-4">
                    <div className="flex-shrink-0 bg-blue-100 p-3 rounded-full">
                      <img
                        src={card.image}
                        alt={card.title}
                        className="w-10 h-10 object-contain"
                      />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800">
                        {card.title}
                      </h2>
                      <p className="text-gray-500 text-sm mt-1">
                        {card.path === "#" ? "Coming soon" : "Click to open"}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DoctorHome;
