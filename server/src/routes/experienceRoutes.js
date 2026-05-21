import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { addExperiece, getExperiences, deleteExperience } from "../controllers/experienceController.js";

const router = express.Router();

router.post("/add", authMiddleware, addExperiece);
router.get("/", authMiddleware, getExperiences);
router.delete("/:id", authMiddleware, deleteExperience);

export default router;
