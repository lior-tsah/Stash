import { useCallback, useMemo, useRef, useState } from "react";
import {
  Box,
  CircularProgress,
  IconButton,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { sendChat } from "../api/Api";

type ChatRole = "user" | "assistant";

interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: number;
}

const uuid = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const extractConversationId = (data: unknown): string | undefined => {
  if (!data || typeof data !== "object") return undefined;
  const asAny = data as any;
  const possible =
    asAny.id ??
    asAny.conversationId ??
    asAny.conversation_id ??
    asAny.threadId ??
    asAny.thread_id;
  return typeof possible === "string" && possible.length > 0 ? possible : undefined;
};

const extractAssistantText = (data: unknown): string | undefined => {
  if (typeof data === "string") return data;
  if (!data || typeof data !== "object") return undefined;
  const asAny = data as any;
  const possible =
    asAny.reply ??
    asAny.response ??
    asAny.message ??
    asAny.text ??
    asAny.output;
  return typeof possible === "string" && possible.trim().length > 0
    ? possible
    : undefined;
};

const localFallbackReply = (userText: string) => {
  const t = userText.trim().toLowerCase();
  if (!t) return "Send me a message and I’ll respond.";
  if (t.includes("help")) {
    return "Tell me what you’re trying to do (e.g., 'scan network', 'show vulnerabilities').";
  }
  return `I couldn’t reach the chat backend right now. You said: "${userText}"`;
};

const bubbleSx = (role: ChatRole) =>
  role === "user"
    ? {
        alignSelf: "flex-end",
        bgcolor: "action.selected",
        px: 1.25,
        py: 0.75,
        borderRadius: 1.5,
        maxWidth: "85%",
        whiteSpace: "pre-wrap",
      }
    : {
        alignSelf: "flex-start",
        bgcolor: "background.default",
        px: 1.25,
        py: 0.75,
        borderRadius: 1.5,
        maxWidth: "85%",
        whiteSpace: "pre-wrap",
        border: 1,
        borderColor: "divider",
      };

export default function ChatBotPanel() {
  const [conversationId, setConversationId] = useState<string | undefined>(undefined);
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: uuid(),
      role: "assistant",
      content: "Hi! Ask me anything.",
      createdAt: Date.now(),
    },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);

  const scrollRef = useRef<HTMLDivElement | null>(null);

  const canSend = useMemo(() => input.trim().length > 0 && !sending, [input, sending]);

  const scrollToBottom = () => {
    // Defer so DOM has time to paint the new message
    setTimeout(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }, 0);
  };

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || sending) return;

    setSending(true);
    setInput("");

    setMessages((prev) => [
      ...prev,
      { id: uuid(), role: "user", content: text, createdAt: Date.now() },
    ]);
    scrollToBottom();

    try {
      const data = await sendChat(text, conversationId);
      const nextConversationId = extractConversationId(data) ?? conversationId;
      const assistantText = extractAssistantText(data) ?? localFallbackReply(text);

      setConversationId(nextConversationId);
      setMessages((prev) => [
        ...prev,
        {
          id: uuid(),
          role: "assistant",
          content: assistantText,
          createdAt: Date.now(),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: uuid(),
          role: "assistant",
          content: localFallbackReply(text),
          createdAt: Date.now(),
        },
      ]);
    } finally {
      setSending(false);
      scrollToBottom();
    }
  }, [conversationId, input, sending]);

  return (
    <Paper
      elevation={2}
      sx={{
        p: 2,
        display: "flex",
        flexDirection: "column",
        height: 460,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Typography variant="h6">Chat</Typography>
        {sending ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CircularProgress size={16} />
            <Typography variant="caption">Thinking…</Typography>
          </Box>
        ) : null}
      </Box>

      <Box
        ref={scrollRef}
        sx={{
          mt: 1.5,
          flex: 1,
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 1,
          pr: 0.5,
        }}
      >
        {messages.map((m) => (
          <Box key={m.id} sx={bubbleSx(m.role)}>
            <Typography variant="body2">{m.content}</Typography>
          </Box>
        ))}
      </Box>

      <Box sx={{ display: "flex", gap: 1, mt: 1.5 }}>
        <TextField
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              void send();
            }
          }}
          placeholder="Type a message…"
          size="small"
          fullWidth
        />
        <IconButton
          color="primary"
          onClick={() => void send()}
          disabled={!canSend}
          aria-label="Send message"
        >
          <SendIcon />
        </IconButton>
      </Box>
    </Paper>
  );
}
