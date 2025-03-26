{
  /**import jwt from "jsonwebtoken";

// Middleware to verify JWT token
export const verifyToken = (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader) {
    return res
      .status(401)
      .json({ message: "Access denied, no token provided" });
  }

  // Extract token if prefixed with "Bearer "
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token" });
  }
};

// Middleware to check if user is a doctor
export const isDoctor = (req, res, next) => {
  if (req.user.role !== "doctor") {
    return res
      .status(403)
      .json({ message: "Access denied, only doctors are permitted" });
  }
  next();
};

// Middleware to check if user is a patient
export const isPatient = (req, res, next) => {
  if (req.user.role !== "patient") {
    return res
      .status(403)
      .json({ message: "Access denied, only patients are allowed" });
  }
  next();
}; */
}
