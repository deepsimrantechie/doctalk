import Appointment from "../models/appointmentmodel.js";
// 📌 Book an Appointment
export const bookAppointment = async (req, res) => {
  try {
    const { doctorId, date, time } = req.body;
    const patientId = req.user.id; // Extracted from JWT Token

    if (!doctorId || !date || !time) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newAppointment = new Appointment({ patientId, doctorId, date, time });
    await newAppointment.save();

    res
      .status(201)
      .json({ message: "Appointment booked successfully", newAppointment });
  } catch (error) {
    res.status(500).json({ error: "Failed to book appointment" });
  }
};

// 📌 Get All Appointments for a Patient
export const getPatientAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      patientId: req.user.id,
    }).populate("doctorId", "name specialization");

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch appointments" });
  }
};

// 📌 Get All Appointments for a Doctor
export const getDoctorAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      doctorId: req.user.id,
    }).populate("patientId", "name email");

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch appointments" });
  }
};
