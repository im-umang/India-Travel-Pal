import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Train, Plane, Layers, IndianRupee, Sparkles } from 'lucide-react';
import { useChat, TransportMode } from '@/context/ChatContext';

// ── Config ─────────────────────────────────────────────────────────────────────
const TRANSPORT_CONFIG: Record<
  Exclude<TransportMode, null>,
  { icon: React.ReactNode; label: string; sub: string; gradient: string; textColor: string }
> = {
  train: {
    icon: <Train className="w-4 h-4" />,
    label: '🚆 Train Best Hai!',
    sub: 'Budget ke hisaab se train sabse sasta option hai',
    gradient: 'from-emerald-500 to-teal-600',
    textColor: 'text-emerald-700',
  },
  both: {
    icon: <Layers className="w-4 h-4" />,
    label: '🚆✈️ Train ya Flight — Dono Option Hai',
    sub: 'Budget mein train aur flight dono fit hote hain',
    gradient: 'from-amber-500 to-orange-500',
    textColor: 'text-amber-700',
  },
  flight: {
    icon: <Plane className="w-4 h-4" />,
    label: '✈️ Flight Recommend Hai!',
    sub: 'Budget achha hai — flight se time bachega',
    gradient: 'from-violet-500 to-indigo-600',
    textColor: 'text-violet-700',
  },
};

function formatBudget(amount: number): string {
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(0)}K`;
  return `₹${amount}`;
}

/**
 * ProFeatureBanner
 * ─────────────────
 * Shows two AI insight pills at the top of the chat:
 *   1. Budget Badge   — detected ₹ amount
 *   2. Transport Mode — Train / Both / Flight recommendation
 */
const ProFeatureBanner: React.FC = () => {
  const { detectedBudget, transportRecommendation } = useChat();

  const visible = detectedBudget !== null;
  const config = transportRecommendation ? TRANSPORT_CONFIG[transportRecommendation] : null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="pro-banner"
          initial={{ opacity: 0, y: -12, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          className="w-full px-3 sm:px-4 pt-2 pb-0"
        >
          <div className="flex flex-wrap gap-2 items-center">

            {/* ── Budget Badge ─────────────────────────────────────────────── */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.05, type: 'spring', stiffness: 400 }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 shadow-md shadow-pink-200 dark:shadow-pink-900/30"
            >
              <IndianRupee className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
              <span className="text-white text-[11px] font-bold tracking-wide">
                Budget Detected: {formatBudget(detectedBudget!)}
              </span>
              <Sparkles className="w-3 h-3 text-white/80 animate-pulse" />
            </motion.div>

            {/* ── Transport Recommendation ────────────────────────────────── */}
            {config && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.12, type: 'spring', stiffness: 400 }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r ${config.gradient} shadow-md`}
                title={config.sub}
              >
                <span className="text-white">{config.icon}</span>
                <span className="text-white text-[11px] font-bold tracking-wide whitespace-nowrap">
                  {config.label}
                </span>
              </motion.div>
            )}

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProFeatureBanner;
