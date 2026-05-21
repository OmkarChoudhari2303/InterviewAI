import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import {createProfile, getProfile} from "../controllers/profileController.js";

const router = express.Router();

router.post("/create",authMiddleware,createProfile); //process is like req->middleware(if valid)->create profile->response
router.get("/", authMiddleware, getProfile);

export default router;