import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Mic, MicOff, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useChat } from '@/context/ChatContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import {
  stopSpeaking,
  registerOnSpeakEnd,
  unregisterOnSpeakEnd,
  registerOnSpeakStart,
  unregisterOnSpeakStart,
  isSpeaking,
  isBotSpeakingNow,
} from '@/lib/voiceService';

// ── Web Speech API type declarations ─────────────────────────────────────────
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
  onstart: () => void;
  onspeechstart: () => void;
  onspeechend: () => void;
}
interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}
interface SpeechRecognitionResultList {
  length: number;
  item: (index: number) => SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}
interface SpeechRecognitionResult {
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternative;
}
interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}
interface SpeechRecognitionErrorEvent {
  error: string;
}
declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

// ── Silence detection config ──────────────────────────────────────────────────
/** How long (ms) of silence after last speech before we auto-send the message */
const SILENCE_AUTO_SEND_MS = 1300;
/** How long (ms) of silence with NO speech at all before we stop recording */
const NO_SPEECH_STOP_MS = 8000;

/**
 * ChatInput — Speak-to-Speak Voice Agent Input
 *
 * Features:
 *   1. Continuous listening — stays on while you speak
 *   2. Silence detection — auto-sends message after ~1.3s of quiet
 *   3. Interruption — if you speak while bot is talking, bot stops immediately
 *   4. Auto-resume — after bot finishes speaking, mic restarts automatically
 *   5. Visual waveform — animated bars while listening
 */
const ChatInput: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [interimText, setInterimText] = useState('');      // live transcript preview
  const [speechSupported, setSpeechSupported] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Refs so event handlers don't get stale closures
  const isRecordingRef = useRef(false);
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const noSpeechTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const accumulatedTextRef = useRef('');   // collect finals across continuous session
  const hasSpeechRef = useRef(false);      // did the user say anything this session?

  const {
    sendMessage,
    isTyping,
    editingMessageId,
    editingMessageText,
    setEditingMessage,
    editMessage,
    voiceLang,
    setVoiceLang
  } = useChat();
  const { toast } = useToast();

  // Stable refs for stale-closure-safe access in useEffect handlers
  const isTypingRef = useRef(isTyping);
  const sendMessageRef = useRef(sendMessage);
  useEffect(() => { isTypingRef.current = isTyping; }, [isTyping]);
  useEffect(() => { sendMessageRef.current = sendMessage; }, [sendMessage]);


  // ── Clear all debounce timers ──
  const clearTimers = () => {
    if (silenceTimerRef.current) { clearTimeout(silenceTimerRef.current); silenceTimerRef.current = null; }
    if (noSpeechTimerRef.current) { clearTimeout(noSpeechTimerRef.current); noSpeechTimerRef.current = null; }
  };

  // ── Start recognition ──
  const startRecognition = useCallback(() => {
    const rec = recognitionRef.current;
    if (!rec || isRecordingRef.current) return;
    rec.lang = voiceLang;
    accumulatedTextRef.current = '';
    hasSpeechRef.current = false;
    try {
      rec.start();
    } catch (_) {
      // Already started — ignore
    }
  }, [voiceLang]);

  // ── Stop recognition manually ──
  const stopRecognition = useCallback(() => {
    clearTimers();
    const rec = recognitionRef.current;
    if (!rec || !isRecordingRef.current) return;
    try { rec.stop(); } catch (_) {}
  }, []);

  // ── Auto-send accumulated transcript ──
  const autoSend = useCallback(() => {
    const text = accumulatedTextRef.current.trim();
    if (!text || isTypingRef.current) return;
    accumulatedTextRef.current = '';
    setInputText('');
    setInterimText('');
    sendMessageRef.current(text);
  }, []); // refs are always current — no deps needed

  // ── Build recognition instance once ──
  useEffect(() => {
    const SpeechAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechAPI) return;

    setSpeechSupported(true);
    const rec = new SpeechAPI();
    rec.continuous = true;          // stay open across pauses
    rec.interimResults = true;      // show live preview
    rec.lang = voiceLang;
    recognitionRef.current = rec;

    // ── onstart ──
    rec.onstart = () => {
      isRecordingRef.current = true;
      hasSpeechRef.current = false;
      setIsRecording(true);
      setInterimText('');

      // No-speech safety stop — if user doesn't say anything in 8s
      noSpeechTimerRef.current = setTimeout(() => {
        if (isRecordingRef.current && !hasSpeechRef.current) {
          stopRecognition();
        }
      }, NO_SPEECH_STOP_MS);
    };

    // ── onspeechstart — user opened their mouth ──
    rec.onspeechstart = () => {
      hasSpeechRef.current = true;
      // Only interrupt bot if TTS is actually playing (prevents false triggers)
      if (isBotSpeakingNow()) {
        stopSpeaking();
      }
      // Cancel silence timer
      if (silenceTimerRef.current) { clearTimeout(silenceTimerRef.current); silenceTimerRef.current = null; }
    };

    // ── onspeechend — user went quiet ──
    rec.onspeechend = () => {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = setTimeout(() => {
        if (accumulatedTextRef.current.trim()) {
          stopRecognition();
        }
      }, SILENCE_AUTO_SEND_MS);
    };

    // ── onresult — transcription results ──
    rec.onresult = (event: SpeechRecognitionEvent) => {
      if (noSpeechTimerRef.current) { clearTimeout(noSpeechTimerRef.current); noSpeechTimerRef.current = null; }

      // ❌ ECHO GUARD: if bot TTS is still active, discard this transcription
      // This prevents the mic from typing the bot's own spoken words
      if (isBotSpeakingNow()) {
        return;
      }

      let interim = '';
      let newFinal = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          newFinal += transcript + ' ';
        } else {
          interim += transcript;
        }
      }

      if (newFinal) {
        accumulatedTextRef.current += newFinal;
        setInputText(accumulatedTextRef.current.trim());
      }
      setInterimText(interim);
    };

    // ── onerror ──
    rec.onerror = (event: SpeechRecognitionErrorEvent) => {
      clearTimers();
      isRecordingRef.current = false;
      setIsRecording(false);
      setInterimText('');
      if (event.error === 'no-speech' || event.error === 'aborted') return;
      const msgs: Record<string, string> = {
        network: 'Connection error. Chrome browser mein try karein.',
        'not-allowed': 'Microphone access denied. Browser permissions allow karein.',
        'audio-capture': 'Microphone nahi mila.',
      };
      toast({
        title: 'Voice error',
        description: msgs[event.error] || `Speech error: ${event.error}`,
        variant: 'destructive',
      });
    };

    // ── onend — session closed (manual stop OR browser auto-stop) ──
    rec.onend = () => {
      clearTimers();
      isRecordingRef.current = false;
      setIsRecording(false);
      setInterimText('');

      // Auto-send if we have accumulated text (use ref to avoid stale closure)
      const text = accumulatedTextRef.current.trim();
      if (text && !isTypingRef.current) {
        accumulatedTextRef.current = '';
        setInputText('');
        sendMessageRef.current(text);
      }
    };

    return () => {
      clearTimers();
      try { rec.abort(); } catch (_) {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // build once — lang changes handled via property assignment

  // Update recognition lang when voiceLang state changes
  useEffect(() => {
    if (recognitionRef.current) recognitionRef.current.lang = voiceLang;
  }, [voiceLang]);

  // ── Layer 1: Stop mic immediately when bot STARTS speaking ──────────────────
  // This is the primary echo-prevention mechanism
  useEffect(() => {
    const onBotStartedSpeaking = () => {
      // Abort recognition immediately — no graceful stop, hard abort
      if (isRecordingRef.current && recognitionRef.current) {
        isRecordingRef.current = false;
        setIsRecording(false);
        setInterimText('');
        clearTimers();
        accumulatedTextRef.current = ''; // Discard anything typed so far from echo
        try { recognitionRef.current.abort(); } catch (_) {}
      }
    };
    registerOnSpeakStart(onBotStartedSpeaking);
    return () => unregisterOnSpeakStart(onBotStartedSpeaking);
  }, []);


  // Stop mic as soon as bot starts processing (Layer 3)
  useEffect(() => {
    if (isTyping && isRecordingRef.current) {
      stopRecognition();
    }
  }, [isTyping, stopRecognition]);


  // Pre-fill when editing a message
  useEffect(() => {
    if (editingMessageId && editingMessageText) {
      setInputText(editingMessageText);
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.setSelectionRange(inputRef.current.value.length, inputRef.current.value.length);
        }
      }, 50);
    }
  }, [editingMessageId, editingMessageText]);

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 120) + 'px';
    }
  }, [inputText]);

  // ── Form submit (text) ──
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = inputText.trim();
    if (isRecordingRef.current) {
      stopRecognition();
    }
    if (!text || isTyping) return;
    accumulatedTextRef.current = '';
    if (editingMessageId) {
      editMessage(editingMessageId, text);
      setEditingMessage(null, '');
    } else {
      sendMessage(text);
    }
    setInputText('');
    inputRef.current?.focus();
  };

  const handleCancelEdit = () => {
    setEditingMessage(null, '');
    setInputText('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    } else if (e.key === 'Escape' && editingMessageId) {
      handleCancelEdit();
    }
  };

  // ── Mic button click ──
  const toggleRecording = () => {
    if (!recognitionRef.current || !speechSupported) {
      toast({ title: 'Not Supported', description: 'Voice recognition not supported in this browser.', variant: 'destructive' });
      return;
    }
    if (isRecordingRef.current) {
      stopRecognition();
    } else {
      // Interrupt bot if it's speaking
      if (isSpeaking()) stopSpeaking();
      startRecognition();
    }
  };


  const toggleVoiceLang = () => {
    const next = voiceLang === 'en-IN' ? 'hi-IN' : 'en-IN';
    setVoiceLang(next);
    
    // Call API to make the system "understand" and speak in the new language
    const switchMsg = next === 'hi-IN' 
      ? "कृपया अब से केवल हिंदी में बात करें" 
      : "Please speak only in English from now on";
    
    sendMessage(switchMsg);
    
    toast({
      title: next === 'hi-IN' ? 'हिंदी भाषा' : 'English Language',
      description: next === 'hi-IN' ? 'अब आप हिंदी में बोल सकते हैं' : 'You can now speak in English',
      duration: 1500,
    });
  };

  const canSend = inputText.trim() && !isTyping;
  const displayText = inputText + (interimText ? ' ' + interimText : '');

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="w-full flex flex-col gap-2"
    >
      {/* 💡 Suggestion Chips */}
      <SuggestionChips onSelect={(val) => {
        if (!isTyping) {
            if (isSpeaking()) stopSpeaking();
            sendMessage(val);
        }
      }} />
      <form onSubmit={handleSubmit} className="flex items-end gap-1.5 sm:gap-2 w-full px-1 sm:px-2">

        {/* Left controls: lang pill + mic button + hands-free toggle */}
        {speechSupported && (
          <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
            {/* Language toggle */}
            <button
              type="button"
              onClick={toggleVoiceLang}
              className="text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-1 rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 transition-all shrink-0"
              title={`Switch voice to ${voiceLang === 'en-IN' ? 'Hindi' : 'English'}`}
            >
              {voiceLang === 'hi-IN' ? 'HI' : 'EN'}
            </button>

            {/* Mic button — pulsing when active */}
            <motion.div whileTap={{ scale: 0.9 }}>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={toggleRecording}
                className={cn(
                  'shrink-0 rounded-xl h-9 w-9 sm:h-11 sm:w-11 transition-all duration-300 relative overflow-hidden',
                  isRecording
                    ? 'bg-red-500 text-white hover:bg-red-600 shadow-md'
                    : 'hover:bg-accent'
                )}
                title={isRecording ? 'Mic band karo (click)' : 'Bolna shuru karo (mic)'}
                id="voice-input-btn"
              >
                {/* Ripple animation while recording */}
                {isRecording && (
                  <span className="absolute inset-0 rounded-xl animate-ping bg-red-400 opacity-30" />
                )}
                <AnimatePresence mode="wait">
                  {isRecording ? (
                    <motion.div key="mic-on" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                      <MicOff className="h-4 w-4 sm:h-5 sm:w-5 relative z-10" />
                    </motion.div>
                  ) : (
                    <motion.div key="mic-off" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                      <Mic className="h-4 w-4 sm:h-5 sm:w-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>

          </div>
        )}

        {/* Text input */}
        <div
          className={cn(
            'flex-1 relative rounded-2xl border transition-all duration-300',
            editingMessageId
              ? 'border-blue-400'
              : isFocused
                ? 'border-teal-400/60 shadow-glow'
                : 'border-slate-200/80',
            isRecording && 'border-red-400/60'
          )}
          style={{
            background: editingMessageId
              ? 'rgba(239, 246, 255, 0.7)'
              : isRecording
                ? 'rgba(255, 241, 242, 0.6)'
                : isFocused
                  ? 'rgba(255, 255, 255, 1)'
                  : 'rgba(255, 255, 255, 0.95)',
            boxShadow: isFocused ? '0 0 0 3px rgba(20, 184, 166, 0.12), 0 2px 12px rgba(0,0,0,0.06)' : '0 1px 4px rgba(0,0,0,0.05)',
          }}
        >
          {/* Edit mode indicator */}
          {editingMessageId && (
            <div className="flex items-center justify-between px-3 pt-2 pb-1">
              <span className="text-[10px] font-semibold text-blue-500 flex items-center gap-1">
                Editing message
              </span>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="flex items-center gap-0.5 text-[10px] text-slate-400 hover:text-red-500 transition-colors"
                title="Cancel edit (Escape)"
              >
                <X size={10} /> Cancel
              </button>
            </div>
          )}

          <textarea
            ref={inputRef}
            value={displayText}
            onChange={(e) => {
              setInputText(e.target.value);
              accumulatedTextRef.current = e.target.value;
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            placeholder={
              isRecording
                ? interimText ? interimText : (voiceLang === 'hi-IN' ? 'सुन रहा हूँ...' : 'Listening...')
                : editingMessageId
                  ? (voiceLang === 'hi-IN' ? 'संदेश बदलें...' : 'Edit message...')
                  : (voiceLang === 'hi-IN' ? 'कहाँ जाना है?' : 'Where do you want to go?')
            }
            className={cn(
              'w-full resize-none bg-transparent px-3 sm:px-4 py-2.5 sm:py-3 text-sm font-medium focus:outline-none min-h-[44px] max-h-[120px]',
              isTyping && 'opacity-50 cursor-not-allowed',
              isRecording && interimText ? 'text-slate-500 italic placeholder:text-slate-300' : 'text-slate-800 placeholder:text-slate-400'
            )}
            disabled={isTyping}
            rows={1}
            id="chat-input"
          />
        </div>

        {/* Send button */}
        <motion.div
          whileTap={{ scale: 0.9 }}
          animate={canSend ? { scale: [1, 1.05, 1] } : {}}
          transition={{ duration: 0.3 }}
        >
          <Button
            type="submit"
            size="icon"
            disabled={!canSend}
            className={cn(
              'shrink-0 h-9 w-9 sm:h-11 sm:w-11 rounded-xl sm:rounded-2xl transition-all duration-300 border-0',
              canSend
                ? 'gradient-brand text-white shadow-glow hover:shadow-glow-lg'
                : 'bg-muted text-muted-foreground'
            )}
            id="send-msg-btn"
          >
            <Send className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </motion.div>
      </form>

      {/* Status bar — recording / auto / idle */}
      <AnimatePresence mode="wait">
        {isRecording ? (
          <motion.div
            key="recording-bar"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            className="flex items-center justify-center gap-2"
          >
            {/* Animated waveform bars */}
            <div className="flex items-end gap-[3px] h-4">
              {[0.6, 1, 0.7, 1.2, 0.5].map((h, i) => (
                <motion.span
                  key={i}
                  className="w-[3px] rounded-full bg-red-500"
                  animate={{ scaleY: [h, h * 1.8, h] }}
                  transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.1 }}
                  style={{ height: `${h * 10}px`, transformOrigin: 'bottom' }}
                />
              ))}
            </div>
            <span className="text-[10px] text-red-500/80 font-medium uppercase tracking-wider">
              {interimText
                ? `"${interimText.slice(0, 40)}${interimText.length > 40 ? '...' : ''}"`
                : 'Listening'}
            </span>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
};

const SuggestionChips: React.FC<{ onSelect: (val: string) => void }> = ({ onSelect }) => {
    const { currentStep } = useChat();

    // Map of suggestions based on logic flow
    const stepSuggestions: Record<number, string[]> = {
        1: ["₹10,000 to ₹15,000", "Mid-Range Budget", "Luxury Trip ✨"],
        2: ["Flight Options ✈️", "Train Journey 🚆", "Bus Table 🚌"],
        3: ["Show Best Hotels 🏨", "Suggest 5 Star Stays", "Nearby Resorts"],
        4: ["Special Local Food 🍛", "Best Restaurants", "Famous Sweets 🍭"],
        5: ["Full Itinerary 📅", "3 Days Plan", "Download Schedule"],
    };

    const chips = stepSuggestions[currentStep] || [];
    if (chips.length === 0) return null;

    return (
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide px-2 pb-1 -mx-2">
            <div className="flex items-center gap-1.5 whitespace-nowrap">
                {chips.map((chip, i) => (
                    <motion.button
                        key={i}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        whileHover={{ y: -2, backgroundColor: 'rgba(255,160,50,0.1)' }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => onSelect(chip)}
                        className="px-3 py-1.5 rounded-full border border-orange-100 bg-orange-50/20 text-[11px] font-bold text-orange-700 hover:text-orange-800 transition-colors shadow-sm"
                    >
                        {chip}
                    </motion.button>
                ))}
            </div>
        </div>
    );
};

export default ChatInput;
