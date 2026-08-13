import api from "../context/apiinstance";

// POST – Send a direct text message to another user
export const sendMessageApi = (receiverId, content) =>
  api.post("/messages/send", { receiverId, content }).then((r) => r.data);

// GET – Fetch all conversations for current user (Inbox)
export const fetchConversationsApi = () =>
  api.get("/messages/conversations").then((r) => r.data);

// GET – Fetch message history with a specific target user ID
export const fetchMessagesApi = (targetUserId) =>
  api.get(`/messages/conversation/${targetUserId}`).then((r) => r.data);

// PATCH – Mark conversation as read
export const markAsReadApi = (conversationId) =>
  api.patch(`/messages/read/${conversationId}`).then((r) => r.data);
