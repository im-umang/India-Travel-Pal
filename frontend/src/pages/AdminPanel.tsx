import { useState, useEffect, useCallback, useRef } from 'react';
import { config } from '@/config';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, MessageSquare, Activity, ShieldCheck,
  LogOut, RefreshCw, Search, Trash2,
  Ban, CheckCircle, ChevronDown, Clock, Bot,
  User as UserIcon, Map, Plane,
  Train, Compass, Home, Globe,
  ChevronRight, Star, Zap, TrendingUp,
  MapPin, Calendar, Wallet, Route,
  BookOpen, Info, BarChart3,
} from 'lucide-react';

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, LineChart, Line
} from 'recharts';

const API = config.apiBase;
type Tab = 'overview' | 'analytics' | 'users' | 'chats' | 'logs';

// ─── Types ───────────────────────────────────────────────────────────
interface Stats {
  total_users: number; total_trips: number; total_chats: number;
  active_users_today: number; recent_signups: number; blocked_users: number;
  recent_users: RecentUser[];
  recent_conversations: RecentConv[];
  daily_signups: { date: string; count: number }[];
  daily_activity: { date: string; conversations: number; messages: number; active_users: number }[];
}
interface RecentUser { id: string; name?: string; full_name?: string; email: string; role: string; is_blocked?: boolean; created_at?: string; }
interface RecentConv { id: string; user_id: string; title?: string; message_count: number; preview: string; updated_at: string; }

interface UserDoc {
  id: string; name?: string; full_name?: string; email: string;
  role: string; is_blocked?: boolean; created_at?: string; last_login?: string;
}


interface ChatMsg { 
  user_message?: string; 
  bot_reply?: string; 
  role?: string; 
  content?: string; 
  intent?: string; 
  confidence?: number; 
  timestamp: string; 
}
interface ChatSession { user_id: string; session_id: string; updated_at: string; messages: ChatMsg[]; }
interface ConvMsg { role: string; content: string; language?: string; timestamp: string; }
interface Analytics {
  period: string;
  totals: { searches: number; users: number; sessions: string[] };
  growth: { searches: number; latency: number; success_rate: number };
  dest_comparison: { name: string; value: number; budgets: any; modes: any }[];
  trend_data: { time: string; value: number }[];
  user_segments: { new_vs_returning: any[]; budget_dist: any[] };
  categories: { name: string; value: number }[];
  travel_modes: { name: string; value: number }[];
  performance: { success: number; total: number; avg_latency: number };
}
interface Conversation { id: string; user_id: string; title?: string; created_at: string; updated_at: string; message_count?: number; messages?: ConvMsg[]; }
interface LogEntry { id: string; admin_id: string; action: string; target?: string; details?: string; created_at: string; }

// ─── Constants ───────────────────────────────────────────────────────
const NAV: { id: Tab; label: string; icon: React.ReactNode; desc: string }[] = [
  { id: 'overview', label: 'Overview', icon: <Map size={17} />, desc: 'Core statistics' },
  { id: 'analytics', label: 'Insights', icon: <TrendingUp size={17} />, desc: 'Deep data analytics' },
  { id: 'users', label: 'Travelers', icon: <Users size={17} />, desc: 'Manage users' },
  { id: 'chats', label: 'Chat History', icon: <MessageSquare size={17} />, desc: 'AI conversations' },
  { id: 'logs', label: 'Activity Logs', icon: <Activity size={17} />, desc: 'Admin actions' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants: any = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' }
  }
};

const CountUp = ({ value, duration = 2 }: { value: number, duration?: number }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = parseInt(value.toString());
    if (start === end) return;
    const increment = end / (duration * 60);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [value, duration]);
  return <>{count.toLocaleString()}</>;
};

// ─── Sidebar nav ─────────────────────────────────────────────────────

const fmt = (iso?: string) => { if (!iso) return '—'; try { return new Date(iso).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }); } catch { return iso; } };
const fmtD = (iso?: string) => { if (!iso) return '—'; try { return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }); } catch { return iso; } };

// ─── Main Component ───────────────────────────────────────────────────
const AdminPanel = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('overview');
  const [period, setPeriod] = useState<'today' | 'week' | 'month'>('today');
  const [stats, setStats] = useState<Stats | null>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [users, setUsers] = useState<UserDoc[]>([]);
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [convs, setConvs] = useState<Conversation[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [userSearch, setUserSearch] = useState('');
  const refreshTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const [expandedChat, setExpandedChat] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const hdr = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

  useEffect(() => { if (user && user.role !== 'admin') navigate('/dashboard'); }, [user, navigate]);

  // ── Fetchers ──
  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const r = await fetch(`${API}/admin/stats`, { headers: hdr });
      const d = await r.json();
      if (d.success) { setStats(d.stats); setLastUpdated(new Date()); }
    } catch { }
    setStatsLoading(false);
  }, [token]);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try { const r = await fetch(`${API}/admin/users?limit=100`, { headers: hdr }); const d = await r.json(); if (d.success) setUsers(d.users); } catch { }
    setLoading(false);
  }, [token]);

  const fetchChats = useCallback(async () => {
    setLoading(true);
    try {
      // Always load users for name mapping
      if (users.length === 0) {
        const ur = await fetch(`${API}/admin/users?limit=100`, { headers: hdr });
        const ud = await ur.json();
        if (ud.success) setUsers(ud.users);
      }
      // Try chat_history first
      const r = await fetch(`${API}/admin/chat-history?limit=100`, { headers: hdr });
      const d = await r.json();
      if (d.success && d.chats?.length > 0) { setChats(d.chats); setLoading(false); return; }
      // Fallback: conversations collection
      const r2 = await fetch(`${API}/admin/conversations?limit=100`, { headers: hdr });
      const d2 = await r2.json();
      if (d2.success) setConvs(d2.conversations || []);
    } catch { }
    setLoading(false);
  }, [token, users.length]);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch(`${API}/admin/analytics?period=${period}`, { headers: hdr });
      const d = await r.json();
      if (d.success) setAnalytics(d.analytics);
    } catch { }
    setLoading(false);
  }, [token, period]);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try { const r = await fetch(`${API}/admin/logs?limit=50`, { headers: hdr }); const d = await r.json(); if (d.success) setLogs(d.logs); } catch { }
    setLoading(false);
  }, [token]);

  useEffect(() => {
    fetchStats();
    if (tab === 'analytics') fetchAnalytics();
    if (tab === 'users') fetchUsers();
    if (tab === 'chats') fetchChats();
    if (tab === 'logs') fetchLogs();
  }, [tab, period, fetchAnalytics, fetchStats, fetchUsers, fetchChats, fetchLogs]);

  // Auto-refresh stats every 30s on overview
  useEffect(() => {
    if (tab === 'overview') {
      refreshTimer.current = setInterval(fetchStats, 30000);
    } else {
      if (refreshTimer.current) clearInterval(refreshTimer.current);
    }
    return () => { if (refreshTimer.current) clearInterval(refreshTimer.current); };
  }, [tab, fetchStats]);

  // ── Actions ──
  const toggleBlock = async (uid: string, blocked: boolean) => {
    setActionLoading(uid);
    try {
      const r = await fetch(`${API}/admin/users/${uid}/${blocked ? 'unblock' : 'block'}`, { method: 'PATCH', headers: hdr });
      const d = await r.json();
      if (d.success) setUsers(p => p.map(u => u.id === uid ? { ...u, is_blocked: !blocked } : u));
    } catch { }
    setActionLoading(null);
  };

  const deleteUser = async (uid: string) => {
    if (!confirm('Permanently delete this traveler and all their data?')) return;
    setActionLoading(uid);
    try {
      const r = await fetch(`${API}/admin/users/${uid}`, { method: 'DELETE', headers: hdr });
      const d = await r.json();
      if (d.success) setUsers(p => p.filter(u => u.id !== uid));
    } catch { }
    setActionLoading(null);
  };

  // ── Derived ──
  const filteredUsers = users.filter(u =>
    u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
    (u.name || u.full_name || '').toLowerCase().includes(userSearch.toLowerCase())
  );

  const adminName = user?.full_name || user?.email?.split('@')[0] || 'Admin';

  const STAT_CARDS = stats ? [
    { label: 'Total Travelers', value: stats.total_users, icon: <Users size={20} />, color: 'from-blue-400 to-cyan-500', sub: `${stats.blocked_users} blocked` },
    { label: 'Chat Sessions', value: stats.total_chats, icon: <MessageSquare size={20} />, color: 'from-teal-400 to-emerald-500', sub: 'All conversations' },
    { label: 'Active Today', value: stats.active_users_today, icon: <Zap size={20} />, color: 'from-purple-400 to-violet-500', sub: 'Logged in today' },
    { label: 'New This Week', value: stats.recent_signups, icon: <TrendingUp size={20} />, color: 'from-rose-400 to-pink-500', sub: 'Recent signups' },

  ] : [];

  // ─── UI ──────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex" style={{ background: 'linear-gradient(160deg,#060d1a 0%,#0d1f35 45%,#071a12 100%)' }}>

      {/* Background ── z-index 0, NEVER overlapping content */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        {[{ w: 500, h: 500, x: '-10%', y: '-15%', c: 'hsl(192 80% 30%/0.1)' }, { w: 400, h: 400, x: '70%', y: '60%', c: 'hsl(35 95% 55%/0.07)' }, { w: 300, h: 300, x: '40%', y: '-5%', c: 'hsl(280 60% 50%/0.06)' }].map((o, i) => (
          <motion.div key={i} className="absolute rounded-full blur-3xl"
            style={{ width: o.w, height: o.h, left: o.x, top: o.y, background: o.c }}
            animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 8 + i * 2, repeat: Infinity, ease: 'easeInOut' }} />
        ))}
        {[Plane, Train, Compass].map((Icon, i) => (
          <motion.div key={i} className="absolute text-white" style={{ left: `${15 + i * 32}%`, top: `${25 + i * 20}%`, opacity: 0.02 }}
            animate={{ y: [0, -15, 0] }} transition={{ duration: 6 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 1.5 }}>
            <Icon size={70} />
          </motion.div>
        ))}
      </div>

      {/* ── Sidebar  z:50 ── */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside initial={{ x: -260 }} animate={{ x: 0 }} exit={{ x: -260 }} transition={{ duration: 0.26, ease: 'easeOut' }}
            className="fixed inset-y-0 left-0 w-64 flex flex-col border-r"
            style={{ background: 'rgba(6,13,26,0.97)', backdropFilter: 'blur(20px)', borderColor: 'rgba(255,255,255,0.07)', zIndex: 50 }}>

            {/* Logo */}
            <div className="p-5 border-b" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shrink-0 logo-ring overflow-hidden">
                   <img src="/logo.svg" alt="Logo" className="w-full h-full object-cover scale-110" />
                </div>
                <div>
                  <div className="text-white font-bold text-sm">Admin Panel</div>
                  <div className="text-[10px] text-slate-500">India Travel Pal</div>
                </div>
              </div>
            </div>

            <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
              <p className="text-[10px] text-slate-600 font-semibold uppercase tracking-widest px-3 mb-3 mt-2">Navigation</p>
              {NAV.map(item => (
                <button key={item.id} onClick={() => setTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all group ${tab === item.id ? 'text-white' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}
                  style={tab === item.id ? { background: 'linear-gradient(135deg,rgba(20,184,166,0.18),rgba(20,184,166,0.04))', border: '1px solid rgba(20,184,166,0.2)' } : {}}>
                  <span className={`shrink-0 ${tab === item.id ? 'text-teal-400' : 'text-slate-600 group-hover:text-slate-400'}`}>{item.icon}</span>
                  <div className="min-w-0">
                    <div className="text-sm font-medium">{item.label}</div>
                    <div className="text-[10px] text-slate-600">{item.desc}</div>
                  </div>
                  {tab === item.id && <ChevronRight size={13} className="ml-auto text-teal-400 shrink-0" />}
                </button>
              ))}
              <div className="mt-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <p className="text-[10px] text-slate-600 font-semibold uppercase tracking-widest px-3 mb-3">Quick Access</p>
                {[{ label: 'User Dashboard', icon: <Home size={14} />, to: '/dashboard' }, { label: 'Open Chat', icon: <MessageSquare size={14} />, to: '/chat' }].map(q => (
                  <button key={q.to} onClick={() => navigate(q.to)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-all text-sm">
                    {q.icon} {q.label}
                  </button>
                ))}
              </div>
            </nav>

            <div className="p-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
              <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
                <div className="w-9 h-9 rounded-xl shrink-0 flex items-center justify-center font-bold text-white text-sm"
                  style={{ background: 'linear-gradient(135deg,hsl(35 95% 55%),hsl(35 95% 40%))' }}>
                  {(adminName || 'A').charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-white truncate">{adminName}</div>
                  <div className="text-[10px] text-amber-400 flex items-center gap-1"><Star size={9} fill="currentColor" />Super Admin</div>
                </div>
                <button onClick={() => { logout(); navigate('/login'); }} className="text-slate-600 hover:text-red-400 transition-colors"><LogOut size={15} /></button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ── Main  z:10 ── */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`} style={{ zIndex: 10, position: 'relative' }}>

        {/* Header z:30 */}
        <header className="sticky top-0 flex items-center gap-3 px-6 py-4 border-b"
          style={{ background: 'rgba(6,13,26,0.92)', backdropFilter: 'blur(16px)', borderColor: 'rgba(255,255,255,0.06)', zIndex: 30 }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-slate-500 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/5">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <span className="text-white font-semibold text-sm">{NAV.find(n => n.id === tab)?.label}</span>
          <ChevronRight size={13} className="text-slate-600" />
          <span className="text-slate-500 text-xs">{NAV.find(n => n.id === tab)?.desc}</span>
          <div className="ml-auto flex items-center gap-2">
            <button onClick={() => { fetchStats(); if (tab === 'users') fetchUsers(); if (tab === 'chats') fetchChats(); if (tab === 'logs') fetchLogs(); }}
              className="text-slate-500 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5"><RefreshCw size={14} /></button>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-slate-300 hidden sm:block">{user?.email}</span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6">

          {/* ═══════════ OVERVIEW ═══════════ */}
          {tab === 'overview' && (
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">

              {/* ── Welcome Banner ── */}
              <div className="relative overflow-hidden rounded-2xl p-6 border"
                style={{ background: 'linear-gradient(135deg,rgba(20,184,166,0.13),rgba(6,182,212,0.06),rgba(245,158,11,0.06))', borderColor: 'rgba(20,184,166,0.2)' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-black text-white mb-1">Namaste, {adminName}</h1>
                    <p className="text-slate-400 text-sm">India Travel Pal — Admin Control Center</p>
                    <div className="flex items-center gap-4 mt-3 flex-wrap">
                      <span className="flex items-center gap-1.5 text-xs text-teal-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse inline-block" />System Online
                      </span>
                      <span className="text-slate-700">|</span>
                      <span className="text-xs text-slate-500">{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
                      {lastUpdated && (<><span className="text-slate-700">|</span>
                        <span className="text-xs text-slate-600">Updated {lastUpdated.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span></>)}
                    </div>
                  </div>
                  <Plane size={72} className="hidden sm:block text-white/5 rotate-12" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal-500/30 to-transparent" />
              </div>

              {/* ── Stat Cards ── */}
              {statsLoading && !stats ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[0, 1, 2, 3].map(i => (
                    <div key={i} className="rounded-2xl border p-5 animate-pulse" style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)' }}>
                      <div className="w-11 h-11 rounded-xl bg-white/10 mb-4" />
                      <div className="h-8 w-16 rounded-lg bg-white/10 mb-2" />
                      <div className="h-3 w-24 rounded bg-white/5" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {STAT_CARDS.map((s, i) => (
                    <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                      className="relative overflow-hidden rounded-2xl border p-5"
                      style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)' }}>
                      <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-white mb-4 shadow-lg`}>{s.icon}</div>
                      <div className="text-3xl font-black text-white">{s.value.toLocaleString()}</div>
                      <div className="text-xs font-semibold text-white/80 mt-0.5">{s.label}</div>
                      <div className="text-[10px] text-slate-600 mt-0.5">{s.sub}</div>
                      <div className={`absolute -bottom-5 -right-5 w-20 h-20 rounded-full bg-gradient-to-br ${s.color} opacity-10 blur-xl`} />
                    </motion.div>
                  ))}
                </div>
              )}


              {/* ── Row 3: Recent Travelers + Recent Conversations ── */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                {/* Recent Travelers */}
                <div className="rounded-2xl border p-5" style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.07)' }}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-semibold text-sm flex items-center gap-2">
                      <Users size={13} className="text-blue-400" />Recent Travelers
                    </h3>
                    <button onClick={() => setTab('users')} className="text-[11px] text-teal-400 hover:text-teal-300 flex items-center gap-1 transition-colors">
                      View all<ChevronRight size={11} />
                    </button>
                  </div>
                  {!stats?.recent_users?.length ? (
                    <div className="space-y-3">{[0, 1, 2, 3].map(i => (
                      <div key={i} className="flex items-center gap-3 animate-pulse">
                        <div className="w-8 h-8 rounded-xl bg-white/10 shrink-0" />
                        <div className="flex-1"><div className="h-3 w-24 rounded bg-white/10 mb-1" /><div className="h-2 w-32 rounded bg-white/5" /></div>
                      </div>
                    ))}</div>
                  ) : (
                    <div className="space-y-1.5">
                      {stats.recent_users.map((u, i) => {
                        const name = u.name || u.full_name || u.email.split('@')[0];
                        return (
                          <motion.div key={u.id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                            className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/[0.03] transition-colors">
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-white text-xs shrink-0 ${u.role === 'admin' ? 'bg-gradient-to-br from-amber-500 to-orange-600' : 'bg-gradient-to-br from-teal-600 to-cyan-700'}`}>
                              {name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-semibold text-white truncate">{name}</div>
                              <div className="text-[10px] text-slate-600 truncate">{u.email}</div>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              {u.role === 'admin' && <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-500/15 text-amber-400 font-bold">ADMIN</span>}
                              {u.is_blocked && <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-red-500/15 text-red-400 font-bold">BLOCKED</span>}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Recent Conversations */}
                <div className="rounded-2xl border p-5" style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.07)' }}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-semibold text-sm flex items-center gap-2">
                      <MessageSquare size={13} className="text-teal-400" />Recent Conversations
                    </h3>
                    <button onClick={() => setTab('chats')} className="text-[11px] text-teal-400 hover:text-teal-300 flex items-center gap-1 transition-colors">
                      View all<ChevronRight size={11} />
                    </button>
                  </div>
                  {!stats?.recent_conversations?.length ? (
                    <div className="space-y-3">{[0, 1, 2, 3].map(i => (
                      <div key={i} className="rounded-xl p-3 animate-pulse" style={{ background: 'rgba(255,255,255,0.02)' }}>
                        <div className="h-3 w-32 rounded bg-white/10 mb-2" /><div className="h-2 w-full rounded bg-white/5" />
                      </div>
                    ))}</div>
                  ) : (
                    <div className="space-y-1.5">
                      {stats.recent_conversations.map((c, i) => (
                        <motion.div key={c.id} variants={itemVariants}
                          className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/[0.03] cursor-pointer transition-all hover:scale-[1.02] group"
                          onClick={() => setTab('chats')}>
                          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shrink-0 shadow-lg group-hover:shadow-purple-500/20">
                            <MessageSquare size={12} className="text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-xs font-semibold text-white truncate">{c.title || 'Conversation'}</span>
                              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-teal-500/15 text-teal-400 font-bold shrink-0">{c.message_count} msg</span>
                            </div>
                            {c.preview && <p className="text-[10px] text-slate-500 truncate group-hover:text-slate-400 transition-colors">"{c.preview}"</p>}
                            <p className="text-[9px] text-slate-700 mt-0.5">
                              {c.updated_at ? new Date(c.updated_at).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : ''}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* ═══════════ SaaS ANALYTICS (MULTI-COMPARISON) ═══════════ */}
          {tab === 'analytics' && (
            <motion.div initial="hidden" animate="visible" variants={containerVariants} className="space-y-6">
              {/* Header with Filters */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/[0.02] border border-white/5 p-4 rounded-3xl backdrop-blur-md">
                <motion.div variants={itemVariants}>
                  <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                    <BarChart3 size={20} className="text-blue-500" /> Executive Insights
                  </h2>
                  <p className="text-[11px] text-slate-500 uppercase font-black tracking-widest mt-1">Multi-Comparison Engine V2.0</p>
                </motion.div>
                <div className="flex bg-black/40 p-1 rounded-2xl border border-white/10 overflow-hidden">
                  {(['today', 'week', 'month'] as const).map((p) => (
                    <button key={p} onClick={() => setPeriod(p)}
                      className={`px-5 py-2 rounded-xl text-xs font-bold transition-all relative z-10 ${period === p ? 'text-white' : 'text-slate-500 hover:text-white'}`}>
                      {period === p && (
                        <motion.div layoutId="periodBg" className="absolute inset-0 bg-blue-600 rounded-xl -z-10 shadow-lg shadow-blue-600/20" />
                      )}
                      {p.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {!analytics || loading ? (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-32 rounded-3xl bg-white/[0.02] border border-white/5 animate-pulse" />
                  ))}
                  <div className="md:col-span-3 h-[400px] rounded-3xl bg-white/[0.02] border border-white/5 animate-pulse" />
                  <div className="h-[400px] rounded-3xl bg-white/[0.02] border border-white/5 animate-pulse" />
                </div>
              ) : (
                <>
                  {/* Metric Ribbon */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[
                      { label: 'Total Searches', val: analytics.totals.searches, unit: '', growth: analytics.growth.searches, icon: <Search className="text-blue-400" /> },
                      { label: 'Active Sessions', val: analytics.totals.sessions, unit: '', growth: 0, icon: <Activity className="text-emerald-400" /> },
                      { label: 'Avg Latency', val: analytics.performance.avg_latency, unit: 'ms', growth: -5, icon: <Zap className="text-amber-400" /> },
                      { label: 'Success Rate', val: Math.round((analytics.performance.success / (analytics.performance.total || 1)) * 100), unit: '%', growth: 2, icon: <CheckCircle className="text-teal-400" /> },
                    ].map((m, i) => (
                      <motion.div key={i}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white/[0.03] border border-white/10 p-5 rounded-3xl relative overflow-hidden group hover:border-white/20 transition-all">
                        <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity">
                          {m.icon}
                        </div>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2">{m.label}</p>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-black text-white">
                            <CountUp value={Number(m.val)} />
                            {m.unit}
                          </span>
                          {m.growth !== 0 && (
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-lg font-bold ${m.growth > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                              {m.growth > 0 ? '+' : ''}{m.growth}%
                            </span>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Platform Growth Trend */}
                    <div className="lg:col-span-2 bg-slate-900/50 border border-white/5 rounded-3xl p-6">
                      <div className="flex items-center justify-between mb-8">
                        <div>
                          <h3 className="text-white font-bold flex items-center gap-2">Growth Analytics</h3>
                          <p className="text-[10px] text-slate-500">Platform activity over {period}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full" />
                          <span className="text-[10px] text-slate-400 uppercase font-black">AI Queries</span>
                        </div>
                      </div>
                      <div className="h-[280px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={analytics.trend_data}>
                            <defs>
                              <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                            <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
                            <Tooltip
                              contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '16px', fontSize: '11px' }}
                              labelStyle={{ color: '#94a3b8', fontWeight: 'bold', marginBottom: '4px' }}
                              itemStyle={{ color: '#3b82f6', fontWeight: 'bold' }}
                              formatter={(val: any) => [`${val} Queries`, 'Activity']}
                            />
                            <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorTrend)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Intent distribution */}
                    <div className="bg-slate-900/50 border border-white/5 rounded-3xl p-6">
                      <h3 className="text-white font-bold mb-6">User Intent Segments</h3>
                      <div className="h-[220px] flex items-center justify-center relative">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie data={analytics.categories} innerRadius={60} outerRadius={85} paddingAngle={4} dataKey="value" nameKey="name">
                              {analytics.categories.map((_: any, i: number) => (
                                <Cell key={i} fill={['#3b82f6', '#10b981', '#f59e0b', '#ec4899'][i % 4]} stroke="none" />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute text-center">
                          <p className="text-[10px] text-slate-500 uppercase font-black">Interactions</p>
                          <p className="text-xl font-black text-white">{analytics.totals.searches}</p>
                          <p className="text-[8px] text-slate-600 font-bold uppercase tracking-tighter">Total Signal</p>
                        </div>
                      </div>
                      <div className="mt-4 space-y-2">
                        {analytics.categories.slice(0, 4).map((c: any, i: number) => (
                          <div key={i} className="flex items-center justify-between text-[11px]">
                            <div className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full" style={{ background: ['#3b82f6', '#10b981', '#f59e0b', '#ec4899'][i % 4] }} />
                              <span className="text-slate-400 font-medium truncate max-w-[120px]">{c.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-white font-bold">{c.value}</span>
                              <span className="text-[9px] text-slate-600">({c.percentage}%)</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 🌍 DESTINATION COMPARISON ENGINE */}
                  <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-8">
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <h3 className="text-xl font-bold text-white flex items-center gap-3"><Globe size={22} className="text-rose-500" /> Destination Market Comparison</h3>
                        <p className="text-[11px] text-slate-500 uppercase font-bold tracking-widest mt-1">Cross-Metric Analysis of Top 5 Hubs</p>
                      </div>
                      <span className="px-3 py-1 bg-rose-500/10 text-rose-500 rounded-full text-[10px] font-black uppercase tracking-tighter">Live Ranking</span>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                      {/* Comparison Bar */}
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={analytics.dest_comparison} layout="vertical" margin={{ left: 20 }}>
                            <XAxis type="number" hide />
                            <YAxis dataKey="name" type="category" width={80} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 'bold' }} />
                            <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '12px' }} />
                            <Bar dataKey="value" fill="#f43f5e" radius={[0, 6, 6, 0]} barSize={20} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Comparison Table */}
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-[11px]">
                          <thead className="text-slate-500 font-black uppercase tracking-widest border-b border-white/5">
                            <tr>
                              <th className="pb-3 px-2">Place Name</th>
                              <th className="pb-3 px-2 text-center">Searches</th>
                              <th className="pb-3 px-2 text-center">Budget Pref</th>
                              <th className="pb-3 px-2 text-center">Primary Mode</th>
                            </tr>
                          </thead>
                          <tbody className="text-slate-300">
                            {analytics.dest_comparison.map((d: any, i: number) => (
                              <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                <td className="py-4 px-2 font-bold text-white">{d.name}</td>
                                <td className="py-4 px-2 text-center">
                                  <span className="bg-slate-800 px-2 py-1 rounded-lg text-white font-mono">{d.value}</span>
                                </td>
                                <td className="py-4 px-2 text-center">
                                  <div className="flex justify-center gap-1">
                                    {d.budgets.Lux > d.budgets.Low ? <span className="text-amber-500 px-1 border border-amber-500/20 rounded">Luxury</span> : <span className="text-teal-400 px-1 border border-teal-500/20 rounded">Economy</span>}
                                  </div>
                                </td>
                                <td className="py-4 px-2 text-center">
                                  <div className="flex items-center justify-center gap-1 text-[10px] text-slate-500">
                                    {d.modes.Flight > d.modes.Train ? <Plane size={10} /> : <Train size={10} />}
                                    {d.modes.Flight > d.modes.Train ? 'Flight' : 'Train'}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* User Segment 1 */}
                    <div className="bg-white/[0.03] border border-white/10 p-6 rounded-3xl">
                      <h4 className="text-[10px] text-slate-500 font-black uppercase mb-4 tracking-widest">Growth Dynamics</h4>
                      <div className="h-[140px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie data={analytics.user_segments.new_vs_returning} innerRadius={40} outerRadius={55} dataKey="value">
                              <Cell fill="#3b82f6" />
                              <Cell fill="#1e293b" stroke="rgba(255,255,255,0.1)" />
                            </Pie>
                            <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '12px', fontSize: '11px' }} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="flex justify-between text-[11px] mt-2">
                        <span className="text-blue-400 font-bold">New Users</span>
                        <span className="text-slate-500">vs Returning</span>
                      </div>
                    </div>

                    {/* User Segment 2 */}
                    <div className="bg-white/[0.03] border border-white/10 p-6 rounded-3xl">
                      <h4 className="text-[10px] text-slate-500 font-black uppercase mb-4 tracking-widest">Spending Profile</h4>
                      <div className="space-y-3">
                        {analytics.user_segments.budget_dist.map((b: any, i: number) => (
                          <div key={i}>
                            <div className="flex justify-between text-[10px] mb-1">
                              <span className="text-slate-400 font-bold uppercase">{b.name}</span>
                              <span className="text-white font-bold">{b.value} <span className="text-slate-600 text-[9px]">Requests</span></span>
                            </div>
                            <div className="h-1 w-full bg-white/5 rounded-full">
                              <div className="h-full bg-amber-500 rounded-full" style={{ width: `${(b.value / Math.max(...analytics.user_segments.budget_dist.map((x: any) => x.value))) * 100}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Mode Share */}
                    <div className="bg-white/[0.03] border border-white/10 p-6 rounded-3xl">
                      <h4 className="text-[10px] text-slate-500 font-black uppercase mb-4 tracking-widest">Logistics Mix</h4>
                      <div className="space-y-3">
                        {analytics.travel_modes.map((m: any, i: number) => (
                          <div key={i} className="flex items-center gap-3">
                            <div className="w-8 text-[10px] font-bold text-slate-500">{m.value}</div>
                            <div className="flex-1 h-3 bg-white/5 rounded-md overflow-hidden flex">
                              <div className="h-full bg-teal-500" style={{ width: `${(m.value / analytics.totals.searches) * 100}%` }} />
                            </div>
                            <div className="text-[9px] text-slate-300 font-black uppercase">{m.name}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Quality Metric */}
                    <div className="bg-white/[0.03] border border-white/10 p-6 rounded-3xl flex flex-col items-center justify-center text-center">
                      <p className="text-[10px] text-slate-500 font-black uppercase mb-4 tracking-widest">Operational Health</p>
                      <div className="relative flex items-center justify-center">
                        <svg className="w-20 h-20">
                          <circle className="text-slate-800" strokeWidth="6" stroke="currentColor" fill="transparent" r="32" cx="40" cy="40" />
                          <circle className="text-emerald-500" strokeWidth="6" strokeDasharray={200} strokeDashoffset={200 - (analytics.performance.success / (analytics.performance.total || 1)) * 200} strokeLinecap="round" stroke="currentColor" fill="transparent" r="32" cx="40" cy="40" />
                        </svg>
                        <span className="absolute text-sm font-black text-white">{Math.round((analytics.performance.success / (analytics.performance.total || 1)) * 100)}%</span>
                      </div>
                      <div className="flex flex-col gap-1 mt-4">
                        <p className="text-[10px] text-emerald-500 font-bold uppercase">Efficiency: {Math.round((analytics.performance.success / (analytics.performance.total || 1)) * 100)}%</p>
                        <p className="text-[10px] text-rose-500 font-bold uppercase">Error Rate: {analytics.performance.error_rate}%</p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          )}


          {/* ═══════════ USERS ═══════════ */}
          {tab === 'users' && (
            <motion.div initial="hidden" animate="visible" variants={containerVariants} className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <motion.div variants={itemVariants}>
                  <h2 className="text-xl font-bold text-white">Travelers</h2>
                  <p className="text-sm text-slate-500">{filteredUsers.length} registered users</p>
                </motion.div>
                <motion.div variants={itemVariants} className="relative">
                  <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input value={userSearch} onChange={e => setUserSearch(e.target.value)} placeholder="Search traveler..."
                    className="bg-white/5 border border-white/10 rounded-xl pl-8 pr-4 py-2 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-teal-500 w-60" />
                </motion.div>
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-500 gap-4">
                  <div className="w-10 h-10 border-2 border-teal-500/20 border-t-teal-500 rounded-full animate-spin" />
                  <p className="text-xs font-black uppercase tracking-widest opacity-40">Loading Database...</p>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="text-center py-20 text-slate-500"><Users size={40} className="mx-auto mb-3 opacity-20" /><p className="text-sm">No users found</p></div>
              ) : (
                <motion.div variants={itemVariants} className="rounded-2xl border overflow-hidden" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
                  <div className="grid grid-cols-12 px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-600"
                    style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div className="col-span-5">Traveler</div>
                    <div className="col-span-2 hidden md:block">Role</div>
                    <div className="col-span-2 hidden lg:block">Joined</div>
                    <div className="col-span-3">Actions</div>
                  </div>
                  <div className="divide-y divide-white/5">
                    {filteredUsers.map((u) => {
                      const name = u.name || u.full_name || u.email.split('@')[0];
                      return (
                        <div key={u.id} className="grid grid-cols-12 px-5 py-4 items-center transition-colors hover:bg-white/[0.02]">
                          <div className="col-span-5 flex items-center gap-3 min-w-0">
                            <div className={`w-9 h-9 shrink-0 rounded-xl flex items-center justify-center font-bold text-white text-sm ${u.role === 'admin' ? 'bg-gradient-to-br from-amber-500 to-orange-600' : 'bg-gradient-to-br from-teal-600 to-cyan-700'}`}>
                              {name.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <div className="text-sm font-medium text-white truncate">{name}</div>
                              <div className="text-[11px] text-slate-500 truncate">{u.email}</div>
                            </div>
                          </div>
                          <div className="col-span-2 hidden md:flex items-center gap-1.5">
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${u.role === 'admin' ? 'bg-amber-500/15 text-amber-400' : 'bg-slate-700/80 text-slate-400'}`}>{u.role}</span>
                            {u.is_blocked && <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-red-500/15 text-red-400 font-bold">BLOCKED</span>}
                          </div>
                          <div className="col-span-2 hidden lg:block text-[11px] text-slate-500">{fmtD(u.created_at)}</div>
                          <div className="col-span-3 flex items-center gap-2">
                            {u.role !== 'admin' ? (
                              <>
                                <button onClick={() => toggleBlock(u.id, !!u.is_blocked)} disabled={actionLoading === u.id}
                                  className={`flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-lg font-semibold transition-all hover:scale-105 active:scale-95 border ${u.is_blocked ? 'bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 border-emerald-500/20' : 'bg-amber-500/15 text-amber-400 hover:bg-amber-500/25 border-amber-500/20'}`}>
                                  {u.is_blocked ? <><CheckCircle size={11} />Unblock</> : <><Ban size={11} />Block</>}
                                </button>
                                <button onClick={() => deleteUser(u.id)} disabled={actionLoading === u.id}
                                  className="flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-lg font-semibold bg-red-500/15 text-red-400 hover:bg-red-500/25 border border-red-500/20 transition-all hover:scale-105 active:scale-95">
                                  <Trash2 size={11} />Delete
                                </button>
                              </>
                            ) : (
                              <span className="text-[10px] text-amber-400/60 flex items-center gap-1"><ShieldCheck size={11} />Protected</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}




          {/* ═══════════ CHAT HISTORY ═══════════ */}
          {tab === 'chats' && (
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div>
                <h2 className="text-xl font-bold text-white">Chat History</h2>
                <p className="text-sm text-slate-500">{chats.length + convs.length} conversation sessions</p>
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-500 gap-4">
                  <div className="w-10 h-10 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
                  <p className="text-xs font-black uppercase tracking-widest opacity-40">Scanning Convos...</p>
                </div>
              ) : chats.length === 0 && convs.length === 0 ? (
                <div className="text-center py-20 text-slate-500">
                  <MessageSquare size={48} className="mx-auto mb-3 opacity-20" />
                  <p className="text-sm font-medium">No conversations yet</p>
                  <p className="text-xs mt-1 text-slate-600">Chats are saved when users send messages to the AI</p>
                </div>
              ) : (
                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-2.5">

                  {/* ── chat_history sessions ── */}
                  {chats.map((chat, i) => {
                    const key = `ch-${chat.user_id}-${chat.session_id}`;
                    const isExp = expandedChat === key;
                    const msgCount = chat.messages?.length || 0;
                    // Lookup user
                    const owner = users.find(u => u.id === chat.user_id);
                    const ownerName = owner?.full_name || owner?.name || owner?.email?.split('@')[0] || 'Unknown';
                    const ownerEmail = owner?.email || '';
                    const initials = ownerName.charAt(0).toUpperCase();
                    // Last message preview
                    const lastMsg = chat.messages?.[chat.messages.length - 1];
                    let preview = '';
                    if (lastMsg) {
                      const raw = lastMsg.user_message || lastMsg.content || lastMsg.bot_reply;
                      if (typeof raw === 'string') {
                        if (raw.startsWith('{')) {
                          try { const p = JSON.parse(raw); preview = p.reply || p.message || raw; } catch { preview = raw; }
                        } else { preview = raw; }
                      }
                    }

                    return (
                      <motion.div key={key} variants={itemVariants}
                        className="rounded-2xl border overflow-hidden transition-all hover:scale-[1.01] hover:shadow-lg group"
                        style={{ borderColor: isExp ? 'rgba(20,184,166,0.35)' : 'rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>

                        {/* Row header */}
                        <button className="w-full flex items-center gap-3 px-5 py-4 hover:bg-white/[0.025] transition-colors text-left"
                          onClick={() => setExpandedChat(isExp ? null : key)}>

                          {/* User avatar */}
                          <div className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center font-bold text-white text-sm shadow-lg">
                            {initials}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-white">{ownerName}</span>
                              {ownerEmail && <span className="text-[10px] text-slate-500 hidden sm:block">{ownerEmail}</span>}
                              <span className="ml-auto text-[10px] text-teal-500 shrink-0">{msgCount} msg{msgCount !== 1 ? 's' : ''}</span>
                            </div>
                            <div className="flex items-center gap-3 mt-0.5">
                              {preview ? (
                                <p className="text-[11px] text-slate-500 truncate flex-1 font-medium">"{preview.slice(0, 70)}{preview.length > 70 ? '...' : ''}"</p>
                              ) : (
                                <p className="text-[11px] text-slate-700 italic flex-1">Messages</p>
                              )}
                              <span className="text-[10px] text-slate-600 shrink-0"><Clock size={9} className="inline mr-0.5" />{fmt(chat.updated_at)}</span>
                            </div>
                          </div>

                          {/* Expand arrow */}
                          <motion.div animate={{ rotate: isExp ? 180 : 0 }} transition={{ duration: 0.2 }} className="shrink-0">
                            <ChevronDown size={14} className="text-slate-600" />
                          </motion.div>
                        </button>

                        {/* Expanded messages */}
                        <AnimatePresence>
                          {isExp && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                              className="border-t overflow-hidden" style={{ borderColor: 'rgba(20,184,166,0.12)' }}>
                              <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
                                {(chat.messages || []).map((msg, mi) => {
                                  const isUser = msg.role === 'user' || (msg.user_message && !msg.bot_reply);
                                  const initials = ownerName.charAt(0).toUpperCase();

                                  return (
                                    <div key={mi} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                                      <div className={`rounded-2xl px-3 py-2.5 max-w-[80%] border ${isUser 
                                        ? 'bg-violet-600/12 border-violet-500/15 rounded-tr-none' 
                                        : 'bg-teal-600/8 border-teal-500/12 rounded-tl-none'
                                      }`}>
                                        <div className="flex items-center gap-1.5 mb-1">
                                          {isUser ? (
                                            <>
                                              <div className="w-4 h-4 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-[8px] font-bold text-white shrink-0">{initials}</div>
                                              <span className="text-[10px] text-violet-400 font-semibold">{ownerName}</span>
                                            </>
                                          ) : (
                                            <>
                                              <div className="w-4 h-4 rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center shrink-0"><Bot size={8} className="text-white" /></div>
                                              <span className="text-[10px] text-teal-400 font-semibold">AI Travel Guide</span>
                                            </>
                                          )}
                                          <span className="text-[9px] text-slate-700 ml-auto">{msg.timestamp ? fmt(msg.timestamp) : ''}</span>
                                        </div>
                                        
                                        <div className="text-xs leading-relaxed" style={{ color: isUser ? '#e2e8f0' : '#94a3b8' }}>
                                          {(() => {
                                            const raw = isUser ? (msg.user_message || msg.content) : (msg.bot_reply || msg.content);
                                            if (!raw) return '[No content]';
                                            if (typeof raw === 'string') {
                                              if (raw.trim().startsWith('{')) {
                                                try {
                                                  const p = JSON.parse(raw);
                                                  return p.reply || p.message || p.text || raw;
                                                } catch { return raw; }
                                              }
                                              return raw.slice(0, 400) + (raw.length > 400 ? '…' : '');
                                            }
                                            if (typeof raw === 'object' && raw !== null) {
                                              return (raw as any).reply || (raw as any).message || (raw as any).text || JSON.stringify(raw).slice(0, 100);
                                            }
                                            return '[No message content]';
                                          })()}
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}

                  {/* ── conversations collection ── */}
                  {convs.map((conv, i) => {
                    const owner = users.find(u => u.id === conv.user_id);
                    const ownerName = owner?.full_name || owner?.name || owner?.email?.split('@')[0] || 'Traveler';
                    const ownerEmail = owner?.email || '';
                    const initials = ownerName.charAt(0).toUpperCase();
                    const key = `conv-${conv.id}`;
                    const isExp = expandedChat === key;
                    const msgs = conv.messages || [];
                    const msgCount = conv.message_count ?? msgs.length;
                    // Last user message as preview
                    const lastUserMsg = [...msgs].reverse().find(m => m.role === 'user');
                    const preview = lastUserMsg?.content || conv.title || '';

                    return (
                      <motion.div key={key} variants={itemVariants}
                        className="rounded-2xl border overflow-hidden transition-all hover:scale-[1.01] hover:shadow-lg group"
                        style={{ borderColor: isExp ? 'rgba(139,92,246,0.35)' : 'rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>

                        <button className="w-full flex items-center gap-3 px-5 py-4 hover:bg-white/[0.025] transition-colors text-left"
                          onClick={() => setExpandedChat(isExp ? null : key)}>
                          <div className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center font-bold text-white text-sm shadow-lg">
                            {initials}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-white">{ownerName}</span>
                              {ownerEmail && <span className="text-[10px] text-slate-500 hidden sm:block">{ownerEmail}</span>}
                              <span className="ml-auto text-[10px] text-purple-400 shrink-0">{msgCount} msg{msgCount !== 1 ? 's' : ''}</span>
                            </div>
                            <div className="flex items-center gap-3 mt-0.5">
                              {preview ? (
                                <p className="text-[11px] text-slate-400 truncate flex-1 font-medium">{conv.title || 'Conversation'} — <span className="text-slate-500 font-normal">"{preview.slice(0, 50)}{preview.length > 50 ? '...' : ''}"</span></p>
                              ) : (
                                <p className="text-[11px] text-slate-400 truncate flex-1 font-medium">{conv.title || 'Conversation'}</p>
                              )}
                              <span className="text-[10px] text-slate-600 shrink-0"><Clock size={9} className="inline mr-0.5" />{fmt(conv.updated_at)}</span>
                            </div>
                          </div>
                          <motion.div animate={{ rotate: isExp ? 180 : 0 }} transition={{ duration: 0.2 }} className="shrink-0">
                            <ChevronDown size={14} className="text-slate-600" />
                          </motion.div>
                        </button>

                        {/* Expanded messages */}
                        <AnimatePresence>
                          {isExp && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                              className="border-t overflow-hidden" style={{ borderColor: 'rgba(139,92,246,0.12)' }}>
                              <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
                                {msgs.length === 0 ? (
                                  <p className="text-xs text-center text-slate-600 py-4">No messages stored for this conversation</p>
                                ) : (
                                  msgs.map((msg, mi) => (
                                    <div key={mi}
                                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                      <div className={`rounded-2xl px-3 py-2.5 max-w-[80%] border ${msg.role === 'user'
                                        ? 'bg-violet-600/12 border-violet-500/15 rounded-tr-none'
                                        : 'bg-teal-600/8 border-teal-500/12 rounded-tl-none'
                                        }`}>
                                        <div className="flex items-center gap-1.5 mb-1">
                                          {msg.role === 'user' ? (
                                            <>
                                              <div className="w-4 h-4 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-[8px] font-bold text-white shrink-0">{initials}</div>
                                              <span className="text-[10px] text-violet-400 font-semibold">{ownerName}</span>
                                            </>
                                          ) : (
                                            <>
                                              <div className="w-4 h-4 rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center shrink-0"><Bot size={8} className="text-white" /></div>
                                              <span className="text-[10px] text-teal-400 font-semibold">AI Travel Guide</span>
                                            </>
                                          )}
                                          <span className="text-[9px] text-slate-700 ml-auto">{fmt(msg.timestamp)}</span>
                                        </div>
                                        <div className="text-xs leading-relaxed" style={{ color: msg.role === 'user' ? '#e2e8f0' : '#94a3b8' }}>
                                          {(() => {
                                            const raw = msg.content;
                                            if (typeof raw === 'string') {
                                              if (raw.trim().startsWith('{')) {
                                                try {
                                                  const p = JSON.parse(raw);
                                                  return p.reply || p.message || p.text || raw;
                                                } catch { return raw; }
                                              }
                                              return raw.slice(0, 400) + (raw.length > 400 ? '…' : '');
                                            }
                                            if (typeof raw === 'object' && raw !== null) {
                                              return (raw as any).reply || (raw as any).message || (raw as any).text || '[Complex data]';
                                            }
                                            return '[No content]';
                                          })()}
                                        </div>
                                      </div>
                                    </div>
                                  ))
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </motion.div>
          )}

          {/* ═══════════ LOGS ═══════════ */}
          {tab === 'logs' && (
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h2 className="text-xl font-bold text-white">Activity Logs</h2>
                  <p className="text-sm text-slate-500">{logs.length} admin actions recorded</p>
                </div>
                {logs.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {([
                      { label: 'Destinations', color: 'text-teal-400', bg: 'rgba(20,184,166,0.1)', count: logs.filter(l => (l.action || '').toUpperCase().includes('DESTINATION') || (l.action || '').toUpperCase().includes('KNOWLEDGE')).length },
                      { label: 'User Actions', color: 'text-amber-400', bg: 'rgba(245,158,11,0.1)', count: logs.filter(l => (l.action || '').toUpperCase().includes('USER') || (l.action || '').toUpperCase().includes('BLOCK') || (l.action || '').toUpperCase().includes('ROLE')).length },
                      { label: 'System', color: 'text-indigo-400', bg: 'rgba(99,102,241,0.1)', count: logs.filter(l => (l.action || '').toUpperCase().includes('SYSTEM') || (l.action || '').toUpperCase().includes('CONFIG') || (l.action || '').toUpperCase().includes('BACKUP') || (l.action || '').toUpperCase().includes('CACHE')).length },
                      { label: 'Logins', color: 'text-purple-400', bg: 'rgba(168,85,247,0.1)', count: logs.filter(l => (l.action || '').toUpperCase().includes('LOGIN')).length },
                    ] as const).map(s => s.count > 0 ? (
                      <span key={s.label} className={`text-[11px] font-semibold px-2.5 py-1 rounded-xl ${s.color}`} style={{ background: s.bg }}>
                        {s.label}: {s.count}
                      </span>
                    ) : null)}
                  </div>
                )}
              </div>
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-500 gap-4">
                  <div className="w-8 h-8 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Retrieving Logs...</p>
                </div>
              ) : logs.length === 0 ? (
                <div className="text-center py-20 text-slate-500">
                  <Activity size={48} className="mx-auto mb-3 opacity-20" />
                  <p className="text-sm font-medium">No activity logs yet</p>
                  <p className="text-xs mt-1 text-slate-600">Admin actions generate logs automatically</p>
                </div>
              ) : (
                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="rounded-2xl border overflow-hidden" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
                  {logs.map((log, i) => {
                    const a = (log.action || '').toUpperCase();
                    const cfg =
                      a.includes('DELETE') ? { bg: 'rgba(239,68,68,0.1)', text: 'text-red-400', bd: 'rgba(239,68,68,0.2)', icon: <Trash2 size={13} /> }
                        : a.includes('UNBLOCK') ? { bg: 'rgba(16,185,129,0.1)', text: 'text-emerald-400', bd: 'rgba(16,185,129,0.2)', icon: <CheckCircle size={13} /> }
                          : a.includes('BLOCK') ? { bg: 'rgba(245,158,11,0.1)', text: 'text-amber-400', bd: 'rgba(245,158,11,0.2)', icon: <Ban size={13} /> }
                            : a.includes('ADD') ? { bg: 'rgba(20,184,166,0.1)', text: 'text-teal-400', bd: 'rgba(20,184,166,0.2)', icon: <MapPin size={13} /> }
                              : a.includes('UPDATE') ? { bg: 'rgba(20,184,166,0.08)', text: 'text-teal-300', bd: 'rgba(20,184,166,0.15)', icon: <RefreshCw size={13} /> }
                                : a.includes('LOGIN') ? { bg: 'rgba(168,85,247,0.1)', text: 'text-purple-400', bd: 'rgba(168,85,247,0.2)', icon: <UserIcon size={13} /> }
                                  : a.includes('SYSTEM') || a.includes('CONFIG') ? { bg: 'rgba(99,102,241,0.1)', text: 'text-indigo-400', bd: 'rgba(99,102,241,0.2)', icon: <Activity size={13} /> }
                                    : a.includes('BACKUP') || a.includes('EXPORT') ? { bg: 'rgba(6,182,212,0.1)', text: 'text-cyan-400', bd: 'rgba(6,182,212,0.2)', icon: <Star size={13} /> }
                                      : a.includes('ROLE') ? { bg: 'rgba(251,146,60,0.1)', text: 'text-orange-400', bd: 'rgba(251,146,60,0.2)', icon: <Users size={13} /> }
                                        : { bg: 'rgba(99,102,241,0.08)', text: 'text-slate-400', bd: 'rgba(99,102,241,0.1)', icon: <Activity size={13} /> };
                    return (
                      <motion.div key={log.id || i} variants={itemVariants}
                        className="flex items-start gap-4 p-4 hover:bg-white/[0.04] transition-all group"
                        style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <div className={`w-9 h-9 shrink-0 rounded-xl flex items-center justify-center mt-0.5 ${cfg.text}`}
                          style={{ background: cfg.bg, border: `1px solid ${cfg.bd}` }}>{cfg.icon}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-xs font-bold ${cfg.text} uppercase tracking-wider`}>{(log.action || '').replace(/_/g, ' ')}</span>
                            {log.target && <span className="text-[10px] font-medium bg-white/5 text-slate-400 px-2 py-0.5 rounded-lg border border-white/5">{log.target}</span>}
                          </div>
                          {log.details && <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{log.details}</p>}
                          <p className="text-[10px] text-slate-600 mt-1"><Clock size={8} className="inline mr-1" />{fmt(log.created_at)}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </motion.div>
          )}

        </main>
      </div>
    </div>
  );
};

export default AdminPanel;
