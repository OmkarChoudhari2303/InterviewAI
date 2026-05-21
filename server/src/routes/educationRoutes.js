import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";
import { addEducation, getEducations, deleteEducation } from "../controllers/educationController.js";

const router = express.Router();

router.post("/add",authMiddleware,addEducation);
router.get("/",authMiddleware,getEducations);
router.delete("/:id",authMiddleware,deleteEducation);

export default router;
