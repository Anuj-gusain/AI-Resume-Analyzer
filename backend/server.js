import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import resumeRoute from "./routes/resumeRoute.js";
import authRoute from "./routes/authRoute.js";

dotenv.config();

const app = express();

// ✅ Middleware (ONLY THIS)
app.use(cors());
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));

// ✅ MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// ✅ Routes
app.use("/api/auth", authRoute);
app.use("/api/resume", resumeRoute);

// ✅ Server
app.listen(5000, () => console.log("Server running on port 5000"));