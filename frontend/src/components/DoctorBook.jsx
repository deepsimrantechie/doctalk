import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const DoctorBook = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [isBooking, setIsBooking] = useState(false);
  const calendarRef = useRef(null);

  // Generate time slots from 8 AM to 9 PM
  const timeSlots = [];
  for (let hour = 8; hour <= 21; hour++) {
    const time = `${hour.toString().padStart(2, "0")}:00`;
    timeSlots.push(time);
  }

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!doctorId) {
      setError("Doctor ID is missing");
      setLoading(false);
      return;
    }

    const fetchDoctor = async () => {
      try {
        const res = await axios.get(
          `http://localhost:6002/api/user/${doctorId}`
        );
        setDoctor(res.data);
      } catch (err) {
        console.error("Error fetching doctor:", err);
        setError("Failed to load doctor details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [doctorId]);

  const handleBooking = async () => {
    if (!selectedDate) {
      setBookingError("Please select a date for your appointment");
      return;
    }
    if (!selectedTime) {
      setBookingError("Please select a time for your appointment");
      return;
    }

    try {
      setIsBooking(true);
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login to book an appointment");
        navigate("/login");
        return;
      }

      const res = await axios.post(
        `http://localhost:6002/api/appointment/book`,
        {
          doctorId,
          date: selectedDate,
          time: selectedTime,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.status === 201) {
        setBookingSuccess(true);
        setBookingError("");
        setSelectedDate("");
        setSelectedTime("");
        toast.success("Appointment booked successfully!");
      }
    } catch (err) {
      console.error("Booking failed:", err);
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Booking failed. Please try again.";
      setBookingError(errorMessage);
      toast.error(errorMessage);

      if (err.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setIsBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md">
          <strong>Error:</strong> {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="md:flex">
            {/* Doctor Image Section */}
            <div className="md:w-1/3 bg-gray-50 p-8 flex flex-col items-center">
              <div className="w-64 h-64 rounded-full overflow-hidden border-4 border-white shadow-lg mb-6">
                <img
                  src={doctor?.profilePic || "https://via.placeholder.com/300"}
                  alt={doctor?.name || "Doctor"}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-800">
                  {doctor?.name}
                </h1>
                <h2 className="text-lg font-semibold text-blue-600 mb-2">
                  {doctor?.specialization}
                </h2>
                <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full inline-flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Verified Professional
                </div>
              </div>
            </div>

            {/* Doctor Details and Booking Section */}
            <div className="md:w-2/3 p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  About Dr. {doctor?.name}
                </h2>
                <p className="text-gray-600 mb-6">
                  {doctor?.bio ||
                    "Specialized in " +
                      doctor?.specialization +
                      " with " +
                      doctor?.experience +
                      " years of experience helping patients achieve better health."}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-700 mb-2">
                      Clinic Information
                    </h3>
                    <p className="text-gray-600">
                      <span className="font-medium">Clinic:</span>{" "}
                      {doctor?.clinic}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Location:</span>{" "}
                      {doctor?.location}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-700 mb-2">
                      Contact Details
                    </h3>
                    <p className="text-gray-600">
                      <span className="font-medium">Phone:</span>{" "}
                      {doctor?.contact}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Email:</span>{" "}
                      {doctor?.email || "contact@clinic.com"}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-700 mb-2">
                      Availability
                    </h3>
                    <p className="text-gray-600">
                      <span className="font-medium">Timings:</span>{" "}
                      {doctor?.workTimings}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-700 mb-2">
                      Consultation Fee
                    </h3>
                    <p className="text-2xl font-bold text-blue-600">
                      ₹{doctor?.fees}
                    </p>
                    <p className="text-sm text-gray-500">Per session</p>
                  </div>
                </div>
              </div>

              {/* Booking Section */}
              <div className="border-t pt-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Book an Appointment
                </h3>

                {bookingSuccess ? (
                  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>
                        Your appointment has been booked successfully!
                      </span>
                    </div>
                    <p className="mt-2 text-sm">
                      We've sent the confirmation to your email.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="mb-4">
                      <label className="block text-gray-700 font-medium mb-2">
                        Select Appointment Date
                      </label>
                      <div className="relative" ref={calendarRef}>
                        <input
                          type="date"
                          min={new Date().toISOString().split("T")[0]}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={selectedDate}
                          onChange={(e) => {
                            setSelectedDate(e.target.value);
                            setBookingError("");
                          }}
                          onFocus={() => setShowCalendar(true)}
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-gray-700 font-medium mb-2">
                        Select Appointment Time (8 AM - 9 PM)
                      </label>
                      <select
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={selectedTime}
                        onChange={(e) => {
                          setSelectedTime(e.target.value);
                          setBookingError("");
                        }}
                        disabled={!selectedDate}
                      >
                        <option value="">Select a time</option>
                        {timeSlots.map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                    </div>

                    {bookingError && (
                      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {bookingError}
                      </div>
                    )}

                    <div className="mt-6">
                      <button
                        onClick={handleBooking}
                        disabled={isBooking}
                        className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md transition duration-300 transform hover:scale-105 ${
                          isBooking ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        {isBooking ? "Booking..." : "Confirm Appointment"}
                      </button>
                    </div>

                    <div className="mt-4 text-center text-sm text-gray-500">
                      <p>
                        By booking, you agree to our Terms of Service and
                        Privacy Policy
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorBook;
