import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Message } from '@/context/ChatContext';
import { useChat } from '@/context/ChatContext';
import {
  speak,
  stopSpeaking,
  getCurrentSpeakingId,
  setSpeakingId,
  detectLanguage,
  registerOnSpeakStart,
  registerOnSpeakEnd,
  unregisterOnSpeakStart,
  unregisterOnSpeakEnd,
  isSpeechUnlocked,
  onSpeechUnlock,
  offSpeechUnlock
} from '@/lib/voiceService';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Volume2, Pencil, Trash2, StopCircle } from 'lucide-react';
import StructuredResponse from './travel/StructuredResponse';
import StructuredCards from './travel/StructuredCards';

interface ChatMessageProps {
  message: Message;
}

/**
 * ChatMessage — Premium India Travel Pal message bubble
 * Features: line-by-line TTS with highlight, structured content, edit/delete
 */
const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isBot = message.sender === 'bot';
  const { deleteMessage, setEditingMessage, isTyping, lastBotMessageId, clearLastBotMessageId } = useChat();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState<number | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const speakingRef = useRef(false);

  const resetSpeech = React.useCallback(() => {
    speakingRef.current = false;
    setIsSpeaking(false);
    setHighlightIndex(null);
  }, []);

  // Sync visual state with global speaker state
  React.useEffect(() => {
    const checkState = () => {
      setIsSpeaking(getCurrentSpeakingId() === message.id);
    };

    // Initial check
    checkState();

    registerOnSpeakStart(checkState);
    registerOnSpeakEnd(checkState);
    
    return () => {
      unregisterOnSpeakStart(checkState);
      unregisterOnSpeakEnd(checkState);
    };
  }, [message.id]);

  // ── Unified Source of Truth for Voice & Highlights ──
  const getSpeakableSegments = React.useCallback((rawText: any, includeStructuredData = true): string[] => {
    const tryParse = (raw: any): any => {
      if (raw && typeof raw === 'object') return raw;
      if (typeof raw !== 'string') return null;
      const t = raw.trim();
      const m = t.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      const c = m ? m[1].trim() : t;
      if (!c.startsWith('{') && !c.startsWith('[')) return null;
      try { return JSON.parse(c); } catch (_) {
        try { return JSON.parse(c.replace(/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/g, '').replace(/\n/g, ' ')); } catch (_) { return null; }
      }
    };
    
    const content = tryParse(rawText);
    const parts: string[] = [];
    let nextStepPart = "";

    // 1. Primary Text (Reply/Summary)
    let rawReply = (content?.reply || content?.message || content?.summary || 
      (typeof rawText === 'string' ? rawText : ''))
      .replace(/```[\s\S]*?```/g, '')
      .replace(/\*{1,3}(.*?)\*{1,3}/gs, '$1') // Clean bold/italic
      .trim();

    // -- Truncate rawReply if it contains redundant list data to avoid double-speaking/displaying --
    const hasItinerary = content?.itinerary && Array.isArray(content.itinerary) && content.itinerary.length > 0;
    const hasTransport = (content?.train_options?.length || content?.bus_options?.length || content?.flight_options?.length);
    const hasHotels = content?.nearby_hotels && Array.isArray(content.nearby_hotels) && content.nearby_hotels.length > 0;
    const hasFood = content?.nearby_food && Array.isArray(content.nearby_food) && content.nearby_food.length > 0;

    if (hasItinerary || hasTransport || hasHotels || hasFood) {
      const listKeywords = [
        /Day\s*1|Day-1|Day\s*01/i,           
        /1\.\s+Train|Option 1:|Trains?:|Train\s*Options/i,
        /1\.\s+Bus|Buses?:|Bus\s*Options/i,
        /1\.\s+Flight|Flights?:|Flight\s*Options/i,
        /Hotel 1|1\.\s+Hotel|Recommended Hotels:|Hotels?:/i,
        /Restaurant 1|1\.\s+Restaurant|Top food|Restaurants?:|Food\s*items?:/i,
        /\bOption 1\b/i,
        /^\s*[\*\-]\s+/m // Catch any bullet points at start of line
      ];

      let earliestMatchIndex = Infinity;
      for (const pattern of listKeywords) {
        const match = rawReply.match(pattern);
        if (match && match.index !== undefined && match.index < earliestMatchIndex) {
          earliestMatchIndex = match.index;
        }
      }

      if (earliestMatchIndex !== Infinity) {
        rawReply = rawReply.substring(0, earliestMatchIndex).trim();
        // Remove trailing "Here is your ..." style phrases
        rawReply = rawReply.replace(/(?:Here is|Here's|Proposed|Below is|Check out|following|options|best choices|found for you).*?:$/i, '').trim();
      }
    }

    // -- ISOLATE NEXT STEP GUIDANCE (Should be spoken last) --
    const guidancePatterns = [
      /(\bAb next step.*)$/i,
      /(\bNext step ke liye.*)$/i,
      /(\bAb aap aage.*)$/i,
      /(\bKya aap.*)$/i,
      /(\bKya main.*)$/i
    ];

    for (const pattern of guidancePatterns) {
      const match = rawReply.match(pattern);
      if (match) {
        nextStepPart = match[0];
        rawReply = rawReply.replace(nextStepPart, '').trim();
        break;
      }
    }

    const detectedLang = content?.lang || message.language || 'en';
    if (rawReply) parts.push(rawReply);

    // -- 2. STRUCTURED DATA (If requested for TTS or full display) --
    if (includeStructuredData) {
      // ITINERARY
      if (hasItinerary) {
        content.itinerary.forEach((day: any) => {
          const dayLabel = detectedLang === 'hi' ? `दिन ${day.day}` : `Day ${day.day}`;
          parts.push(`${dayLabel}: ${day.title}`);
          if (day.activities && Array.isArray(day.activities)) parts.push(...day.activities);
          if (day.tip) parts.push(`${detectedLang === 'hi' ? 'टिप' : 'Tip'}: ${day.tip}`);
        });
      }

      // TRANSPORT
      if (hasTransport) {
        if (content.train_options) {
          parts.push(detectedLang === 'hi' ? "ट्रेन के विकल्प:" : "Train Options:");
          content.train_options.forEach((opt: any) => {
            const price = opt.ticket_price ? Object.values(opt.ticket_price)[0] : (opt.price || '');
            parts.push(`${opt.train_name || opt.name}, ${price}`);
          });
        }
        if (content.bus_options) {
          parts.push(detectedLang === 'hi' ? "बस के विकल्प:" : "Bus Options:");
          content.bus_options.forEach((opt: any) => parts.push(`${opt.operator_name || opt.name}, ${opt.fare || opt.price || ''}`));
        }
        if (content.flight_options) {
          parts.push(detectedLang === 'hi' ? "फ्लाइट के विकल्प:" : "Flight Options:");
          content.flight_options.forEach((opt: any) => parts.push(`${opt.airline || opt.name}, ${opt.price || ''}`));
        }
      }

      // HOTELS
      if (hasHotels) {
        parts.push(detectedLang === 'hi' ? "सुझाए गए होटल:" : "Recommended Hotels:");
        content.nearby_hotels.forEach((h: any) => parts.push(`${h.hotel_name || h.name}, ${h.price_per_night || h.price || ''}`));
      }

      // FOOD
      if (hasFood) {
        parts.push(detectedLang === 'hi' ? "सुझाए गए रेस्टोरेंट:" : "Recommended Restaurants:");
        content.nearby_food.forEach((f: any) => parts.push(`${f.restaurant_name || f.name}, ${f.approx_cost_for_two || f.cost || ''}`));
      }
    }

    // -- 2.5 TRAVEL INTELLIGENCE SUMMARY (Nice wrap-up) --
    if (includeStructuredData) {
      let finalSummary = "";
      const dest = content.route_summary?.to || content.route_summary?.destination || "";
      
      if (hasTransport) {
        if (content.train_options?.length) {
          const top = content.train_options[0];
          const price = top.ticket_price ? (Object.values(top.ticket_price)[0]) : (top.price || "");
          finalSummary += detectedLang === 'hi' 
            ? `कुल मिलाकर, आपकी यात्रा के लिए ${content.train_options.length} ट्रेनें उपलब्ध हैं। ${top.train_name}${price ? `, जो ${price} से शुरू होती है,` : ""} एक बेहतरीन विकल्प है। `
            : `In summary, there are ${content.train_options.length} train options available. ${top.train_name}${price ? `, starting at ${price},` : ""} is a great choice for your trip. `;
        } else if (content.flight_options?.length) {
          finalSummary += detectedLang === 'hi'
            ? `आपके लिए ${content.flight_options.length} फ्लाइट्स के विकल्प मिले हैं। `
            : `I've found ${content.flight_options.length} flight options for your journey. `;
        }
      }
      
      if (hasHotels && content.nearby_hotels?.length) {
        finalSummary += detectedLang === 'hi'
          ? `मैंने रुकने के लिए ${content.nearby_hotels.length} शानदार होटल्स भी ढूँढे हैं। `
          : `I've also listed ${content.nearby_hotels.length} premium hotel options for your stay. `;
      }

      if (hasItinerary && content.itinerary?.length) {
        finalSummary += detectedLang === 'hi'
          ? `आपका ${content.itinerary.length} दिनों का ${dest ? dest + " का " : ""}पूरा ट्रिप प्लान अब तैयार है। `
          : `Your complete ${content.itinerary.length}-day itinerary ${dest ? "to " + dest : ""} is now ready. `;
      }

      if (finalSummary) {
        parts.push(detectedLang === 'hi' ? `सारांश: ${finalSummary.trim()}` : `Summary: ${finalSummary.trim()}`);
      }
    }

    // 3. Add isolated Next Step to the very end
    if (nextStepPart) parts.push(nextStepPart);

    // -- 4. FRIENDLY SIGN-OFF (Clear end cue) --
    if (isBot) {
      const signOff = detectedLang === 'hi'
        ? "आशा है कि यह जानकारी आपके काम आएगी! क्या मैं आपकी और किसी तरह मदद कर सकता हूँ?"
        : "I hope this helps! Is there anything else I can assist you with?";
      parts.push(signOff);
    }

    // Split into sentences / segments
    const finalSentences: string[] = [];
    
    parts.forEach(part => {
      // Split each part into sentences for more granular highlighting
      const subSentences = part.split(/([.!?।])\s+/)
        .reduce((acc: string[], val: string, i: number) => {
          if (i % 2 === 0) acc.push(val);
          else acc[acc.length - 1] += val;
          return acc;
        }, [])
        .map(s => s.trim())
        .filter(s => s.length > 0);
        
      finalSentences.push(...subSentences);
    });
    
    return finalSentences;
  }, [message.language, message.id, isBot]);

  // ── New Granular TTS reader (Sentence by Sentence) ──
  const startReading = (sentences: string[], lang: string) => {
    if (getCurrentSpeakingId() === message.id) {
       // Already speaking this message — stop it
       stopSpeaking();
       return;
    }
    stopSpeaking();
    
    if (sentences.length === 0) return;

    speakingRef.current = true;
    setIsSpeaking(true);
    setHighlightIndex(0);
    setSpeakingId(message.id, resetSpeech);

    let currentIndex = 0;
    const speakNext = () => {
      if (!speakingRef.current || getCurrentSpeakingId() !== message.id) {
        resetSpeech();
        return;
      }
      if (currentIndex >= sentences.length) {
        setSpeakingId(null);
        speakingRef.current = false;
        setIsSpeaking(false);
        setHighlightIndex(null);
        return;
      }
      setHighlightIndex(currentIndex);
      
      const el = document.getElementById(`line-${message.id}-${currentIndex}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      const sentenceText = sentences[currentIndex];
      speak(sentenceText, lang, () => {
        currentIndex++;
        setTimeout(speakNext, 10);
      }, currentIndex === 0);
    };
    speakNext();
  };

  const handleSpeak = useCallback(() => {
    const sentences = getSpeakableSegments(message.text);
    const lang = detectLanguage(sentences.join(' '), message.language);
    startReading(sentences, lang);
  }, [message.id, message.text, message.language, getSpeakableSegments]);

  // Ref to avoid stale closure + prevent effect re-runs when handleSpeak reference changes
  const handleSpeakRef = useRef(handleSpeak);
  useEffect(() => { handleSpeakRef.current = handleSpeak; }, [handleSpeak]);

  // ── Auto-speak trigger for NEW messages ──
  useEffect(() => {
    console.log('[AUTO-SPEAK] Effect fired. isBot:', isBot, 'lastBotMessageId:', lastBotMessageId, 'message.id:', message.id, 'match:', lastBotMessageId === message.id);
    if (isBot && lastBotMessageId === message.id) {
      const doSpeak = () => {
        console.log('[AUTO-SPEAK] doSpeak() called, invoking handleSpeak');
        handleSpeakRef.current();
        clearLastBotMessageId();
      };

      if (isSpeechUnlocked()) {
        console.log('[AUTO-SPEAK] Speech UNLOCKED, setting 150ms timer');
        const timer = setTimeout(doSpeak, 150);
        return () => clearTimeout(timer);
      } else {
        console.log('[AUTO-SPEAK] Speech LOCKED, registering onSpeechUnlock callback');
        const unlockHandler = () => {
          console.log('[AUTO-SPEAK] Speech just UNLOCKED! Speaking now...');
          setTimeout(doSpeak, 150);
        };
        onSpeechUnlock(unlockHandler);
        return () => offSpeechUnlock(unlockHandler);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBot, lastBotMessageId, message.id, clearLastBotMessageId]);

  const time = new Date(message.timestamp).toLocaleTimeString('en-IN', {
    hour: '2-digit', minute: '2-digit'
  });

  // ── Parse & render message content ──
  const renderContent = () => {
    const tryParseJSON = (text: any) => {
      if (text && typeof text === 'object') return text;
      const candidate = String(text).trim();
      
      // Try direct parse first
      if (candidate.startsWith('{') || candidate.startsWith('[')) {
        try { return JSON.parse(candidate); } catch (_) {}
      }

      // Try extraction from backticks or braces
      try {
        const match = candidate.match(/\{[\s\S]*\}/);
        if (match) {
          const extracted = match[0];
          try { return JSON.parse(extracted); } catch (_) {
            // Last ditch: clean invisible chars and literal newlines
            try { return JSON.parse(extracted.replace(/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/g, '').replace(/\n/g, ' ')); } catch (_) {}
          }
        }
      } catch (_) {}

      return null;
    };

    const parsedData = tryParseJSON(message.text);

    if (parsedData && typeof parsedData === 'object' &&
      (parsedData.reply || parsedData.cards || parsedData.itinerary || parsedData.route_summary)) {
      
      const cardLang = parsedData.lang || message.language || 'en';
      const isDashboard = !!(parsedData.itinerary || parsedData.route_summary || parsedData.nearby_hotels);

      const sentences = getSpeakableSegments(message.text, false);

      return (
        <div className="flex flex-col gap-3">
          {sentences.length > 0 && (
            <div className="flex flex-wrap gap-x-1.5 gap-y-1">
              {sentences.map((sentence, i) => {
                const isActive = highlightIndex === i;
                const isPast = highlightIndex !== null && highlightIndex > i;
                const isFuture = highlightIndex !== null && highlightIndex < i;

                return (
                  <motion.span
                    key={i}
                    id={`line-${message.id}-${i}`}
                    animate={{ 
                      scale: isActive ? 1.02 : 1,
                      opacity: isFuture ? 0.35 : 1
                    }}
                    className={cn(
                      "text-[14px] leading-relaxed rounded px-1.5 py-0.5 transition-all duration-500",
                      isActive
                        ? "font-bold shadow-sm"
                        : "font-normal"
                    )}
                    style={isActive ? {
                      backgroundColor: 'hsl(28 95% 55%)',
                      color: '#ffffff',
                    } : { 
                      color: isPast ? 'hsl(224 10% 60%)' : 'hsl(224 15% 78%)' 
                    }}
                  >
                    {sentence}
                  </motion.span>
                );
              })}
            </div>
          )}
          {isDashboard ? (
            <StructuredResponse 
                data={{ ...parsedData, messageId: message.id }} 
                activeHighlightIndex={highlightIndex}
                sentences={getSpeakableSegments(message.text)}
              />
          ) : (
            parsedData.cards && Array.isArray(parsedData.cards) && parsedData.cards.length > 0 && (
              <StructuredCards cards={parsedData.cards} lang={cardLang} />
            )
          )}
        </div>
      );
    }

    if (isBot && parsedData && typeof parsedData === 'object') {
      return <StructuredResponse data={parsedData as any} />;
    }

    const textContent = String(message.text);

    // User message — white on saffron bubble
    if (!isBot) {
      return (
        <p className="text-[14px] leading-relaxed whitespace-pre-wrap font-medium text-white">
          {textContent}
        </p>
      );
    }

    // Bot plain text — light on dark bubble
    const sections = textContent.split(/(?=## )/g);
    if (sections.length === 1 && !sections[0].startsWith('##')) {
      return (
        <p className="text-[14px] leading-relaxed whitespace-pre-wrap break-words" style={{ color: 'hsl(224 15% 80%)' }}>
          {textContent.replace(/\*\*/g, '').replace(/\*/g, '')}
        </p>
      );
    }

    return (
      <div className="flex flex-col gap-2.5 w-full">
        {sections.map((sec, idx) => {
          const cleanSec = sec.replace(/^## /, '').trim();
          const [title, ...body] = cleanSec.split('\n');
          const content = body.join('\n').trim();
          if (!title && !content) return null;
          return (
            <div key={idx} className="p-3 rounded-xl"
              style={{ background: 'rgba(255,160,50,0.05)', border: '1px solid rgba(255,160,50,0.12)' }}>
              {title && (
                <h3 className="text-sm font-bold mb-1.5 flex items-center gap-1.5"
                  style={{ color: 'hsl(42 90% 68%)' }}>
                  <span className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ background: 'hsl(28 95% 58%)' }} />
                  {title.replace(/\*\*/g, '')}
                </h3>
              )}
              <div className="text-[13px] leading-relaxed whitespace-pre-wrap" style={{ color: 'hsl(224 15% 72%)' }}>
                {content.split('\n').map((line, i) => (
                  <div key={i} className={cn(line.startsWith('•') || line.startsWith('-') ? "pl-2 mb-1" : "mb-0.5")}>
                    {line.replace(/\*\*/g, '')}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const handleStartEdit = () => {
    setEditingMessage(message.id, String(message.text));
    setTimeout(() => {
      const inputEl = document.getElementById('chat-input') as HTMLTextAreaElement | null;
      if (inputEl) {
        inputEl.focus();
        inputEl.setSelectionRange(inputEl.value.length, inputEl.value.length);
      }
    }, 50);
  };

  const handleDelete = () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
      setTimeout(() => setShowDeleteConfirm(false), 3000);
      return;
    }
    deleteMessage(message.id);
    setShowDeleteConfirm(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        'flex w-full mb-5 gap-2.5 group',
        isBot ? 'justify-start' : 'justify-end'
      )}
    >
      {/* Bot avatar */}
      {isBot && (
        <div
          className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center shadow-md text-white mt-0.5"
          style={{
            background: 'linear-gradient(135deg, hsl(28 95% 45%), hsl(22 90% 35%) 50%, hsl(175 75% 30%) 100%)',
            boxShadow: '0 4px 20px hsl(28 90% 45% / 0.4)',
          }}
        >
          <Bot className="h-4 w-4" />
        </div>
      )}

      <div className={cn(
        "flex flex-col max-w-[95%] min-w-0 overflow-hidden",
        isBot ? "items-start" : "items-end"
      )}>
        {/* ── Message Bubble ── */}
        <div
          className={cn(
            'relative w-full overflow-hidden',
            isBot
              ? 'rounded-2xl rounded-tl-none'
              : 'rounded-2xl rounded-tr-none'
          )}
          style={isBot ? {
            background: 'linear-gradient(135deg, rgba(10,18,48,0.92), rgba(8,16,40,0.95))',
            border: '1px solid rgba(255,160,50,0.1)',
            borderLeft: '3px solid hsl(28 95% 52%)',
            boxShadow: '0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)',
            padding: '14px 16px',
          } : {
            background: 'linear-gradient(135deg, hsl(28 90% 40%), hsl(22 85% 32%))',
            boxShadow: '0 4px 24px hsl(28 90% 40% / 0.4)',
            border: '1px solid hsl(28 90% 50% / 0.3)',
            padding: '12px 16px',
          }}
        >
          {/* Speaking shimmer effect */}
          {isSpeaking && (
            <div
              className="absolute inset-0 pointer-events-none rounded-inherit"
              style={{
                background: 'linear-gradient(90deg, transparent 0%, hsl(28 95% 55% / 0.08) 50%, transparent 100%)',
                backgroundSize: '200% auto',
                animation: 'shimmer 2s linear infinite',
              }}
            />
          )}
          {renderContent()}
        </div>

        {/* ── Footer: time + speak + edit/delete ── */}
        <div className="flex items-center gap-2 mt-1.5 px-1">
          {/* Timestamp */}
          <span className="text-[10px] font-medium" style={{ color: 'hsl(224 20% 45%)' }}>{time}</span>

          {/* ── SPEAK / STOP BUTTON ── */}
          {isBot && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (isSpeaking) {
                  stopSpeaking();
                } else {
                  handleSpeak();
                }
              }}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all duration-200"
              )}
              style={isSpeaking ? {
                background: 'hsl(0 84% 55% / 0.15)',
                border: '1px solid hsl(0 84% 55% / 0.35)',
                color: 'hsl(0 84% 62%)',
                boxShadow: '0 0 8px hsl(0 84% 55% / 0.2)'
              } : {
                background: 'hsl(28 95% 55% / 0.1)',
                border: '1px solid hsl(28 95% 55% / 0.22)',
                color: 'hsl(28 90% 68%)'
              }}
              title={isSpeaking ? "Stop speaking" : "Listen to this message"}
            >
              {isSpeaking ? (
                <>
                  <StopCircle className="h-3 w-3" />
                  <span>Stop</span>
                  {/* Animated pulse dot */}
                  <span className="relative flex h-2 w-2 ml-0.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-60"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                </>
              ) : (
                <>
                  <Volume2 className="h-3 w-3" />
                  <span>Speak</span>
                </>
              )}
            </motion.button>
          )}

          {/* User message actions (edit + delete) */}
          {!isBot && (
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.85, x: 10 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.85, x: 10 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-center gap-1"
                >
                  <button
                    onClick={handleStartEdit}
                    title="Edit message"
                    className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-500 border border-blue-100 hover:bg-blue-100 transition-all"
                  >
                    <Pencil size={10} />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={handleDelete}
                    title={showDeleteConfirm ? "Click again to confirm" : "Delete message"}
                    className={cn(
                      "flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border transition-all",
                      showDeleteConfirm
                        ? "bg-red-100 text-red-600 border-red-300 animate-pulse"
                        : "bg-slate-50 text-slate-400 border-slate-200 hover:bg-red-50 hover:text-red-500 hover:border-red-200"
                    )}
                  >
                    <Trash2 size={10} />
                    <span>{showDeleteConfirm ? "Confirm?" : "Delete"}</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default React.memo(ChatMessage);
