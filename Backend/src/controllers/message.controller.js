const { prisma } = require("../config/dbcon");

// Helper to consistently order user IDs for unique Conversation constraint
const getOrderedUserIds = (id1, id2) => {
  return id1 < id2 ? { user1Id: id1, user2Id: id2 } : { user1Id: id2, user2Id: id1 };
};

const messageController = {
  // ── 1. SEND TEXT MESSAGE ──────────────────────────────────────────────────
  // POST /api/messages/send
  sendMessage: async (req, res) => {
    try {
      const senderId = req.user.id;
      const { receiverId, content } = req.body;

      if (!receiverId || !content || !content.trim()) {
        return res.status(400).json({ error: "Receiver ID and message text are required." });
      }

      if (senderId === receiverId) {
        return res.status(400).json({ error: "You cannot message yourself." });
      }

      // Verify receiver user exists
      const receiver = await prisma.user.findUnique({
        where: { id: receiverId },
        select: { id: true, fname: true, lname: true, avatarUrl: true, isactive: true },
      });

      if (!receiver || receiver.isactive !== "ACTIVE") {
        return res.status(404).json({ error: "Recipient user not found or inactive." });
      }

      // Get consistent pair IDs
      const { user1Id, user2Id } = getOrderedUserIds(senderId, receiverId);

      // Find or create conversation
      let conversation = await prisma.conversation.findUnique({
        where: { user1Id_user2Id: { user1Id, user2Id } },
      });

      const trimmedContent = content.trim();

      if (!conversation) {
        conversation = await prisma.conversation.create({
          data: {
            user1Id,
            user2Id,
            lastMessage: trimmedContent,
            lastMessageAt: new Date(),
          },
        });
      } else {
        await prisma.conversation.update({
          where: { id: conversation.id },
          data: {
            lastMessage: trimmedContent,
            lastMessageAt: new Date(),
          },
        });
      }

      // Create the text message
      const message = await prisma.message.create({
        data: {
          conversationId: conversation.id,
          senderId,
          receiverId,
          content: trimmedContent,
        },
        select: {
          id: true,
          conversationId: true,
          senderId: true,
          receiverId: true,
          content: true,
          isRead: true,
          createdAt: true,
          sender: {
            select: { id: true, fname: true, lname: true, avatarUrl: true },
          },
        },
      });

      return res.status(201).json({
        message: "Message sent successfully!",
        data: message,
        conversationId: conversation.id,
      });
    } catch (error) {
      console.error("Send Message Error:", error);
      return res.status(500).json({ error: "Failed to send message.", details: error.message });
    }
  },

  // ── 2. GET USER CONVERSATIONS (INBOX) ─────────────────────────────────────
  // GET /api/messages/conversations
  getConversations: async (req, res) => {
    try {
      const userId = req.user.id;

      const conversations = await prisma.conversation.findMany({
        where: {
          OR: [{ user1Id: userId }, { user2Id: userId }],
        },
        select: {
          id: true,
          user1Id: true,
          user2Id: true,
          lastMessage: true,
          lastMessageAt: true,
          createdAt: true,
          user1: {
            select: { id: true, fname: true, lname: true, city: true, avatarUrl: true },
          },
          user2: {
            select: { id: true, fname: true, lname: true, city: true, avatarUrl: true },
          },
          _count: {
            select: {
              messages: {
                where: {
                  receiverId: userId,
                  isRead: false,
                },
              },
            },
          },
        },
        orderBy: { lastMessageAt: "desc" },
      });

      // Format response to identify the "otherUser" for each conversation
      const formatted = conversations.map((conv) => {
        const otherUser = conv.user1Id === userId ? conv.user2 : conv.user1;
        return {
          id: conv.id,
          otherUser,
          lastMessage: conv.lastMessage,
          lastMessageAt: conv.lastMessageAt,
          unreadCount: conv._count.messages,
        };
      });

      return res.status(200).json({ conversations: formatted });
    } catch (error) {
      console.error("Get Conversations Error:", error);
      return res.status(500).json({ error: "Failed to fetch conversations." });
    }
  },

  // ── 3. GET MESSAGES WITH A SPECIFIC TARGET USER ───────────────────────────
  // GET /api/messages/conversation/:targetUserId
  getMessagesWithUser: async (req, res) => {
    try {
      const currentUserId = req.user.id;
      const { targetUserId } = req.params;

      if (currentUserId === targetUserId) {
        return res.status(400).json({ error: "Invalid target user." });
      }

      // Fetch target user details
      const targetUser = await prisma.user.findUnique({
        where: { id: targetUserId },
        select: { id: true, fname: true, lname: true, city: true, avatarUrl: true },
      });

      if (!targetUser) {
        return res.status(404).json({ error: "Target user not found." });
      }

      const { user1Id, user2Id } = getOrderedUserIds(currentUserId, targetUserId);

      const conversation = await prisma.conversation.findUnique({
        where: { user1Id_user2Id: { user1Id, user2Id } },
      });

      if (!conversation) {
        return res.status(200).json({
          conversationId: null,
          targetUser,
          messages: [],
        });
      }

      // Fetch message history
      const messages = await prisma.message.findMany({
        where: { conversationId: conversation.id },
        select: {
          id: true,
          conversationId: true,
          senderId: true,
          receiverId: true,
          content: true,
          isRead: true,
          createdAt: true,
        },
        orderBy: { createdAt: "asc" },
      });

      // Mark unread messages sent to currentUserId as read
      await prisma.message.updateMany({
        where: {
          conversationId: conversation.id,
          receiverId: currentUserId,
          isRead: false,
        },
        data: { isRead: true },
      });

      return res.status(200).json({
        conversationId: conversation.id,
        targetUser,
        messages,
      });
    } catch (error) {
      console.error("Get Messages Error:", error);
      return res.status(500).json({ error: "Failed to fetch messages." });
    }
  },

  // ── 4. MARK CONVERSATION AS READ ──────────────────────────────────────────
  // PATCH /api/messages/read/:conversationId
  markAsRead: async (req, res) => {
    try {
      const currentUserId = req.user.id;
      const { conversationId } = req.params;

      await prisma.message.updateMany({
        where: {
          conversationId,
          receiverId: currentUserId,
          isRead: false,
        },
        data: { isRead: true },
      });

      return res.status(200).json({ message: "Messages marked as read." });
    } catch (error) {
      console.error("Mark Read Error:", error);
      return res.status(500).json({ error: "Failed to mark messages as read." });
    }
  },
};

module.exports = messageController;
