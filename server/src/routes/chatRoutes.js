import express from "express";

import { sendMessage } from "../controllers/chatController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import { streamMessage } from "../controllers/chatController.js";
import { getConversations, getConversationMessages, deleteConversation } from "../controllers/chatController.js";

const router = express.Router();

router.post("/message", authMiddleware, sendMessage);
router.post("/stream", authMiddleware, streamMessage);
router.get("/conversations", authMiddleware, getConversations); //gets last conversations
router.get("/conversations/:id", authMiddleware, getConversationMessages); //gets conversation messages
router.delete("/conversations/:id", authMiddleware, deleteConversation); //deletes a conversation

export default router;
