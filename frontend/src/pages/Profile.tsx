import React, { useState, useEffect } from 'react';
import { config } from '@/config';
import { useAuth } from '@/context/AuthContext';
import { motion, animate } from 'framer-motion';
import { 
  ArrowLeft, 
  Settings, 
  MessageSquare, 
  Compass, 
  Search, 
  Copy, 
  Check,
  Edit,
  Plus,
  Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

// ── Animated Number Component ──
const AnimatedNumber = ({ value }: { value: number }) => {
    const [display, setDisplay] = useState(0);

    useEffect(() => {
        const controls = animate(0, value, {
            duration: 1.5,
            ease: "easeOut",
            onUpdate: (latest) => setDisplay(Math.round(latest))
        });
        return () => controls.stop();
    }, [value]);

    return <span>{display}</span>;
}

const Profile = () => {
    const { user, token } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();
    const { t } = useTranslation();
    const [copied, setCopied] = useState(false);
    const [statsData, setStatsData] = useState({ totalSearches: 0, tripsPlanned: 0 });
    const [isLoading, setIsLoading] = useState(true);

    // ── Fetch dynamic stats ──
    useEffect(() => {
        const fetchStats = async () => {
            if (!user?.id || !token) return;
            setIsLoading(true);
            try {
                const res = await fetch(`${config.apiBase}/auth/user-stats/${user.id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setStatsData({
                        totalSearches: data.totalSearches || 0,
                        tripsPlanned: data.tripsPlanned || 0
                    });
                }
            } catch (err) {
                console.error("Failed to fetch profile stats:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStats();
    }, [user?.id, token]);

    const shortId = user?.id ? `#ITP-${user.id.slice(-6).toUpperCase()}` : '#ITP-0000';

    const copyId = () => {
        if (user?.id) {
            navigator.clipboard.writeText(user.id);
            setCopied(true);
            toast({
                title: t('common.success'),
                description: "Full account ID copied to clipboard.",
            });
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const stats = [
        { 
            label: t('profile.trips_planned'), 
            value: statsData.tripsPlanned, 
            icon: <Compass className="text-blue-400" size={20} />,
            color: 'bg-blue-500/10 border-blue-500/20'
        },
        { 
            label: t('profile.total_searches'), 
            value: statsData.totalSearches, 
            icon: <Search className="text-emerald-400" size={20} />,
            color: 'bg-emerald-500/10 border-emerald-500/20'
        }
    ];

    const actions = [
        { label: t('profile.edit_profile'), icon: <Edit size={18} />, path: '/edit-profile' },
        { label: t('profile.chat_history'), icon: <MessageSquare size={18} />, path: '/chat' },
        { label: t('profile.start_new_trip'), icon: <Plus size={18} />, path: '/chat', primary: true },
    ];

    return (
        <div className="min-h-[100dvh] bg-[#020617] relative overflow-hidden font-sans text-slate-200">
            {/* Background Aesthetics */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/5 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/5 blur-[120px]" />
            </div>

            <div className="relative z-10 max-w-2xl mx-auto px-4 py-8 sm:py-12">
                {/* Header Navigation */}
                <div className="flex items-center justify-start mb-8">
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => navigate(-1)}
                        className="text-slate-400 hover:text-white hover:bg-white/5 rounded-xl gap-2 transition-all"
                    >
                        <ArrowLeft size={18} />
                        {t('profile.back_to_home')}
                    </Button>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-6"
                >
                    {/* Simplified Profile Header */}
                    <div className="bg-[#0f172a]/40 backdrop-blur-xl border border-white/5 rounded-[28px] p-6 sm:p-8">
                        <div className="flex flex-col sm:flex-row items-center gap-6">
                            <div className="relative">
                                <div className="absolute -inset-1 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full opacity-20 blur-sm" />
                                <div className="relative w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center text-3xl font-bold text-white border border-white/10 shadow-xl">
                                    {(user?.full_name || 'U').charAt(0).toUpperCase()}
                                    <div className="absolute bottom-0 right-0 w-5 h-5 bg-emerald-500 border-4 border-[#121b2c] rounded-full" />
                                </div>
                            </div>

                            <div className="text-center sm:text-left flex-1">
                                <h1 className="text-2xl font-bold text-white tracking-tight mb-1">
                                    {user?.full_name || 'Traveler'}
                                </h1>
                                <p className="text-slate-400 text-sm mb-4">{user?.email}</p>
                                
                                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                                    <div 
                                        onClick={copyId}
                                        className="flex items-center gap-2 px-3 py-1 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
                                    >
                                        <span className="text-[10px] font-mono text-slate-500 font-bold uppercase">{shortId}</span>
                                        {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} className="text-slate-600" />}
                                    </div>
                                    <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                                        <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">{t('profile.account_active')}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Summary with count-up animation */}
                    <div className="grid grid-cols-2 gap-4">
                        {stats.map((s, i) => (
                            <motion.div 
                                key={i}
                                whileHover={{ y: -4 }}
                                className={cn("p-5 rounded-[24px] border backdrop-blur-md transition-all duration-300 min-h-[140px] flex flex-col justify-between", s.color)}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="p-2 w-fit rounded-lg bg-black/20">{s.icon}</div>
                                    {isLoading && <Loader2 size={12} className="text-slate-600 animate-spin" />}
                                </div>
                                <div>
                                    <p className="text-3xl font-black text-white tracking-tighter">
                                        {isLoading ? "---" : <AnimatedNumber value={s.value} />}
                                    </p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">{s.label}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Simple Action Grid */}
                    <div className="space-y-3">
                        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-2">{t('settings.features')}</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {actions.map((act, i) => (
                                <Button
                                    key={i}
                                    variant="outline"
                                    onClick={() => navigate(act.path)}
                                    className={cn(
                                        "h-14 rounded-2xl border-white/5 transition-all text-sm font-semibold justify-start gap-4 px-5",
                                        act.primary 
                                            ? "bg-blue-600 hover:bg-blue-500 text-white border-none shadow-lg shadow-blue-900/20" 
                                            : "bg-white/5 hover:bg-white/10 text-slate-300"
                                    )}
                                >
                                    <span className={cn(
                                        "p-1.5 rounded-lg",
                                        act.primary ? "bg-white/20" : "bg-white/5"
                                    )}>
                                        {act.icon}
                                    </span>
                                    {act.label}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Go to Settings Link */}
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="pt-6 text-center space-y-4">
                        <div 
                             onClick={() => navigate('/settings')}
                             className="text-xs font-bold text-slate-500 hover:text-blue-400 cursor-pointer transition-colors inline-flex items-center gap-2 group"
                        >
                            <Settings size={14} className="group-hover:rotate-45 transition-transform" />
                            {t('profile.go_to_settings')}
                        </div>
                    </motion.div>
                </motion.div>
                
                {/* Minimal Footer */}
                <p className="text-center text-[10px] text-slate-700 font-medium uppercase tracking-widest mt-12 pb-8">
                    India Travel Pal · v2.4.1
                </p>
            </div>
        </div>
    );
};

export default Profile;
