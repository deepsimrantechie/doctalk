import multer from "multer";
import cloudinary from "../config/cloudinary.js";
import { CloudinaryStorage } from "multer-storage-cloudinary";

console.log("Initializing Cloudinary storage...");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "doctor_profiles",
    format: async () => "png",
    public_id: (req, file) => {
      console.log("Uploading file:", file.originalname);
      return `profile_${Date.now()}`;
    },
  },
});

const upload = multer({ storage });

// Log Middleware Execution
upload.single("profilePic");

console.log("Multer middleware initialized!");

export default upload;
