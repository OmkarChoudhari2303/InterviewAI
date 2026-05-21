import express from "express"

import authMiddleware from "../middleware/authMiddleware.js"

import { addSkill, getSkills, deleteSkill } from "../controllers/skillController.js";

const router = express.Router();

router.post("/add",authMiddleware,addSkill)
router.get("/",authMiddleware,getSkills)
router.delete("/:id",authMiddleware,deleteSkill)

export default router;