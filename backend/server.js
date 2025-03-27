import express from "express";
import cors from "cors";
import { configDotenv } from "dotenv";
import connectDB from "./config/db.js";
import UserRouter from "./router/authRouter.js";
import BlogRouter from "./router/blogRoutes.js";
import appointmentrouter from "./router/appointmentRouter.js";
import path from "path";

configDotenv();
const app = express();
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "frontend/build")));
const port = process.env.PORT || 6002;
const allowedOrigins = [
  "http://localhost:5173", // Development
  "https://doctalk-frontend-uhes.onrender.com",
];

app.use(express.json());
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g., Postman, mobile apps)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true, // Enable sending cookies, auth headers, etc.
  })
);
app.use("/api/user", UserRouter);
app.use("/api/blog", BlogRouter);
app.use("/api/appointment", appointmentrouter);

// Catch-all route to serve `index.html`
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend/build", "index.html"));
});

const startServer = () => {
  try {
    connectDB();
    app.listen(port, () => {
      console.log(`Server is started at the ${port}`);
    });
  } catch (error) {
    console.log("error in the server ");
  }
};

startServer();
