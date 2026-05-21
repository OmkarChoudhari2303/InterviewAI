import express from "express"

import authMiddleware from "../middleware/authMiddleware.js"

import { syncVectors } from "../controllers/vectorController.js"
import { auth } from "google-auth-library"

const router = express.Router()

router.post("/sync", authMiddleware, syncVectors);

export default router