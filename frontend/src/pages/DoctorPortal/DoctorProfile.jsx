import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaUserMd,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaLanguage,
  FaClock,
  FaPhone,
  FaBuilding,
  FaEdit,
  FaSave,
  FaTimes,
  FaCamera,
} from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DoctorProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newProfilePic, setNewProfilePic] = useState(null);
  const [isAvailable, setIsAvailable] = useState(true);
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const [formData, setFormData] = useState({
    specialization: "",
    experience: "",
    clinic: "",
    location: "",
    fees: "",
    languages: "",
    workTimings: "",
    contact: "",
  });

  const specializationOptions = [
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
      specialties: [
        "General Surgeon",
        "Orthopedic Surgeon",
        "Neurosurgeon",
        "Cardiothoracic Surgeon",
        "Plastic Surgeon",
      ],
    },
    {
      title: "Emergency and Critical Care",
      specialties: [
        "Emergency Medicine Physician",
        "Intensivist (Critical Care Specialist)",
      ],
    },
    {
      title: "Other Specialties",
      specialties: [
        "Radiologist",
        "Anesthesiologist",
        "Pathologist",
        "Oncologist",
        "Rheumatologist",
      ],
    },
  ];

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:6002/api/user/doctor/${id}`
        );
        setUser(response.data);
        setFormData({
          specialization: response.data.specialization,
          experience: response.data.experience,
          clinic: response.data.clinic,
          location: response.data.location,
          fees: response.data.fees,
          languages: response.data.languages,
          workTimings: response.data.workTimings,
          contact: response.data.contact,
        });
        setIsAvailable(response.data.isAvailable || true);
      } catch (error) {
        toast.error("Error fetching profile data");
        console.error("Error fetching user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewProfilePic(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveChanges = async () => {
    try {
      setLoading(true);
      const formDataToSend = new FormData();

      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
      });

      if (newProfilePic) formDataToSend.append("profilePic", newProfilePic);
      formDataToSend.append("isAvailable", isAvailable);

      const response = await axios.put(
        `http://localhost:6002/api/user/doctor/${id}`,
        formDataToSend,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setUser(response.data);
      setIsEditing(false);
      setPreviewImage(null);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500">Unable to load profile data</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative">
                <img
                  src={
                    previewImage ||
                    user.profilePic ||
                    "https://via.placeholder.com/150"
                  }
                  alt="Doctor"
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
                />
                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-lg cursor-pointer hover:bg-gray-100 transition">
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="hidden"
                      accept="image/*"
                    />
                    <FaCamera className="text-blue-500" />
                  </label>
                )}
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-2xl md:text-3xl font-bold">
                  Dr. {user.name}
                </h1>
                <p className="text-blue-100 mt-1">{user.specialization}</p>
                <div className="mt-4">
                  <button
                    onClick={() => setIsAvailable(!isAvailable)}
                    className={`px-4 py-1 rounded-full text-sm font-semibold flex items-center mx-auto md:mx-0 ${
                      isAvailable
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    <span className="w-3 h-3 rounded-full mr-2 bg-current"></span>
                    {isAvailable
                      ? "Available for Appointments"
                      : "Currently Not Available"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-6 md:p-8">
            {isEditing ? (
              <motion.form
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                onSubmit={(e) => e.preventDefault()}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {/* Specialization */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Specialization
                  </label>
                  <select
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                  >
                    <option value="">Select Specialization</option>
                    {specializationOptions.map((group, index) => (
                      <optgroup label={group.title} key={index}>
                        {group.specialties.map((specialty, idx) => (
                          <option value={specialty} key={idx}>
                            {specialty}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>

                {/* Experience */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 items-center">
                    <FaUserMd className="mr-2 text-blue-500" />
                    Experience (years)
                  </label>
                  <input
                    type="number"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                    min="0"
                  />
                </div>

                {/* Clinic */}
                <div>
                  <label className=" text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <FaBuilding className="mr-2 text-blue-500" />
                    Clinic/Hospital
                  </label>
                  <input
                    type="text"
                    name="clinic"
                    value={formData.clinic}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className=" text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <FaMapMarkerAlt className="mr-2 text-blue-500" />
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                  />
                </div>

                {/* Fees */}
                <div>
                  <label className=" text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <FaMoneyBillWave className="mr-2 text-blue-500" />
                    Consultation Fee
                  </label>
                  <input
                    type="text"
                    name="fees"
                    value={formData.fees}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                  />
                </div>

                {/* Languages */}
                <div>
                  <label className=" text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <FaLanguage className="mr-2 text-blue-500" />
                    Languages Spoken
                  </label>
                  <input
                    type="text"
                    name="languages"
                    value={formData.languages}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                    placeholder="English, Spanish, etc."
                  />
                </div>

                {/* Work Timings */}
                <div>
                  <label className=" text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <FaClock className="mr-2 text-blue-500" />
                    Work Timings
                  </label>
                  <input
                    type="text"
                    name="workTimings"
                    value={formData.workTimings}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                    placeholder="9:00 AM - 5:00 PM"
                  />
                </div>

                {/* Contact */}
                <div>
                  <label className=" text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <FaPhone className="mr-2 text-blue-500" />
                    Contact Number
                  </label>
                  <input
                    type="text"
                    name="contact"
                    value={formData.contact}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                  />
                </div>
              </motion.form>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <div className="flex items-start">
                  <FaUserMd className="text-blue-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-gray-700">
                      Specialization
                    </h3>
                    <p className="text-gray-600">{user.specialization}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <FaUserMd className="text-blue-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-gray-700">Experience</h3>
                    <p className="text-gray-600">{user.experience} years</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <FaBuilding className="text-blue-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-gray-700">
                      Clinic/Hospital
                    </h3>
                    <p className="text-gray-600">
                      {user.clinic || "Not specified"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <FaMapMarkerAlt className="text-blue-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-gray-700">Location</h3>
                    <p className="text-gray-600">
                      {user.location || "Not specified"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <FaMoneyBillWave className="text-blue-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-gray-700">
                      Consultation Fee
                    </h3>
                    <p className="text-gray-600">
                      {user.fees || "Not specified"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <FaLanguage className="text-blue-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-gray-700">
                      Languages Spoken
                    </h3>
                    <p className="text-gray-600">
                      {user.languages || "Not specified"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <FaClock className="text-blue-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-gray-700">Work Timings</h3>
                    <p className="text-gray-600">
                      {user.workTimings || "Not specified"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <FaPhone className="text-blue-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-gray-700">
                      Contact Number
                    </h3>
                    <p className="text-gray-600">
                      {user.contact || "Not specified"}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Action Buttons */}
            <div className="mt-8 flex justify-end space-x-4">
              {isEditing ? (
                <>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={saveChanges}
                    disabled={loading}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center"
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving...
                      </div>
                    ) : (
                      <>
                        <FaSave className="mr-2" /> Save Changes
                      </>
                    )}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setIsEditing(false);
                      setPreviewImage(null);
                    }}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg flex items-center"
                  >
                    <FaTimes className="mr-2" /> Cancel
                  </motion.button>
                </>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsEditing(true)}
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg flex items-center"
                >
                  <FaEdit className="mr-2" /> Edit Profile
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DoctorProfile;
