import "dotenv/config";
import dns from "dns";
dns.setDefaultResultOrder("ipv4first"); //tries ipv4 first

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan"; // used for request logging
import compression from "compression" //used for gzip responses
import cookieParser from "cookie-parser" // when app in production, instead of localStorage, httpOnly cookies should be preferred

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import skillRoutes from "./routes/skillRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import educationRoutes from "./routes/educationRoutes.js";
import experienceRoutes from "./routes/experienceRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import vectorRoutes from "./routes/vectorRoutes.js";

const app = express();

app.use(helmet());
app.use(compression());
app.use(morgan("dev"));
app.use(cookieParser());

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
  exposedHeaders: ["x-conversation-id"] // used, so that headers wont be blocked if frontend and backend are deployed on different platforms
}));

app.use(express.json());

app.use("/api/auth", authRoutes); //uses /api/auth before calling any route.
app.use("/api/user", userRoutes); //uses /api/user
app.use("/api/profile", profileRoutes); //route for profile section.
app.use("/api/skills", skillRoutes); //route for skills section
app.use("/api/projects", projectRoutes); //routes for proj section
app.use("/api/education", educationRoutes); //route for education section
app.use("/api/experience", experienceRoutes); //route for experience section
app.use("/api/chat", chatRoutes); //route for chat section
app.use("/api/vectors", vectorRoutes); // route for vectors

app.get("/", (req, res) => {
  res.json({
    message: "Server is Running",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



