import React, { createContext, useContext, useState, ReactNode, useEffect, useRef, useCallback } from 'react';
import { speak, stopSpeaking, detectLanguage, setSpeakingId } from '@/lib/voiceService';

import { config } from '@/config';

// ── API base URL ──
const API_BASE = config.apiBase;

// Types for chat messages
export interface Message {
  id: string;
  text: string | any;
  sender: 'user' | 'bot';
  timestamp: Date;
  language?: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}

export type TransportMode = 'train' | 'both' | 'flight' | null;

interface ChatContextType {
  messages: Message[];
  conversations: Conversation[];
  currentConversationId: string;
  isTyping: boolean;
  isVoiceEnabled: boolean;
  lastBotMessageId: string | null;
  clearLastBotMessageId: () => void;
  editingMessageId: string | null;
  editingMessageText: string;
  detectedBudget: number | null;          // ₹ budget extracted from chat
  currentStep: number;                    // 1 to 5 step tracking
  voiceLang: 'en-IN' | 'hi-IN';
  setVoiceLang: (lang: 'en-IN' | 'hi-IN') => void;
  transportRecommendation: TransportMode; // AI-driven mode suggestion
  setEditingMessage: (id: string | null, text?: string) => void;
  toggleVoice: () => void;
  sendMessage: (text: string) => void;
  editMessage: (messageId: string, newText: string) => void;
  deleteMessage: (messageId: string) => void | Promise<void>;
  createNewConversation: () => void;
  selectConversation: (id: string) => void;
  deleteConversation: (id: string) => void;
  clearAllConversations: () => Promise<void>;
  resetChat: () => void;
}

// Create the context
const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Helper to generate unique IDs
const generateId = () => 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

/**
 * Normalizes a bot reply. If it's an object (structured data), stringify it
 * so it can be stored in the Message.text field and parsed by ChatMessage.
 */
function normalizeReply(data: any): string {
  if (!data) return "";
  if (typeof data === 'string') return data;
  try {
    return JSON.stringify(data);
  } catch (err) {
    console.error("normalizeReply error:", err);
    return String(data);
  }
}

// Provider component
// ── Bot opening greetings ──
const BOT_GREETINGS_EN = [
  "Hello! 👋\nI am your AI Travel Assistant.\nI will help you plan your perfect trip step-by-step.\n\n👉 First, tell me — where do you want to go?",
  "Hi! ✨\nI'm your digital travel partner.\nI'll help you set up every detail of your trip.\n\n👉 Where would you like to travel today?",
  "Welcome! 🇮🇳\nI am your India Travel Expert.\nLet's build an amazing itinerary together.\n\n👉 Which destination is on your mind?"
];

const BOT_GREETINGS_HI = [
  "नमस्ते! 😊\nमैं आपका AI ट्रैवल असिस्टेंट हूँ।\nमैं आपको स्टेप-बाय-स्टेप एक बेहतरीन ट्रिप प्लान करने में मदद करूँगा।\n\n👉 सबसे पहले बताइए — आप कहाँ जाना चाहते हैं?",
  "स्वागत है! ✨\nमैं आपका डिजिटल ट्रैवल पार्टनर हूँ।\nमैं आपकी ट्रिप की हर डिटेल सेट करने में मदद करूँगा।\n\n👉 बताइए, आज आप कहाँ की यात्रा करना चाहेंगे?",
  "हेलो! 👋\nमैं आपका इंडिया ट्रैवल एक्सपर्ट हूँ।\nचलिए साथ मिलकर एक शानदार प्लान बनाते हैं।\n\n👉 आपके मन में कौन सी मंज़िल है?"
];

// ── Budget extraction from natural language ──────────────────────────────────
/**
 * Extract the first numeric budget amount (in ₹) from user text.
 * Handles: "5000 budget", "Rs 12000", "₹8k", "15 thousand", "2 lakh"
 */
function extractBudgetFromText(text: string): number | null {
  const t = text.toLowerCase();
  // ₹ or Rs. followed by number (with optional k multiplier)
  let m = t.match(/(?:rs\.?|₹)\s*(\d[\d,]*)\s*(k)?/);
  if (m) {
    const base = parseInt(m[1].replace(/,/g, ''), 10);
    return m[2] ? base * 1000 : base;
  }
  // "X lakh"
  m = t.match(/(\d+(?:\.\d+)?)\s*lakh/);
  if (m) return Math.round(parseFloat(m[1]) * 100000);
  // "X thousand" / "X k" — only in budget context
  m = t.match(/(\d+(?:\.\d+)?)\s*(?:thousand|k\b)/);
  if (m) return Math.round(parseFloat(m[1]) * 1000);
  // Budget keyword followed by number
  m = t.match(/(?:budget|paisa|rupay(?:e|a)?|spend|kharch)[^\d]*(\d[\d,]{2,})/);
  if (m) return parseInt(m[1].replace(/,/g, ''), 10);
  // Standalone 4-6 digit number ONLY near budget-related words
  const budgetContext = /(?:budget|cost|price|kitna|kharcha|rupee|lagega|per\s*day|din|days|mein|me\s+ghoomna)/.test(t);
  if (budgetContext) {
    m = t.match(/\b(\d{4,6})\b/);
    if (m) return parseInt(m[1], 10);
  }
  return null;
}

function getTransportMode(budget: number | null): TransportMode {
  if (budget === null) return null;
  if (budget < 5000) return 'train';
  if (budget <= 15000) return 'both';
  return 'flight';
}

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string>('');
  const [isTyping, setIsTyping] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState<boolean>(true);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingMessageText, setEditingMessageText] = useState<string>('');
  const [detectedBudget, setDetectedBudget] = useState<number | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [voiceLang, setVoiceLang] = useState<'en-IN' | 'hi-IN'>('en-IN');
  const [lastBotMessageId, setLastBotMessageId] = useState<string | null>(null);
  const [transportRecommendation, setTransportRecommendation] = useState<TransportMode>(null);
  // Track which conversation IDs have already received the greeting
  const greetedConvsRef = useRef<Set<string>>(new Set());

  const setEditingMessage = (id: string | null, text: string = '') => {
    setEditingMessageId(id);
    setEditingMessageText(text);
  };

  const clearLastBotMessageId = () => setLastBotMessageId(null);

  // Derived state for current messages
  const currentConversation = conversations.find(c => c.id === currentConversationId);
  const messages = currentConversation?.messages || [];

  // Ref to track current voice state without stale closures
  const isVoiceEnabledRef = useRef(isVoiceEnabled);
  useEffect(() => { isVoiceEnabledRef.current = isVoiceEnabled; }, [isVoiceEnabled]);

  const toggleVoice = () => {
    setIsVoiceEnabled(prev => {
      const newState = !prev;
      if (!newState) {
        // Stop all current speech
        stopSpeaking();
      }
      return newState;
    });
  };



  /**
   * Normalize the `reply` field from the backend.
   * Backend may return:
   *   - A plain string: "Hello!"
   *   - A simple text dict: {"reply": "Hello!", "type": "text"}  (legacy)
   *   - A structured travel dict: {"route_summary": {...}, "train_options": [...], ...}
   * This function always returns the right value for message.text
   */
  const normalizeReply = (reply: any): string | Record<string, any> => {
    if (typeof reply === 'string') return reply;
    if (typeof reply === 'object' && reply !== null) {
      // Legacy wrapper: {"reply": "text", "type": "text"}
      if (reply.type === 'text' && typeof reply.reply === 'string') {
        return reply.reply;
      }
      // Structured travel data — pass through as object
      return reply;
    }
    return String(reply ?? 'No response received.');
  };

  // ── Helper to update messages in current conversation ──
  const updateCurrentConversationMessages = (newMessages: Message[] | ((prev: Message[]) => Message[])) => {
    setConversations(prevConvs => prevConvs.map(conv => {
      if (conv.id === currentConversationId) {
        const updatedMessages = typeof newMessages === 'function' ? newMessages(conv.messages) : newMessages;
        return { ...conv, messages: updatedMessages };
      }
      return conv;
    }));
  };

  // ── Inject bot greeting into a conversation (empty thread only) ──
  const injectBotGreeting = useCallback((convId: string) => {
    if (greetedConvsRef.current.has(convId)) return;
    greetedConvsRef.current.add(convId);

    const isHindi = voiceLang === 'hi-IN';
    const greetings = isHindi ? BOT_GREETINGS_HI : BOT_GREETINGS_EN;
    const greeting = greetings[Math.floor(Math.random() * greetings.length)];
    const greetLang = isHindi ? 'hi' : 'en';

    const greetMsg: Message = {
      id: generateId(),
      text: greeting,
      sender: 'bot',
      timestamp: new Date(),
      language: greetLang,
    };

    setTimeout(() => {
      setConversations(prev => prev.map(conv =>
        conv.id === convId
          ? { ...conv, messages: [greetMsg] }
          : conv
      ));

      // 🤖 Trigger Voice for Greeting if enabled
      if (isVoiceEnabledRef.current) {
        setLastBotMessageId(greetMsg.id);
      }
    }, 80);
  }, [voiceLang]);

  // Page refresh / empty saved chat: still get swagat + voice once per empty thread
  useEffect(() => {
    if (!currentConversationId) return;
    const conv = conversations.find(c => c.id === currentConversationId);
    if (!conv || conv.messages.length > 0) return;
    injectBotGreeting(currentConversationId);
  }, [currentConversationId, conversations, injectBotGreeting]);

  // ── Create New Conversation ──
  const createNewConversation = async () => {
    // Naya chat banate waqt speech band karein
    stopSpeaking();
    // Reset budget state for fresh conversation
    setDetectedBudget(null);
    setCurrentStep(0);
    setTransportRecommendation(null);

    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE}/chat/conversations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title: 'New Chat' })
      });

      if (res.ok) {
        const newConv = await res.json();
        const mapped: Conversation = {
          id: newConv.id,
          title: newConv.title,
          messages: [],
          createdAt: new Date(newConv.created_at)
        };
        setConversations(prev => [mapped, ...prev]);
        setCurrentConversationId(mapped.id);
        // 🤖 Bot greets the user immediately!
        injectBotGreeting(mapped.id);
      }
    } catch (e) {
      console.error('Failed to create conversation', e);
    }
  };

  const selectConversation = (id: string) => {
    // Dusri chat select karne par speech band karein
    stopSpeaking();
    setCurrentConversationId(id);
    // Reset budget detection when switching conversations
    setDetectedBudget(null);
    setCurrentStep(0);
    setTransportRecommendation(null);
  };

  const deleteConversation = async (id: string) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    // Optimistic delete
    const oldConvs = [...conversations];
    setConversations(prev => {
      const newConvs = prev.filter(c => c.id !== id);
      if (id === currentConversationId) {
        setCurrentConversationId(newConvs.length > 0 ? newConvs[0].id : '');
      }
      return newConvs;
    });
    try {
      await fetch(`${API_BASE}/chat/conversations/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } catch (e) {
      console.error("Delete failed", e);
      setConversations(oldConvs); // Revert
    }
  };

  const clearAllConversations = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    // Delete all except current
    const toDelete = conversations.filter(c => c.id !== currentConversationId);
    
    // Optimistic update
    setConversations(prev => prev.filter(c => c.id === currentConversationId));

    try {
      await Promise.all(toDelete.map(c => 
        fetch(`${API_BASE}/chat/conversations/${c.id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ));
    } catch (e) {
      console.error("Clear all failed", e);
      // We don't revert here as it's complex, but at least we tried
    }
  };

  // ── Send user message to AI backend ──
  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || trimmed.length < 1) return; // Guard: empty message check
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('No auth token found');
      return;
    }

    let activeConvId = currentConversationId;

    // ── Agar koi active conversation nahi hai, pehle nayi banao ──
    if (!activeConvId) {
      try {
        const res = await fetch(`${API_BASE}/chat/conversations`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ title: 'New Chat' })
        });
        if (res.ok) {
          const newConv = await res.json();
          activeConvId = newConv.id;
          const mapped: Conversation = {
            id: newConv.id,
            title: newConv.title || 'New Chat',
            messages: [],
            createdAt: new Date(newConv.created_at)
          };
          setConversations(prev => [mapped, ...prev]);
          setCurrentConversationId(activeConvId);
          // Mark as greeted (user already sent first message, no need for greeting)
          greetedConvsRef.current.add(activeConvId);
        } else {
          console.error("Failed to create conversation before sending message");
          return;
        }
      } catch (e) {
        console.error("Error creating conversation:", e);
        return;
      }
    }

    // ── Optimistic user message update ──
    const tempId = generateId();
    const userMessage: Message = {
      id: tempId,
      text: trimmed,
      sender: 'user',
      timestamp: new Date(),
    };

    // ── Pro Feature: Budget Detection ────────────────────────────────────────
    const newBudget = extractBudgetFromText(trimmed);
    if (newBudget !== null) {
      setDetectedBudget(newBudget);
      setTransportRecommendation(getTransportMode(newBudget));
    }

    setConversations(prev => prev.map(conv => {
      if (conv.id === activeConvId) {
        return { ...conv, messages: [...conv.messages, userMessage] };
      }
      return conv;
    }));
    setIsTyping(true);

    // Smart title from first user message (35 chars max)
    const smartTitle = text.trim().length > 35
      ? text.trim().slice(0, 35) + '...'
      : text.trim();

    try {
      const response = await fetch(`${API_BASE}/chat/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          conversation_id: activeConvId,
          content: text.trim(),
          language: voiceLang.split('-')[0]  // Sends 'en' or 'hi'
        }),
      });

      if (response.ok) {
        const data = await response.json();

        const contentToStore = (data.data && Object.keys(data.data).length > 0) ? data.data : data.reply;
        const normalizedReply = normalizeReply(contentToStore);

        const botMessage: Message = {
          id: generateId(),
          text: normalizedReply,
          sender: 'bot',
          timestamp: new Date(),
          language: data.language || (data.data && data.data.lang) || 'en',
        };

        setConversations(prev => prev.map(conv => {
          if (conv.id === activeConvId) {
            // Update current step from backend
            if (data.current_step) setCurrentStep(data.current_step);
            
            // Backend se aaya title use karo, warna smartTitle fallback
            const updatedTitle = data.title || (conv.title === 'New Chat' || conv.title === '' ? smartTitle : conv.title);
            return { ...conv, title: updatedTitle, messages: [...conv.messages, botMessage] };
          }
          return conv;
        }));

        // Trigger auto-speak in ChatMessage via effect
        if (isVoiceEnabledRef.current) {
          setLastBotMessageId(botMessage.id);
        }

      } else {
        throw new Error(`Backend error: ${response.status}`);
      }
    } catch (err) {
      console.error("sendMessage error:", err);
      // Error message show karo user ko
      const errMsg: Message = {
        id: generateId(),
        text: 'Sorry, kuch problem aayi. Dobara try karein.',
        sender: 'bot',
        timestamp: new Date(),
      };
      setConversations(prev => prev.map(conv => {
        if (conv.id === activeConvId) {
          return { ...conv, messages: [...conv.messages, errMsg] };
        }
        return conv;
      }));
    } finally {
      setIsTyping(false);
    }
  };

  // ── Edit a user message (updates text, removes bot reply after it, re-sends) ──
  const editMessage = (messageId: string, newText: string) => {
    if (!newText.trim()) return;
    setConversations(prev => prev.map(conv => {
      if (conv.id !== currentConversationId) return conv;
      const msgIndex = conv.messages.findIndex(m => m.id === messageId);
      if (msgIndex === -1) return conv;
      const updatedMessages = [
        ...conv.messages.slice(0, msgIndex),
        { ...conv.messages[msgIndex], text: newText.trim() }
      ];
      return { ...conv, messages: updatedMessages };
    }));
    setEditingMessage(null, '');
    setTimeout(() => sendMessage(newText.trim()), 100);
  };

  // ── Delete a user message and its following bot reply ──
  const deleteMessage = async (messageId: string) => {
    const conv = conversations.find(c => c.id === currentConversationId);
    if (!conv) return;

    const msgIndex = conv.messages.findIndex(m => m.id === messageId);
    if (msgIndex === -1) return;

    // Check if it's a user message or bot message
    const targetMsg = conv.messages[msgIndex];
    const nextMsg = conv.messages[msgIndex + 1];
    const removeCount = (nextMsg && nextMsg.sender === 'bot') ? 2 : 1;

    // Optimistic update
    setConversations(prev => prev.map(c => {
      if (c.id !== currentConversationId) return c;
      const updatedMessages = [
        ...c.messages.slice(0, msgIndex),
        ...c.messages.slice(msgIndex + removeCount)
      ];
      return { ...c, messages: updatedMessages };
    }));
  };

  // ── Reset chat (Clear current conversation) ──
  const resetChat = () => {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    updateCurrentConversationMessages([]);
    setIsTyping(false);
    setDetectedBudget(null);
    setTransportRecommendation(null);
    if (currentConversationId) {
      greetedConvsRef.current.delete(currentConversationId);
      injectBotGreeting(currentConversationId);
    }
  };

  // Fetch conversations on load
  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch(`${API_BASE}/chat/conversations`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          // Transform backend data to frontend model
          // Backend returns: { id, title, user_id, messages: [...], ... }
          if (Array.isArray(data)) {
            const mapped = data.map((c: any) => ({
              id: c.id,
              title: c.title,
              messages: c.messages.map((m: any) => {
                // ── Normalize message content ───────────────────────────────
                // Bot messages stored as JSON objects (structured travel data)
                // must be passed through as objects so StructuredResponse renders them.
                // User messages are always strings.
                const role = m.role === 'assistant' ? 'bot' : 'user';
                let content = m.content;

                // If content is a plain string that looks like JSON, try to parse it
                if (role === 'bot' && typeof content === 'string') {
                  const t = content.trim();
                  if (t.startsWith('{') || t.startsWith('[')) {
                    try { content = JSON.parse(t); } catch (_) { /* keep as string */ }
                  }
                }

                // Bot messages with object content → use normalizeReply equivalently
                if (role === 'bot' && content && typeof content === 'object') {
                  // Pass structured data object as-is (same as live responses)
                  content = content;
                }

                return {
                  id: 'msg_' + Math.random(),
                  text: content,
                  sender: role,
                  timestamp: new Date(m.timestamp),
                  language: m.language || (content && typeof content === 'object' ? content.lang : 'en')
                };
              }),
              createdAt: new Date(c.created_at)
            }));
            setConversations(mapped);
            mapped.forEach((c: Conversation) => {
              if (c.messages.length > 0) greetedConvsRef.current.add(c.id);
            });
            // Only auto-select if no conversation is currently active
            // or if the current one no longer exists (was deleted)
            setCurrentConversationId(prev => {
              const stillExists = mapped.some(c => c.id === prev);
              if (!prev || !stillExists) {
                return mapped.length > 0 ? mapped[0].id : '';
              }
              return prev; // Keep current conversation
            });
          }
        })
        .catch(err => console.error("Failed to load history", err));
    }
  }, []);

  return (
    <ChatContext.Provider
      value={{
        messages,
        conversations,
        currentConversationId,
        isTyping,
        isVoiceEnabled,
        editingMessageId,
        editingMessageText,
        detectedBudget,
        currentStep,
        transportRecommendation,
        voiceLang,
        lastBotMessageId,
        clearLastBotMessageId,
        setVoiceLang,
        setEditingMessage,
        toggleVoice,
        sendMessage,
        editMessage,
        deleteMessage,
        createNewConversation,
        selectConversation,
        deleteConversation,
        clearAllConversations,
        resetChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

// Custom hook to use chat context
export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
