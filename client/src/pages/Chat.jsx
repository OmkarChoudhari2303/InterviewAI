import { useState, useEffect, useRef, useCallback } from "react";
import axiosInstance from "../api/axios.js";
import MessageBubble from "../components/chat/MessageBubble.jsx";

function Chat() {
  const [messages, setMessages] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);

  const messageEndRef = useRef(null);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const fetchConversations = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axiosInstance.get("/chat/conversations", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setConversations(response.data.conversations);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const loadConversation = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axiosInstance.get(`/chat/conversations/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessages(response.data.conversation.messages);
      setConversationId(id);
    } catch (error) {
      console.log(error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();

    if (!prompt.trim()) return;

    try {
      setLoading(true);

      setIsStreaming(true);
      //add users messages
      const userMessage = {
        role: "user",
        content: prompt,
      };

      setMessages((prev) => [...prev, userMessage]);

      const currentPrompt = prompt;

      setPrompt("");

      let token = localStorage.getItem("token");

      let response = await fetch(
        `${import.meta.env.VITE_API_URL}/chat/stream`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",

            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            prompt: currentPrompt,
            conversationId,
          }),
        },
      );

      setIsStreaming(false);

      if (response.status === 401) {
        try {
          const refreshRes = await axiosInstance.post("/auth/refresh-token", {}, {
            withCredentials: true
          });

          const { accessToken } = refreshRes.data;

          localStorage.setItem("token", accessToken);

          token = accessToken;

          response = await fetch(
            `${import.meta.env.VITE_API_URL}/chat/stream`,
            {
              method: "POST",

              headers: {
                "Content-Type": "application/json",

                Authorization: `Bearer ${token}`,
              },

              body: JSON.stringify({
                prompt: currentPrompt,
                conversationId,
              }),
            },
          );
        } catch (refreshError) {
          console.error("Session expired:", refreshError);
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");
          window.location.href = "/login";
          return;
        }
      }

      const newConversationId = response.headers.get("x-conversation-id");

      if (newConversationId && !conversationId) {
        setConversationId(newConversationId);
        fetchConversations();
      }

      if (!response.body) {
        throw new Error("No response body");
      }

      const reader = response.body.getReader();

      const decoder = new TextDecoder();

      let aiResponse = "";

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "",
        },
      ]);

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;
        const chunk = decoder.decode(value, {
          stream: true,
        });

        aiResponse += chunk;

        setMessages((prev) => {
          const updated = [...prev];

          updated[updated.length - 1] = {
            role: "assistant",
            content: aiResponse,
          };

          return updated;
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteConversation = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axiosInstance.delete(`/chat/conversations/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // If the deleted conversation is the active one, reset the chat
      if (conversationId === id) {
        setMessages([]);
        setConversationId(null);
      }
      fetchConversations();
    } catch (error) {
      console.log(error);
    }
  };

  const resetChat = () => {
    setMessages([]);
    setConversationId(null);
  };

  return (
    <div className="h-screen bg-black text-white flex overflow-hidden">
      {/* Sidebar Container */}
      <div className="w-[320px] border-r border-zinc-800 flex flex-col bg-zinc-950">
        <div className="p-0 border-b border-zinc-800">
          <h1 className="text-8xl font-bold tracking-tight">InterviewAI Chat</h1>
        </div>
        <div className="p-4">
          <button
            onClick={resetChat}
            className="w-full bg-white text-black p-3 rounded-lg font-semibold hover:bg-zinc-200 transition cursor-pointer"
          >
            + New Chat
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 pt-0 space-y-2">
          <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
            Conversations
          </h2>
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`flex items-center gap-2 rounded-lg p-2 ${
                conversationId === conversation.id
                  ? "bg-zinc-800"
                  : "bg-zinc-900/50 hover:bg-zinc-900"
              }`}
            >
              <p className="text-xs text-zinc-500 mt-1">
                {
                  new Date(conversation.updatedAt).toLocaleDateString()
                }
              </p>
              <button
                onClick={() => loadConversation(conversation.id)}
                className="flex-1 text-left truncate text-sm text-white"
              >
                {conversation.title || "New Chat"}
              </button>
              <button
                onClick={() => deleteConversation(conversation.id)}
                className="text-red-400 hover:text-red-300 text-xs px-2 py-1 rounded transition cursor-pointer"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Display Window */}
      <div className="flex-1 flex flex-col h-full bg-black">
        {/* Messages Body */}
        {
          messages.length === 0 && (
            <div className="
            h-full
            flex
            items-center
            justify-center
            text-zinc-500
            ">
              Start a conversation with Gemini
            </div>
          )
        }
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message, index) => (
            <MessageBubble key={index} message={message} />
          ))}

          {loading && messages[messages.length - 1]?.role === "user" && (
            <div className="bg-zinc-900 px-4 py-3 rounded-2xl w-fit text-sm text-zinc-400 animate-pulse">
              {
                isStreaming && (
                  <div className="
                  text-zinc-500
                  text-sm
                  italic
                  mt-2
                  ">
                    Gemini is thinking...
                  </div>
                )
              }
            </div>
          )}
          <div ref={messageEndRef} />
        </div>

        {/* Fixed Form Workspace Input Alignment */}
        <form
          onSubmit={sendMessage}
          className="p-4 border-t border-zinc-800 bg-black flex gap-4"
        >
          <input
            type="text"
            placeholder="Ask Something..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="flex-1 p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-sm outline-none focus:border-zinc-600 transition"
          />
          <button
            type="submit"
            disabled={loading || !prompt.trim()}
            className="bg-white text-black px-6 rounded-lg font-semibold text-sm hover:bg-zinc-200 transition disabled:opacity-50"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default Chat;
