import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";
import { addProject, getProjects, deleteProject } from "../controllers/projectController.js";

const router = express.Router();

router.post("/add",authMiddleware,addProject);
router.get("/",authMiddleware,getProjects);
router.delete("/:id",authMiddleware,deleteProject);

export default router;