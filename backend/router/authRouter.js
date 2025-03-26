import express from "express";
import {
  getAllDoctors,
  getDoctorById,
  getDoctorProfile,
  imagePatient,
  loginUser,
  registerUser,
  toggleDoctorAvailability,
  updateDoctorProfile,
} from "../controller.js/authController.js";
import upload from "../middleware.js/uploadMiddleware.js";
//import roleMiddleware from "../middleware.js/roleMiddleware.js";

const UserRouter = express.Router();

UserRouter.post("/register", registerUser);
UserRouter.post("/login", loginUser);
// Doctor Routes
UserRouter.put("/doctor/:id", upload.single("profilePic"), updateDoctorProfile); // Update doctor profile (with profile picture upload)
UserRouter.patch("/doctor/:id/availability", toggleDoctorAvailability); // Toggle doctor availability
UserRouter.get("/doctor/:id", getDoctorProfile); // Get doctor profile
UserRouter.get("/getAlldoctor", getAllDoctors);
UserRouter.get("/image", imagePatient);
UserRouter.get("/:id", getDoctorById);
export default UserRouter;
