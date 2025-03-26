import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["patient", "doctor"], required: true },
  specialization: { type: String, default: "" }, // Only for doctors
  experience: { type: Number, default: 0 }, // Only for doctors
  age: { type: Number, default: 0 }, // Only for patients
  clinic: { type: String, default: "" }, // Only for doctors
  location: { type: String, default: "" }, // Only for doctors
  fees: { type: Number, default: 0 }, // Only for doctors
  contact: { type: Number, default: 0 },
  languages: { type: String, default: "" }, // Only for doctors
  workTimings: { type: String, default: "" }, // Only for doctors
  isAvailable: { type: Boolean, default: true }, // Only for doctors
  profilePic: { type: String, default: "" }, // Only for doctors
});

// Update `updatedAt` before saving
userSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});
// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const User = mongoose.model("User", userSchema);
export default User;

{
  /**phele walaimport mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["patient", "doctor"], required: true },
  specialization: { type: String, default: "" }, // Only for doctors
  experience: { type: Number, default: 0 }, // Only for doctors
  age: { type: Number, default: 0 }, // Only for patients
  clinic: { type: String, default: "" }, // Only for doctors
  location: { type: String, default: "" }, // Only for doctors
  fees: { type: Number, default: 0 }, // Only for doctors
  contact: { type: Number, default: 0 },
  languages: { type: String, default: "" }, // Only for doctors
  workTimings: { type: String, default: "" }, // Only for doctors
  isAvailable: { type: Boolean, default: true }, // Only for doctors
  profilePic: { type: String, default: "" }, // Only for doctors
});
// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const User = mongoose.model("User", userSchema);
export default User;
 */
}
