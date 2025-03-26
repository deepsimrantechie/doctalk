import React from "react";
import { motion } from "framer-motion";
import {
  FaUserMd,
  FaCalendarCheck,
  FaVideo,
  FaClinicMedical,
  FaArrowRight,
} from "react-icons/fa";

const Step = () => {
  const steps = [
    {
      title: "Check Doctor Profile",
      description:
        "Browse verified doctor profiles with specialties, experience, and patient reviews to find your perfect match.",
      icon: <FaUserMd className="text-4xl" />,
      color: "bg-blue-100",
      textColor: "text-blue-600",
    },
    {
      title: "Book Appointment",
      description:
        "Easily schedule your consultation with the best doctors in just a few clicks at your convenience.",
      icon: <FaCalendarCheck className="text-4xl" />,
      color: "bg-green-100",
      textColor: "text-green-600",
    },
    {
      title: "Get Consultation",
      description:
        "Connect with top healthcare professionals through secure video calls or in-person visits.",
      icon: <FaVideo className="text-4xl" />,
      color: "bg-purple-100",
      textColor: "text-purple-600",
    },
    {
      title: "Receive Treatment",
      description:
        "Follow expert medical advice and personalized treatment plans tailored to your specific needs.",
      icon: <FaClinicMedical className="text-4xl" />,
      color: "bg-orange-100",
      textColor: "text-orange-600",
    },
  ];

  return (
    <div className="px-4 md:px-8 lg:px-16 py-16 bg-gradient-to-b from-blue-50 to-white">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto"
      >
        {/* Title Section */}
        <div className="text-center mb-12">
          <motion.h1
            initial={{ y: -20 }}
            whileInView={{ y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-700">
              4 Simple Steps
            </span>{" "}
            to Better Healthcare
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Our streamlined process makes accessing quality healthcare simple
            and stress-free.
          </motion.p>
        </div>

        {/* Steps Container */}
        <div className="relative">
          {/* Progress line */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gray-200 transform -translate-y-1/2 z-0"></div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col items-center"
              >
                {/* Step Number */}
                <div
                  className={`w-16 h-16 rounded-full ${step.color} flex items-center justify-center mb-6 relative`}
                >
                  <span className={`text-2xl font-bold ${step.textColor}`}>
                    {index + 1}
                  </span>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-4 border-blue-500 rounded-full"></div>
                </div>

                {/* Step Card */}
                <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 h-full w-full text-center">
                  <div
                    className={`w-20 h-20 ${step.color} rounded-full flex items-center justify-center mx-auto mb-6 ${step.textColor}`}
                  >
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{step.description}</p>
                </div>

                {/* Arrow for mobile */}
                {index < steps.length - 1 && (
                  <div className="md:hidden flex justify-center my-4">
                    <FaArrowRight className="text-gray-400 text-2xl" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-16 text-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            Get Started Today
          </motion.button>
          <p className="mt-4 text-gray-500">
            Join thousands of satisfied patients who found their perfect doctor
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Step;
