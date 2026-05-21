import express from "express";
import rateLimit from "express-rate-limit";
import { signup, login } from "../controllers/authController.js";

import { refreshAccessToken } from "../controllers/authController.js";
import { logout } from "../controllers/authController.js";

import { forgotPassword, resetPassword } from "../controllers/authController.js";

import { googleLogin } from "../controllers/authController.js";

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, //15 min
  max: 100, // Each IP can sedn 100 request per window ms, means 100 requests in 15 min
  message: "Too many authentication requests, try again later"
});

router.post("/signup", authLimiter, signup);
router.post("/login", authLimiter, login);
router.post("/refresh-token", refreshAccessToken);
router.post("/logout", logout);
router.post("/forgot-password", authLimiter, forgotPassword);
router.post("/reset-password", authLimiter, resetPassword);
router.post("/google", googleLogin);

export default router;