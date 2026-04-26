import { motion } from 'framer-motion';
import { Bot, Sparkles } from 'lucide-react';

/**
 * TypingIndicator — Premium animated "AI is thinking" indicator
 * Color-coded bouncing dots (teal → amber → purple) with shimmer bubble
 */
const TypingIndicator: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.25 }}
      className="flex justify-start mb-5 gap-2.5"
    >
      {/* Bot avatar — gradient matching ChatMessage */}
      <motion.div
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center shadow-md mt-0.5"
        style={{
          background: 'linear-gradient(135deg, hsl(192 85% 28%) 0%, hsl(280 70% 45%) 60%, hsl(35 100% 50%) 100%)',
          boxShadow: '0 4px 16px hsl(192 85% 35% / 0.35)',
        }}
      >
        <Bot className="h-4 w-4 text-white" />
      </motion.div>

      {/* Typing bubble */}
      <div
        className="flex items-center gap-3 px-4 py-3 rounded-2xl rounded-tl-none"
        style={{
          background: '#ffffff',
          border: '1px solid rgba(15,113,115,0.15)',
          borderLeft: '3px solid hsl(192 85% 40%)',
          boxShadow: '0 4px 20px rgba(15,113,115,0.08), 0 1px 4px rgba(0,0,0,0.05)',
        }}
      >
        {/* Bouncing dots */}
        <div className="flex items-center gap-1.5">
          {[
            { color: 'hsl(192 85% 40%)', delay: 0 },
            { color: 'hsl(35 100% 52%)', delay: 0.18 },
            { color: 'hsl(280 70% 58%)', delay: 0.36 },
          ].map((dot, i) => (
            <motion.span
              key={i}
              className="block w-2.5 h-2.5 rounded-full"
              style={{ background: dot.color }}
              animate={{ y: [0, -6, 0], opacity: [0.5, 1, 0.5] }}
              transition={{
                duration: 0.9,
                repeat: Infinity,
                delay: dot.delay,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>

        {/* Status text */}
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-teal-400 animate-pulse" />
          <span className="text-xs text-slate-500 font-semibold">Planning your trip...</span>
        </div>
      </div>
    </motion.div>
  );
};

export default TypingIndicator;
