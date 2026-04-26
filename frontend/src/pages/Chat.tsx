import { useRef, useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { ChatProvider, useChat } from '@/context/ChatContext';
import { motion, AnimatePresence } from 'framer-motion';
import ChatHeader from '@/components/ChatHeader';
import ChatMessage from '@/components/ChatMessage';
import ChatInput from '@/components/ChatInput';
import TypingIndicator from '@/components/TypingIndicator';
import ChatSidebar from '@/components/ChatSidebar';
import ProFeatureBanner from '@/components/ProFeatureBanner';
import { Bot, Sparkles, Plane, Train, Hotel, Map } from 'lucide-react';
import { cn } from '@/lib/utils';
import { stopSpeaking } from '@/lib/voiceService';

/**
 * EmptyState — shown when no messages yet
 * Beautiful India-themed welcome screen with animated quick prompts
 */
const EmptyState: React.FC = () => {
  const { t } = useTranslation();
  const { sendMessage } = useChat();

  const suggestions = [
    { label: 'Goa 3 din ka plan banao, budget ₹10,000', icon: '🏖️', gradient: 'from-cyan-400 to-blue-500', textColor: 'text-cyan-700' },
    { label: 'Mumbai se Delhi train options batao', icon: '🚆', gradient: 'from-orange-400 to-amber-500', textColor: 'text-orange-700' },
    { label: 'Jaipur 2 din itinerary with budget', icon: '🏰', gradient: 'from-amber-400 to-yellow-500', textColor: 'text-amber-700' },
    { label: 'Kerala backwaters trip kaise plan karein', icon: '🌴', gradient: 'from-emerald-400 to-green-500', textColor: 'text-emerald-700' },
    { label: 'Ahmedabad se Goa flight ya train?', icon: '✈️', gradient: 'from-blue-400 to-indigo-500', textColor: 'text-blue-700' },
    { label: 'Delhi ke paas hill stations suggest karo', icon: '🏔️', gradient: 'from-indigo-400 to-violet-500', textColor: 'text-indigo-700' },
    { label: 'Varanasi spiritual tour plan karo', icon: '🪔', gradient: 'from-rose-400 to-pink-500', textColor: 'text-rose-700' },
    { label: '₹8000 budget mein 3 din ki trip', icon: '💰', gradient: 'from-violet-400 to-purple-500', textColor: 'text-violet-700' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center w-full text-center px-4 py-8 max-w-2xl mx-auto min-h-full"
    >
      {/* Animated logo orb */}
      <div className="relative mb-8 mt-4">
        {/* Outer glow ring */}
        <div className="absolute inset-0 rounded-3xl animate-pulse-glow -m-2" />
        <div
          className="relative w-24 h-24 rounded-3xl flex items-center justify-center shadow-2xl"
          style={{
            background: 'linear-gradient(135deg, hsl(192 85% 28%) 0%, hsl(280 70% 45%) 50%, hsl(35 100% 50%) 100%)',
            boxShadow: '0 0 60px hsl(192 85% 35% / 0.4), 0 20px 40px rgba(0,0,0,0.25)',
          }}
        >
          <Bot className="h-11 w-11 text-white" />
        </div>
        {/* India flag badge */}
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-1.5 -right-1.5 w-8 h-8 bg-white rounded-full border-2 border-white flex items-center justify-center text-base shadow-lg"
        >
          🇮🇳
        </motion.div>
      </div>

      {/* Heading */}
      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="text-2xl font-bold tracking-tight mb-2 text-slate-800"
      >
        <span style={{
          background: 'linear-gradient(135deg, hsl(192 85% 30%), hsl(280 70% 42%), hsl(28 95% 40%))',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          {t('chat.empty_state')}
        </span>
      </motion.h3>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-slate-500 text-xs max-w-md mb-3"
      >
        {t('dashboard.cta_desc')}
      </motion.p>

      {/* Feature pills */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex flex-wrap justify-center gap-2 mb-6"
      >
        {[
          { icon: <Plane size={10} />, label: 'Flights' },
          { icon: <Train size={10} />, label: 'Trains' },
          { icon: <Hotel size={10} />, label: 'Hotels' },
          { icon: <Map size={10} />, label: 'Itinerary' },
          { icon: <Sparkles size={10} />, label: 'Budget' },
        ].map((f, i) => (
          <span
            key={f.label}
            className="flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-semibold"
            style={{
              background: `hsl(${192 + i * 20} 80% 30% / 0.08)`,
              color: `hsl(${192 + i * 20} 80% 30%)`,
              border: `1px solid hsl(${192 + i * 20} 80% 30% / 0.2)`,
            }}
          >
            {f.icon}
            {f.label}
          </span>
        ))}
      </motion.div>

      {/* Quick suggestions grid */}
      <div className="w-full max-w-xl">
        <p className="text-[10px] text-slate-600 uppercase tracking-widest font-bold mb-3">
          ✦ {t('chat.new_chat')} — {t('chat.input_placeholder')} ✦
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {suggestions.map((s, i) => (
            <motion.button
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.06 }}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => sendMessage(s.label)}
              className="flex items-center gap-3 p-3 rounded-2xl border text-left transition-all duration-200 shadow-sm group bg-white/90 hover:shadow-md"
              style={{ borderColor: 'rgba(0,0,0,0.06)' }}
            >
              {/* Gradient icon pill */}
              <span
                className={cn('flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-base shadow-sm bg-gradient-to-br', s.gradient)}
              >
                {s.icon}
              </span>
              <span className={cn('text-xs font-semibold text-slate-800 group-hover:text-slate-950 leading-snug transition-colors', `group-hover:${s.textColor}`)}>
                {s.label}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
const StepProgress: React.FC = () => {
  const { t } = useTranslation();
  const { currentStep } = useChat();
  const steps = [
    { n: 1, label: 'Budget' },
    { n: 2, label: 'Travel' },
    { n: 3, label: 'Stay' },
    { n: 4, label: 'Food' },
    { n: 5, label: 'Plan' },
  ];

  if (currentStep === 0) return null;

  return (
    <div className="px-4 py-3 bg-white/80 border-b border-slate-100 backdrop-blur-sm sticky top-0 z-20">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          {steps.map((s, i) => {
            const isCompleted = currentStep > s.n;
            const isActive = currentStep === s.n;
            return (
              <React.Fragment key={s.n}>
                <div className="flex flex-col items-center gap-1.5 relative">
                  <motion.div
                    initial={false}
                    animate={{
                      backgroundColor: isActive || isCompleted ? 'hsl(28 95% 55%)' : 'hsl(224 15% 90%)',
                      scale: isActive ? 1.15 : 1,
                    }}
                    className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black transition-colors shadow-sm",
                      isActive || isCompleted ? "text-white" : "text-slate-400"
                    )}
                  >
                    {isCompleted ? '✓' : s.n}
                  </motion.div>
                  <span className={cn(
                    "text-[9px] font-bold uppercase tracking-tight",
                    isActive ? "text-orange-600" : isCompleted ? "text-slate-600" : "text-slate-400"
                  )}>
                    {t(`chat.step_${s.label.toLowerCase()}`)}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="activeStep"
                      className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full border-2 border-white"
                    />
                  )}
                </div>
                {i < steps.length - 1 && (
                  <div className="flex-1 h-[2px] mx-2 mb-4 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: isCompleted ? '100%' : '0%' }}
                      className="h-full bg-orange-400"
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/**
 * ChatLayout — Royal India theme layout
 * Stunning animated background with glassmorphism chat area
 */
const ChatLayout: React.FC = () => {
  const { messages, isTyping, currentConversationId, sendMessage } = useChat();
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollAnchorRef = useRef<HTMLDivElement>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const initialMessageSent = useRef(false);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    if (scrollAnchorRef.current) {
      scrollAnchorRef.current.scrollIntoView({ behavior, block: 'end' });
      return;
    }
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) setIsSidebarOpen(false);
      else setIsSidebarOpen(true);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    return () => { stopSpeaking(); };
  }, []);

  useEffect(() => {
    const msg = (location.state as any)?.initialMessage;
    if (msg && !initialMessageSent.current) {
      initialMessageSent.current = true;
      setTimeout(() => sendMessage(msg), 600);
      window.history.replaceState({}, document.title);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (messages.length === 0 && !isTyping) return;
    const behavior: ScrollBehavior = messages.length <= 1 ? 'instant' : 'smooth';
    const timer = setTimeout(() => scrollToBottom(behavior), 80);
    return () => clearTimeout(timer);
  }, [messages, isTyping, currentConversationId, scrollToBottom]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const hasMessages = messages.length > 0;

  return (
    <div className="flex h-[100dvh] min-h-[100dvh] max-h-[100dvh] overflow-hidden relative">

      {/* ── Royal animated background (visible behind glass panels) ── */}
      <div className="fixed inset-0 z-0" style={{
        background: 'linear-gradient(135deg, #0f0c29 0%, #1a1a4e 25%, #1b3a4b 50%, #0d3b2e 70%, #2d1b4e 100%)',
        backgroundSize: '400% 400%',
        animation: 'bgFlow 18s ease infinite',
      }} />

      {/* Floating orbs — deep, rich ambient glows */}
      <div className="fixed pointer-events-none z-0">
        {/* Teal orb */}
        <div className="absolute top-20 left-1/4 w-80 h-80 rounded-full animate-orb"
          style={{ background: 'radial-gradient(circle, hsl(192 85% 40% / 0.18), transparent 70%)', filter: 'blur(40px)' }} />
        {/* Gold orb */}
        <div className="absolute bottom-32 right-1/4 w-64 h-64 rounded-full animate-orb"
          style={{ background: 'radial-gradient(circle, hsl(35 100% 55% / 0.14), transparent 70%)', filter: 'blur(40px)', animationDelay: '3s' }} />
        {/* Purple orb */}
        <div className="absolute top-1/2 left-1/2 w-96 h-96 rounded-full animate-drift"
          style={{ background: 'radial-gradient(circle, hsl(280 70% 55% / 0.08), transparent 70%)', filter: 'blur(60px)' }} />
        {/* Emerald orb */}
        <div className="absolute bottom-20 left-1/6 w-48 h-48 rounded-full animate-float"
          style={{ background: 'radial-gradient(circle, hsl(145 60% 40% / 0.12), transparent 70%)', filter: 'blur(30px)', animationDelay: '5s' }} />
      </div>

      {/* ── Sidebar ── */}
      <ChatSidebar
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        isMobile={isMobile}
      />

      {/* ── Main Chat Panel (frosted glass over royal bg) ── */}
      <div className={cn(
        "flex-1 flex flex-col h-full transition-all duration-300 ease-in-out relative z-10 min-w-0",
        isSidebarOpen && !isMobile ? "ml-64" : "ml-0"
      )}>
        {/* Glass chat area — solid white light panel */}
        <div className="flex flex-col h-full"
          style={{
            background: 'rgba(255,255,255,0.97)',
            backdropFilter: 'blur(32px) saturate(160%)',
            WebkitBackdropFilter: 'blur(32px) saturate(160%)',
            borderLeft: '1px solid rgba(255,255,255,0.6)',
            boxShadow: 'inset 0 0 0 1px rgba(15,113,115,0.04)',
          }}>

          {/* Header */}
          <ChatHeader toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

          {/* 📊 Journey Progress Header */}
          <StepProgress />

          {/* Scrollable message area */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin relative z-0"
            style={{
              background: 'linear-gradient(180deg, #f8faff 0%, #f0fdf8 40%, #f8f4ff 100%)',
              minHeight: 0,
            }}
          >
            {hasMessages ? (
              <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-12">
                <AnimatePresence initial={false}>
                  {messages.map((message) => (
                    <ChatMessage key={message.id} message={message} />
                  ))}
                </AnimatePresence>

                {/* Typing indicator */}
                <AnimatePresence>
                  {isTyping && <TypingIndicator />}
                </AnimatePresence>

                <div ref={scrollAnchorRef} className="h-4" aria-hidden="true" />
              </div>
            ) : (
              <div className="min-h-full flex flex-col items-center justify-center py-10 px-4">
                <EmptyState />
              </div>
            )}
          </div>

          {/* ── Input bar ── */}
          <div className="shrink-0"
            style={{
              borderTop: '1px solid rgba(15,113,115,0.12)',
              background: 'linear-gradient(to top, #ffffff 0%, rgba(248,253,250,0.98) 100%)',
              boxShadow: '0 -6px 30px rgba(15,113,115,0.07)',
            }}
          >
            <ProFeatureBanner />
            <div
              className="max-w-3xl mx-auto px-4 sm:px-6 pt-2"
              style={{
                paddingBottom: 'calc(0.875rem + env(safe-area-inset-bottom, 0px))',
              }}
            >
              <div className="input-royal rounded-2xl px-1 sm:px-2 py-1">
                <ChatInput />
              </div>
              <div className="text-center mt-1.5 px-1">
                <p className="text-[10px] sm:text-[11px] text-slate-600 leading-snug">
                  🇮🇳 India Travel Pal · AI responses may vary · Always verify locally before traveling
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Chat: React.FC = () => (
  <ChatProvider>
    <ChatLayout />
  </ChatProvider>
);

export default Chat;
