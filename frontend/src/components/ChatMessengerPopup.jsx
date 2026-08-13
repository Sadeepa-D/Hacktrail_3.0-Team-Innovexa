import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  MessageSquare, Send, X, Minus, Maximize2, Loader2,
  User, CheckCheck, Sparkles, ChevronLeft, Inbox
} from "lucide-react";
import { useAuth } from "../context/authcontext";
import {
  sendMessageApi, fetchConversationsApi,
  fetchMessagesApi, markAsReadApi
} from "../lib/messagesApi";
import toast from "react-hot-toast";

// Helper function to trigger opening a chat with a specific target user from anywhere
export const openDirectMessageWithUser = (targetUser) => {
  const event = new CustomEvent("OPEN_DIRECT_MESSAGE", { detail: targetUser });
  window.dispatchEvent(event);
};

const ChatMessengerPopup = () => {
  const { user: currentUser } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeTab, setActiveTab] = useState("chat"); // "chat" | "inbox"

  const [activeTargetUser, setActiveTargetUser] = useState(null); // { id, fname, lname, avatarUrl, city }
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);

  const [inputText, setInputText] = useState("");
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [totalUnread, setTotalUnread] = useState(0);

  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of messages container
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // ── Load Inbox Conversations ──────────────────────────────────────────────
  const loadConversations = useCallback(async () => {
    if (!currentUser) return;
    try {
      const data = await fetchConversationsApi();
      const list = data.conversations || [];
      setConversations(list);
      const total = list.reduce((acc, c) => acc + (c.unreadCount || 0), 0);
      setTotalUnread(total);
    } catch (err) {
      console.error("Fetch conversations error:", err);
    }
  }, [currentUser]);

  // ── Load Messages for Active Target User ─────────────────────────────────
  const loadMessages = useCallback(async (targetId, showLoader = false) => {
    if (!targetId) return;
    if (showLoader) setIsLoadingMessages(true);
    try {
      const data = await fetchMessagesApi(targetId);
      setMessages(data.messages || []);
      if (data.targetUser) {
        setActiveTargetUser((prev) => ({
          ...prev,
          ...data.targetUser,
        }));
      }
    } catch (err) {
      console.error("Fetch messages error:", err);
    } finally {
      if (showLoader) setIsLoadingMessages(false);
    }
  }, []);

  // Poll for live messages when chat window is active & open
  useEffect(() => {
    if (!isOpen || !activeTargetUser?.id) return;

    loadMessages(activeTargetUser.id, false);
    const interval = setInterval(() => {
      loadMessages(activeTargetUser.id, false);
      loadConversations();
    }, 3000); // 3-second poll for real-time responsiveness

    return () => clearInterval(interval);
  }, [isOpen, activeTargetUser?.id, loadMessages, loadConversations]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load conversations on mount & periodically
  useEffect(() => {
    if (currentUser) {
      loadConversations();
      const interval = setInterval(loadConversations, 10000);
      return () => clearInterval(interval);
    }
  }, [currentUser, loadConversations]);

  // Listen for global OPEN_DIRECT_MESSAGE event (e.g. from Profile page)
  useEffect(() => {
    const handleOpenMessage = (e) => {
      const targetUser = e.detail;
      if (!targetUser || !targetUser.id) return;

      setActiveTargetUser(targetUser);
      setActiveTab("chat");
      setIsOpen(true);
      setIsMinimized(false);
      loadMessages(targetUser.id, true);
    };

    window.addEventListener("OPEN_DIRECT_MESSAGE", handleOpenMessage);
    return () => window.removeEventListener("OPEN_DIRECT_MESSAGE", handleOpenMessage);
  }, [loadMessages]);

  // ── Send Message ─────────────────────────────────────────────────────────
  const handleSend = async (e) => {
    e.preventDefault();
    const content = inputText.trim();
    if (!content || !activeTargetUser?.id || isSending) return;

    setInputText("");
    setIsSending(true);

    // Optimistic UI update
    const tempId = `temp_${Date.now()}`;
    const optimisticMessage = {
      id: tempId,
      conversationId: "temp",
      senderId: currentUser.id,
      receiverId: activeTargetUser.id,
      content,
      isRead: false,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimisticMessage]);

    try {
      const res = await sendMessageApi(activeTargetUser.id, content);
      setMessages((prev) =>
        prev.map((m) => (m.id === tempId ? res.data : m))
      );
      loadConversations();
    } catch (err) {
      toast.error(err?.response?.data?.error || "Failed to send message.");
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
    } finally {
      setIsSending(false);
    }
  };

  if (!currentUser) return null; // Don't show messenger for unauthenticated users

  // Minimized floating launcher button
  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
            loadConversations();
          }}
          className="relative group p-4 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-2xl shadow-violet-950/80 active:scale-95 transition-all cursor-pointer flex items-center justify-center border border-violet-400/30"
          title="Open Messages"
        >
          <MessageSquare className="w-6 h-6" />
          {totalUnread > 0 && (
            <span className="absolute -top-1 -right-1 h-5 min-w-[20px] px-1 rounded-full bg-rose-500 text-white text-[11px] font-bold flex items-center justify-center shadow-md animate-pulse">
              {totalUnread}
            </span>
          )}
        </button>
      </div>
    );
  }

  // Active Messenger Popup Container
  return (
    <div className="fixed bottom-4 right-4 z-50 w-full max-w-sm sm:w-96 shadow-2xl shadow-violet-950/90 rounded-3xl bg-slate-900/95 border border-slate-800/90 backdrop-blur-2xl text-slate-100 font-sans overflow-hidden flex flex-col transition-all">
      {/* Header Bar */}
      <div className="px-4 py-3.5 bg-slate-950/80 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          {activeTab === "chat" && activeTargetUser ? (
            <>
              <button
                onClick={() => {
                  setActiveTab("inbox");
                  loadConversations();
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
                title="Back to Inbox"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {activeTargetUser.avatarUrl ? (
                <img
                  src={activeTargetUser.avatarUrl}
                  alt={activeTargetUser.fname || "User"}
                  className="w-8 h-8 rounded-full object-cover border border-violet-500/40 shrink-0"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {(activeTargetUser.fname || "U").charAt(0).toUpperCase()}
                </div>
              )}

              <div className="min-w-0">
                <h4 className="font-bold text-white text-sm truncate leading-tight">
                  {activeTargetUser.fname || activeTargetUser.lname
                    ? `${activeTargetUser.fname || ""} ${activeTargetUser.lname || ""}`.trim()
                    : "User"}
                </h4>
                <span className="text-[10px] text-emerald-400 font-medium block">Active Now</span>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center shadow-md">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-white text-sm">Direct Messages</span>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => setActiveTab(activeTab === "chat" ? "inbox" : "chat")}
            className={`p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors ${
              activeTab === "inbox" ? "text-violet-400 font-bold" : ""
            }`}
            title="Inbox Conversations"
          >
            <Inbox className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
            title="Close Messenger"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Body Section */}
      {!isMinimized && (
        <>
          {/* TAB 1: INBOX CONVERSATIONS LIST */}
          {activeTab === "inbox" && (
            <div className="h-80 overflow-y-auto divide-y divide-slate-800/50 p-2">
              {conversations.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6">
                  <div className="text-3xl mb-2">💬</div>
                  <p className="text-white font-semibold text-sm">No messages yet</p>
                  <p className="text-slate-400 text-xs mt-1">
                    Search a profile and click "Message" to start a direct text chat.
                  </p>
                </div>
              ) : (
                conversations.map((conv) => {
                  const targetName =
                    conv.otherUser.fname || conv.otherUser.lname
                      ? `${conv.otherUser.fname || ""} ${conv.otherUser.lname || ""}`.trim()
                      : "Community Member";

                  return (
                    <button
                      key={conv.id}
                      onClick={() => {
                        setActiveTargetUser(conv.otherUser);
                        setActiveTab("chat");
                        loadMessages(conv.otherUser.id, true);
                      }}
                      className="w-full p-3 rounded-2xl text-left hover:bg-slate-800/60 transition-all flex items-center gap-3 cursor-pointer group"
                    >
                      {conv.otherUser.avatarUrl ? (
                        <img
                          src={conv.otherUser.avatarUrl}
                          alt={targetName}
                          className="w-10 h-10 rounded-full object-cover shrink-0 border border-violet-500/30"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center text-white font-bold shrink-0">
                          {targetName.charAt(0).toUpperCase()}
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <span className="font-bold text-white text-xs truncate group-hover:text-violet-300 transition-colors">
                            {targetName}
                          </span>
                          <span className="text-[10px] text-slate-500 shrink-0">
                            {new Date(conv.lastMessageAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 truncate">
                          {conv.lastMessage || "No messages yet"}
                        </p>
                      </div>

                      {conv.unreadCount > 0 && (
                        <span className="h-5 min-w-[20px] px-1 rounded-full bg-violet-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                          {conv.unreadCount}
                        </span>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          )}

          {/* TAB 2: ACTIVE CHAT MESSAGES WINDOW */}
          {activeTab === "chat" && (
            <div className="flex flex-col h-96">
              {/* Message Feed */}
              <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3">
                {!activeTargetUser ? (
                  <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 text-xs">
                    Select a conversation or visit a user's profile to send a direct message.
                  </div>
                ) : isLoadingMessages ? (
                  <div className="h-full flex flex-col items-center justify-center gap-2 text-slate-400 text-xs">
                    <Loader2 className="w-6 h-6 text-violet-500 animate-spin" />
                    <span>Loading conversation...</span>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-4 text-slate-400 text-xs">
                    <div className="text-2xl mb-1">👋</div>
                    <p className="font-semibold text-slate-200">Start the conversation</p>
                    <p className="text-slate-400 text-[11px] mt-0.5">
                      Send a friendly direct message to {activeTargetUser.fname || "this user"}.
                    </p>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isMe = msg.senderId === currentUser.id;
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                      >
                        <div
                          className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
                            isMe
                              ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-br-none shadow-md shadow-violet-950/40"
                              : "bg-slate-800/90 text-slate-100 border border-slate-700/60 rounded-bl-none"
                          }`}
                        >
                          {msg.content}
                        </div>
                        <span className="text-[10px] text-slate-500 mt-1 px-1 flex items-center gap-1">
                          {new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                          {isMe && (
                            <CheckCheck
                              className={`w-3 h-3 ${msg.isRead ? "text-violet-400" : "text-slate-500"}`}
                            />
                          )}
                        </span>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Text Message Input Bar */}
              {activeTargetUser && (
                <form
                  onSubmit={handleSend}
                  className="p-3 bg-slate-950/90 border-t border-slate-800/80 flex items-center gap-2"
                >
                  <input
                    type="text"
                    placeholder={`Message ${activeTargetUser.fname || "user"}...`}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="flex-1 px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-full text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/70 transition-all"
                  />
                  <button
                    type="submit"
                    disabled={!inputText.trim() || isSending}
                    className="p-2.5 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg disabled:opacity-50 transition-all cursor-pointer shrink-0"
                  >
                    {isSending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </button>
                </form>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ChatMessengerPopup;
