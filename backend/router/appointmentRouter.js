import express from "express";
import {
  bookAppointment,
  getDoctorAppointments,
  getPatientAppointments,
} from "../controller.js/appointmentController.js";
import verifyTokenMiddleware from "../middleware.js/verifyTokenMid.js";

const appointmentrouter = express.Router();

// Book an appointment (Patient)
appointmentrouter.post("/book", verifyTokenMiddleware, bookAppointment);

// Get all appointments for a patient
appointmentrouter.get(
  "/patient",
  verifyTokenMiddleware,
  getPatientAppointments
);

// Get all appointments for a doctor
appointmentrouter.get("/doctor", verifyTokenMiddleware, getDoctorAppointments);

export default appointmentrouter;
