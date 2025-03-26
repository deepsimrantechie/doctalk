import jwt from "jsonwebtoken";
import { configDotenv } from "dotenv";
configDotenv();

const verifyTokenMiddleware = (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id }; // Ensure 'id' exists in decoded payload
    if (!req.user.id) {
      return res.status(401).json({ message: "Token is invalid" });
    }
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error);
    return res.status(401).json({ message: "Token is not valid" });
  }
};

export default verifyTokenMiddleware;
