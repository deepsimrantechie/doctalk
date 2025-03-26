import React from "react";
import { motion } from "framer-motion";
import {
  FaCalendarAlt,
  FaUserMd,
  FaChartLine,
  FaClinicMedical,
  FaMobileAlt,
  FaShieldAlt,
} from "react-icons/fa";
import assets from "../../assets/assets";

const Information = () => {
  const features = [
    {
      icon: <FaCalendarAlt className="text-3xl text-blue-500" />,
      title: "Easy Appointment Booking",
      description:
        "Schedule consultations in just a few clicks with our intuitive interface",
    },
    {
      icon: <FaUserMd className="text-3xl text-green-500" />,
      title: "Verified Doctor Profiles",
      description: "Access detailed information about healthcare professionals",
    },
    {
      icon: <FaChartLine className="text-3xl text-purple-500" />,
      title: "Health Tracking",
      description: "Monitor your health progress with our analytics dashboard",
    },
    {
      icon: <FaClinicMedical className="text-3xl text-orange-500" />,
      title: "Comprehensive Care",
      description: "From diagnosis to treatment, we've got you covered",
    },
  ];

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 md:px-8 lg:px-16 py-16">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto"
      >
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left Section */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:w-1/2 w-full space-y-8"
          >
            <div>
              <motion.h1
                initial={{ y: -20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 leading-tight"
              >
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-700">
                  Together, We Achieve
                </span>{" "}
                <br /> Optimal Health Outcomes
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-lg md:text-xl text-gray-600 mt-4"
              >
                Pioneering the future of healthcare through innovative
                technology and patient-centered solutions.
              </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * index, duration: 0.5 }}
                  whileHover={{ y: -5 }}
                  className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">{feature.icon}</div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 mt-1">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 mt-6"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all"
              >
                Get Started
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-blue-600 px-6 py-3 rounded-lg border border-blue-600 shadow-sm hover:shadow-md transition-all"
              >
                Learn More
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right Section */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:w-1/2 w-full flex justify-center relative"
          >
            <div className="relative">
              <img
                src={assets.optimal}
                alt="Healthcare technology"
                className="w-full max-w-lg rounded-xl shadow-xl z-10 relative"
              />
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 0.1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.8 }}
                className="absolute -bottom-8 -right-8 bg-blue-500 w-full h-full rounded-xl z-0"
              ></motion.div>

              {/* Floating badges */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="absolute -top-6 -left-6 bg-white p-4 rounded-full shadow-lg flex items-center"
              >
                <FaMobileAlt className="text-blue-500 text-2xl mr-2" />
                <span className="font-semibold">Mobile App</span>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 1, duration: 0.5 }}
                className="absolute -bottom-6 -right-6 bg-white p-4 rounded-full shadow-lg flex items-center"
              >
                <FaShieldAlt className="text-green-500 text-2xl mr-2" />
                <span className="font-semibold">Secure Platform</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Information;
