import User from "../models/User.js";
import bcrypt from "bcryptjs";
import cloudinary from "../config/cloudinary.js";
import jwt from "jsonwebtoken"; // ✅ Added missing import

// Register user (doctor or patient)
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, specialization, experience, age } =
      req.body;

    // Check if user already exists
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    const newUser = new User({
      name,
      email,
      password,
      role,
      specialization: role === "doctor" ? specialization : "", // 🔄 Fixed from undefined
      experience: role === "doctor" ? experience : 0, // 🔄 Fixed from null
      age: role === "patient" ? age : 0, // 🔄 Fixed from null
    });

    console.log("🔑 Plain Password Before Hashing:", password);
    console.log("🔒 Hashed Password Before Saving:", newUser.password);

    // Save user to database
    const savedUser = await newUser.save();

    // Return user ID and relevant data
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role,
      },
    });
  } catch (error) {
    console.error("❌ Server error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Login user (both doctor & patient)
export const loginUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    console.log(`🔍 Searching for user: ${email}`);
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      console.log(`❌ User not found: ${email}`);
      return res.status(400).json({ message: "User not found" });
    }

    if (role && role.toLowerCase() !== user.role.toLowerCase()) {
      console.log(
        `❌ Role mismatch: Provided (${role}) != Expected (${user.role})`
      );
      return res
        .status(403)
        .json({ message: "Role mismatch. Please select the correct role" });
    }

    console.log("🔑 Stored Hashed Password:", user.password);
    console.log("🔑 Entered Password:", password);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("❌ Password mismatch");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.log("✅ Password match, generating token...");
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePic: user.profilePic,
        ...(user.role === "doctor" && {
          specialization: user.specialization,
          experience: user.experience,
          clinic: user.clinic,
          location: user.location,
          fees: user.fees,
          contact: user.contact,
          languages: user.languages,
          workTimings: user.workTimings,
          isAvailable: user.isAvailable,
        }),
        ...(user.role === "patient" && { age: user.age }),
      },
    });
  } catch (error) {
    console.error("❌ Server error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
// Toggle doctor availability (with debugging)
import mongoose from "mongoose";
const { ObjectId } = mongoose.Types;

export const toggleDoctorAvailability = async (req, res) => {
  try {
    console.log(`Toggling availability for doctor ID: ${req.params.id}`);

    const doctorId = new ObjectId(req.params.id);
    let doctor = await User.findOne({ _id: doctorId, role: "doctor" });

    if (!doctor) {
      console.log("Doctor not found");
      return res.status(400).json({ message: "Doctor not found" });
    }

    // Toggle availability
    doctor.isAvailable = !doctor.isAvailable;
    await doctor.save();

    console.log({
      message: `Doctor availability updated: ${
        doctor.isAvailable ? "Available" : "Not Available"
      }`,
      isAvailable: doctor.isAvailable,
    });

    res.json({
      message: "Availability updated",
      isAvailable: doctor.isAvailable,
    });
  } catch (error) {
    console.error("Error toggling availability", error);
    res.status(500).json({ message: "Error toggling availability" });
  }
};

// Get doctor profile
export const getDoctorProfile = async (req, res) => {
  try {
    console.log(`Fetching user profile for ID: ${req.params.id}`);

    const userId = new ObjectId(req.params.id); // Convert to ObjectId

    // Find the user by ID (no role check)
    const user = await User.findOne({ _id: userId });

    if (!user) {
      console.error("User not found for ID:", req.params.id);
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};
// Update doctor profile
export const updateDoctorProfile = async (req, res) => {
  try {
    console.log(`Updating user profile for ID: ${req.params.id}`);
    console.log("Request body:", req.body);
    console.log("Uploaded file:", req.file);

    const userId = new ObjectId(req.params.id); // Convert to ObjectId

    let {
      specialization,
      experience,
      clinic,
      location,
      fees,
      languages,
      workTimings,
      contact,
    } = req.body;

    specialization = specialization?.replace(/^"|"$/g, ""); // Cleanup

    experience = Number(experience);
    fees = Number(fees);

    // Find the user
    let user = await User.findOne({ _id: userId });
    if (!user) {
      console.log("User profile not found");
      return res.status(404).json({ message: "User profile not found" });
    }

    // Handle profile picture upload only if a file is provided
    let profilePicUrl = user.profilePic;
    if (req.file && req.file.path) {
      console.log("Uploading to Cloudinary...");
      const result = await cloudinary.uploader.upload(req.file.path);
      profilePicUrl = result.secure_url;
    }

    // Update fields
    user.specialization = specialization || user.specialization;
    user.experience = isNaN(experience) ? user.experience : experience;
    user.clinic = clinic || user.clinic;
    user.location = location || user.location;
    user.fees = isNaN(fees) ? user.fees : fees;
    user.languages = languages || user.languages;
    user.workTimings = workTimings || user.workTimings;
    user.profilePic = profilePicUrl;
    user.contact = contact || user.contact;

    console.log("📝 Updated User Data Before Saving:", user);
    await user.save();

    console.log("✅ User profile updated successfully!");
    res.json({ message: "User profile updated successfully!", user });
  } catch (error) {
    console.error("❌ Error updating user profile:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//getall doctor detals
export const getAllDoctors = async (req, res) => {
  try {
    const { specialty } = req.query;

    // ✅ Fetch only doctors (role: "doctor")
    const query = { role: "doctor" };

    if (specialty && specialty !== "All") {
      query.specialization = specialty;
    }

    const doctors = await User.find(query).select(
      "name specialization experience profilePic"
    );

    if (!doctors.length) {
      return res.status(404).json({ message: "No doctors found" });
    }

    res.status(200).json(doctors);
  } catch (error) {
    console.error("Error fetching doctors:", error.message);
    res.status(500).json({ message: "Error fetching doctors", error });
  }
};
//getpateint or user images only
export const imagePatient = async (req, res) => {
  try {
    const patients = await User.find({ role: "patient" }).select("profilePic");

    if (patients.length === 0) {
      return res.status(404).json({ message: "No patients found" });
    }

    res.status(200).json({ patients });
  } catch (error) {
    console.error("Error fetching patient profile pictures:", error.message);
    res
      .status(500)
      .json({ message: "Error fetching patient profile pictures" });
  }
};

// Get Doctor Profile by ID
export const getDoctorById = async (req, res) => {
  try {
    console.log("Fetching doctor with ID:", req.params.id);

    const doctor = await User.findOne({ _id: req.params.id, role: "doctor" });

    if (!doctor) {
      console.log("Doctor not found");
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.json(doctor);
  } catch (error) {
    console.error("Error fetching doctor:", error);
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid doctor ID format" });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
