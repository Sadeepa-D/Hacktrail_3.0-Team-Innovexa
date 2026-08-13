const express = require("express");
const router = express.Router();
const messageController = require("../controllers/message.controller");
const { authenticate } = require("../middleware/auth.middleware");

// ─── All Message Routes require JWT Authentication ─────────────────────────

// POST  /api/messages/send                      → Send a direct text message to a user
router.post("/send", authenticate, messageController.sendMessage);

// GET   /api/messages/conversations             → Get inbox list of all user conversations
router.get("/conversations", authenticate, messageController.getConversations);

// GET   /api/messages/conversation/:targetUserId → Get message history with a specific user
router.get("/conversation/:targetUserId", authenticate, messageController.getMessagesWithUser);

// PATCH /api/messages/read/:conversationId      → Mark all unread messages in conversation as read
router.patch("/read/:conversationId", authenticate, messageController.markAsRead);

module.exports = router;
