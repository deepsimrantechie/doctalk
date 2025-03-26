import express from "express";
import cors from "cors";
import { configDotenv } from "dotenv";
import connectDB from "./config/db.js";
import UserRouter from "./router/authRouter.js";
import BlogRouter from "./router/blogRoutes.js";
import appointmentrouter from "./router/appointmentRouter.js";

configDotenv();
const app = express();
const port = process.env.PORT || 6002;

app.use(express.json());
app.use(cors());
app.use("/api/user", UserRouter);
app.use("/api/blog", BlogRouter);
app.use("/api/appointment", appointmentrouter);

app.get("/", (req, res) => {
  res.send("Api is working find ");
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
