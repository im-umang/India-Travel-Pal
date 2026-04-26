import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  LogOut, Map, Route, Wallet, Mic, Sparkles,
  Landmark, Waves, Mountain, MessageCircle,
  Compass, Wind, ArrowRight, Star, Plane,
  ChevronRight, Camera, UtensilsCrossed, Train, ShieldCheck,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

/* ─── Stagger helpers ─── */
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' as const } },
};
const scaleIn = {
  hidden: { opacity: 0, scale: 0.88 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.42, ease: 'easeOut' as const } },
};

/* ─── Dashboard ─── */
const Dashboard = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  /* ─── Data (Localized) ─── */
  const features = [
    {
      icon: <Map className="h-5 w-5" />,
      title: 'Popular Routes',
      description: 'Delhi → Agra, Mumbai → Goa, Bangalore → Mysore, and 2000+ more routes!',
      gradient: 'from-amber-500 to-orange-500',
      glow: 'hsl(35 95% 55% / 0.3)',
      chatMsg: 'Show me the most popular travel routes in India',
      emoji: '🗺️',
    },
    {
      icon: <Train className="h-5 w-5" />,
      title: 'Transport Options',
      description: 'Compare trains, buses, flights, and cabs instantly.',
      gradient: 'from-teal-500 to-cyan-500',
      glow: 'hsl(175 75% 42% / 0.3)',
      chatMsg: 'What are the transport options between major Indian cities?',
      emoji: '🚄',
    },
    {
      icon: <Wallet className="h-5 w-5" />,
      title: 'Price Estimates',
      description: 'Get realistic price ranges in Indian Rupees (₹).',
      gradient: 'from-violet-500 to-purple-600',
      glow: 'hsl(270 70% 55% / 0.3)',
      chatMsg: 'Give me a budget breakdown for a trip to Goa for 5 days',
      emoji: '💰',
    },
    {
      icon: <Mic className="h-5 w-5" />,
      title: 'Voice Input',
      description: 'Speak your queries — supports English & Hinglish!',
      gradient: 'from-rose-500 to-pink-500',
      glow: 'hsl(340 80% 55% / 0.3)',
      chatMsg: 'How do I use voice input to ask travel questions?',
      emoji: '🎙️',
    },
  ];

  const destinations = [
    { name: 'Agra', tagline: 'Taj Mahal', emoji: '🕌', chatMsg: 'Plan a 2-day trip to Agra to see the Taj Mahal', color: 'from-rose-500 to-pink-600', accent: '#f43f5e' },
    { name: 'Goa', tagline: 'Beach Heaven', emoji: '🏖️', chatMsg: 'Plan a 5-day Goa beach holiday with budget', color: 'from-cyan-500 to-blue-600', accent: '#06b6d4' },
    { name: 'Jaipur', tagline: 'Pink City', emoji: '🏰', chatMsg: 'What are must-visit places in Jaipur?', color: 'from-amber-500 to-orange-600', accent: '#f59e0b' },
    { name: 'Kerala', tagline: "God's Own Country", emoji: '🌴', chatMsg: 'Plan a 7-day Kerala backwaters trip', color: 'from-emerald-500 to-green-600', accent: '#10b981' },
    { name: 'Manali', tagline: 'Snow Paradise', emoji: '🏔️', chatMsg: 'Plan a Manali trip from Delhi — best time?', color: 'from-blue-500 to-indigo-600', accent: '#6366f1' },
    { name: 'Varanasi', tagline: 'Spiritual Capital', emoji: '🪔', chatMsg: 'Plan a spiritual journey to Varanasi', color: 'from-orange-500 to-yellow-500', accent: '#f97316' },
  ];

  const quickPrompts = [
    { label: 'Plan a Golden Triangle tour', icon: '✨' },
    { label: 'Best hill stations near Mumbai', icon: '⛰️' },
    { label: 'Budget trip under ₹15,000', icon: '💸' },
    { label: 'Weekend getaway from Delhi', icon: '🗓️' },
  ];

  const handleLogout = () => { logout(); navigate('/login'); };

  const goToChat = (message?: string) => {
    if (message) navigate('/chat', { state: { initialMessage: message } });
    else navigate('/chat');
  };

  return (
    <div className="min-h-screen min-h-[100dvh] flex flex-col relative overflow-hidden bg-background">

      {/* ── Ambient Orbs ── */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Saffron orb top-left */}
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full animate-orb"
          style={{ background: 'radial-gradient(circle, hsl(28 95% 55% / 0.18), transparent 70%)', filter: 'blur(80px)' }} />
        {/* Teal orb bottom-right */}
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full animate-drift"
          style={{ background: 'radial-gradient(circle, hsl(175 75% 42% / 0.15), transparent 70%)', filter: 'blur(80px)', animationDelay: '5s' }} />
        {/* Purple orb center */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full animate-float"
          style={{ background: 'radial-gradient(circle, hsl(245 70% 45% / 0.08), transparent 70%)', filter: 'blur(60px)', animationDelay: '10s' }} />
        {/* Floating travel emojis */}
        {['✈️', '🗺️', '🧳', '🏔️', '🌊', '🏛️'].map((emoji, i) => (
          <div key={i} className="absolute text-3xl opacity-[0.07] select-none pointer-events-none"
            style={{
              top: `${8 + i * 15}%`, left: `${4 + i * 17}%`,
              animation: `float ${6 + i * 1.3}s ease-in-out infinite`, animationDelay: `${i * 0.8}s`
            }}>
            {emoji}
          </div>
        ))}
      </div>

      {/* ══ Header ══ */}
      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.45 }}
        className="sticky top-0 z-40 shrink-0 header-royal"
      >
        <div className="container mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 flex items-center justify-center logo-ring rounded-xl">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, hsl(28 95% 45%), hsl(28 90% 35%))' }}>
                <Compass className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="hidden sm:block">
              <h1 className="font-bold text-base tracking-tight text-white/95">India Travel Pal</h1>
              <p className="text-[11px] font-medium" style={{ color: 'hsl(42 70% 65%)' }}>{t('common.hero_badge') || 'Your AI Travel Companion'}</p>
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-2">
            {user?.role === 'admin' && (
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                onClick={() => navigate('/admin')}
                className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all"
                style={{ background: 'hsl(42 95% 58% / 0.12)', border: '1px solid hsl(42 95% 58% / 0.25)', color: 'hsl(42 95% 72%)' }}>
                <ShieldCheck className="h-3.5 w-3.5" />{t('common.admin_panel')}
              </motion.button>
            )}
            <motion.button whileHover={{ scale: 1.04, y: -1 }} whileTap={{ scale: 0.96 }}
              onClick={() => goToChat()}
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white shadow-saffron transition-all"
              style={{ background: 'linear-gradient(135deg, hsl(28 95% 50%), hsl(22 90% 42%))' }}>
              <MessageCircle className="h-4 w-4" />{t('common.open_chat')}
            </motion.button>
            <Button variant="ghost" size="sm" onClick={handleLogout}
              className="rounded-xl text-white/75 hover:text-white hover:bg-white/10 transition-all duration-200">
              <LogOut className="h-4 w-4 sm:mr-1.5" />
              <span className="hidden sm:inline text-sm">{t('common.logout')}</span>
            </Button>
          </div>
        </div>
      </motion.header>

      {/* ══ Main Content ══ */}
      <main className="flex-1 relative z-10 container mx-auto px-4 sm:px-6 py-10 pb-24">
        <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-14">

          {/* ── HERO ── */}
          <motion.div variants={fadeUp} className="text-center space-y-7 pt-4">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.75 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 250 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold text-orange-900 dark:text-amber-100"
              style={{
                background: 'linear-gradient(135deg, hsl(28 95% 55% / 0.22), hsl(175 75% 42% / 0.18))',
                border: '1px solid hsl(28 95% 45% / 0.45)',
              }}>
              <Sparkles className="h-3.5 w-3.5 text-orange-700 dark:text-amber-200" />
              {t('dashboard.hero_badge')}
            </motion.div>

            {/* Heading */}
            <div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-slate-900 dark:text-white">
                {t('dashboard.namaste')},{' '}
                <span className="gradient-text">
                  {user?.full_name?.split(' ')[0] || 'Traveler'}
                </span>
                !
              </h2>
              <p className="mt-4 text-base sm:text-lg max-w-xl mx-auto leading-relaxed text-slate-600 dark:text-slate-400">
                {t('dashboard.tagline')}
              </p>
            </div>

            {/* Stats row */}
            <div className="flex items-center justify-center gap-8 sm:gap-16 pt-1">
              {[
                { label: t('dashboard.stats.destinations'), value: '500+', icon: '📍' },
                { label: t('dashboard.stats.routes'), value: '2000+', icon: '🛤️' },
                { label: t('dashboard.stats.languages'), value: 'EN + HI', icon: '🗣️' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-xl mb-1">{stat.icon}</div>
                  <div className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-orange-700 to-teal-800 dark:from-amber-200 dark:to-teal-200 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-xs font-semibold mt-0.5 uppercase tracking-wider text-slate-600 dark:text-amber-200/85">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, type: 'spring', stiffness: 200 }}>
              <motion.button
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => goToChat()}
                id="start-chat-btn"
                className="inline-flex items-center gap-3 px-9 py-4 rounded-2xl text-white font-bold text-base sm:text-lg shadow-glow transition-all duration-300 animate-border-glow"
                style={{
                  background: 'linear-gradient(135deg, hsl(28 95% 48%), hsl(22 90% 38%))',
                  border: '2px solid hsl(28 95% 60% / 0.4)',
                  boxShadow: '0 0 50px hsl(28 95% 55% / 0.35), 0 8px 32px rgba(0,0,0,0.4)',
                }}>
                <Plane className="h-5 w-5" />
                {t('dashboard.start_planning')}
                <ArrowRight className="h-4 w-4" />
              </motion.button>
            </motion.div>

            {/* Quick Prompts */}
            <div className="flex flex-wrap justify-center gap-2.5 pt-1">
              {quickPrompts.map((p, i) => (
                <motion.button
                  key={p.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.07 }}
                  whileHover={{ scale: 1.06, y: -2 }}
                  onClick={() => goToChat(p.label)}
                  className="prompt-chip prompt-chip-dashboard inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold cursor-pointer">
                  <span>{p.icon}</span>{p.label}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* ── Divider ── */}
          <div className="divider-india max-w-3xl mx-auto" />

          {/* ── FEATURES GRID ── */}
          <motion.div variants={fadeUp}>
            <p className="section-label text-center mb-8">✦ {t('dashboard.features_label')} ✦</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
              {features.map((f, i) => (
                <motion.div key={i} variants={scaleIn}
                  whileHover={{ y: -7, scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="cursor-pointer group feature-card rounded-2xl p-5 flex items-start gap-4 relative overflow-hidden"
                  style={{ backdropFilter: 'blur(16px)' }}
                  onClick={() => goToChat(f.chatMsg)}>
                  {/* Hover glow BG */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
                    style={{ background: `radial-gradient(ellipse at 30% 50%, ${f.glow}, transparent 70%)` }} />
                  {/* Icon */}
                  <div className={`relative z-10 shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br ${f.gradient} flex items-center justify-center text-white shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300`}>
                    {f.icon}
                  </div>
                  {/* Text */}
                  <div className="relative z-10 min-w-0 flex-1">
                    <h4 className="font-bold text-sm text-white/95 mb-0.5 flex items-center gap-1.5">
                      <span>{f.emoji}</span>{f.title}
                    </h4>
                    <p className="text-xs leading-relaxed text-slate-200/95">{f.description}</p>
                  </div>
                  <ChevronRight className="relative z-10 h-4 w-4 text-white/20 group-hover:text-white/50 group-hover:translate-x-1 transition-all duration-200 shrink-0 mt-0.5" />
                </motion.div>
              ))}
            </div>
            <p className="text-center text-xs mt-4 flex items-center justify-center gap-1 text-slate-500 dark:text-slate-400">
              <MessageCircle className="h-3 w-3" />{t('chat.empty_state')}
            </p>
          </motion.div>

          {/* ── Divider ── */}
          <div className="divider-india max-w-3xl mx-auto" />

          {/* ── DESTINATIONS ── */}
          <motion.div variants={fadeUp} className="text-center">
            <p className="section-label mb-8">✦ {t('dashboard.popular_destinations')} ✦</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 max-w-4xl mx-auto">
              {destinations.map((dest, i) => (
                <motion.div key={dest.name}
                  initial={{ opacity: 0, y: 24, scale: 0.88 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.55 + i * 0.07, type: 'spring', stiffness: 220 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => goToChat(dest.chatMsg)}
                  className="cursor-pointer group dest-card rounded-2xl p-3.5 flex flex-col items-center gap-2.5 relative overflow-hidden"
                  style={{ backdropFilter: 'blur(16px)' }}>
                  {/* Glow on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: `radial-gradient(ellipse at 50% 50%, ${dest.accent}18, transparent 70%)` }} />
                  {/* Emoji avatar */}
                  <div className={`relative z-10 w-12 h-12 rounded-2xl bg-gradient-to-br ${dest.color} flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300`}>
                    {dest.emoji}
                  </div>
                  <div className="relative z-10">
                    <p className="font-bold text-sm text-white/95">{dest.name}</p>
                    <p className="text-[10px] leading-tight mt-0.5 text-slate-300">{dest.tagline}</p>
                  </div>
                  <div className="relative z-10 text-[10px] font-semibold opacity-0 group-hover:opacity-100 flex items-center gap-0.5 transition-all"
                    style={{ color: dest.accent }}>
                    {t('common.open_chat')} <ArrowRight className="h-2.5 w-2.5" />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ── CTA Banner ── */}
          <motion.div variants={fadeUp}>
            <div className="relative rounded-3xl overflow-hidden max-w-3xl mx-auto"
              style={{
                background: 'linear-gradient(135deg, hsl(28 90% 32%), hsl(28 85% 22%) 40%, hsl(175 70% 18%) 100%)',
                border: '1px solid hsl(28 90% 50% / 0.3)',
                boxShadow: '0 24px 80px rgba(0,0,0,0.5), 0 0 60px hsl(28 95% 45% / 0.2)',
              }}>
              {/* Decorative circles */}
              <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full" style={{ background: 'hsl(28 95% 55% / 0.08)', filter: 'blur(30px)' }} />
              <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full" style={{ background: 'hsl(175 75% 42% / 0.1)', filter: 'blur(30px)' }} />

              <div className="relative z-10 p-8 sm:p-10 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                <div className="text-5xl animate-float">🧳</div>
                <div className="flex-1">
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-1.5">{t('dashboard.cta_title')}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'hsl(28 60% 80%)' }}>
                    {t('dashboard.cta_desc')}
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.97 }}
                  onClick={() => goToChat()}
                  className="shrink-0 flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-slate-900 shadow-lg hover:shadow-xl transition-all"
                  style={{ background: 'linear-gradient(135deg, hsl(42 95% 65%), hsl(35 95% 58%))' }}>
                  <Wind className="h-4 w-4" />{t('common.open_chat')}
                </motion.button>
              </div>
            </div>
          </motion.div>

        </motion.div>
      </main>

      {/* ── Footer ── */}
      <footer className="fixed bottom-0 left-0 right-0 z-30 py-2.5"
        style={{
          background: 'rgba(5,8,22,0.85)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(255,160,50,0.08)',
        }}>
        <p className="text-center text-xs text-slate-300">
          {t('dashboard.footer_text')}
          {' '}• <Star className="inline h-3 w-3 text-amber-400 fill-amber-400" /> Powered by Gemini
        </p>
      </footer>
    </div>
  );
};

export default Dashboard;
