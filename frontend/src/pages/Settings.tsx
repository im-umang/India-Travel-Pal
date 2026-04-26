import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  Languages, 
  Mic, 
  Bell, 
  Trash2, 
  Check, 
  Volume2, 
  VolumeX,
  Globe
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const Settings = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const { t, i18n } = useTranslation();
    
    // Setting states
    const [lang, setLang] = useState(i18n.language === 'hi' ? 'Hindi' : 'English');
    const [voiceOn, setVoiceOn] = useState(true);
    const [notifsOn, setNotifsOn] = useState(true);

    const handleLangChange = (l: string) => {
        setLang(l);
        const code = l === 'Hindi' ? 'hi' : 'en';
        i18n.changeLanguage(code);
        toast({
            title: t('common.success'),
            description: t('settings.language'),
        });
    };

    const handleClearHistory = () => {
        toast({
            title: t('settings.clear_history'),
            description: t('common.success'),
            variant: "destructive"
        });
    };

    return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 overflow-hidden relative">
            {/* Background Orbs */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-blue-600/5 blur-[100px] rounded-full" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-600/5 blur-[100px] rounded-full" />

            <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className="w-full max-w-lg relative z-10"
            >
                <Card className="bg-slate-900/80 backdrop-blur-2xl border-white/5 text-slate-100 shadow-2xl rounded-[32px] overflow-hidden">
                    <CardHeader className="flex flex-row items-center gap-4 border-b border-white/5 p-6 sm:p-8">
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => navigate(-1)} 
                            className="text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                        >
                            <ArrowLeft size={20} />
                        </Button>
                        <CardTitle className="text-2xl font-black tracking-tight">{t('settings.title')}</CardTitle>
                    </CardHeader>
                    
                    <CardContent className="p-6 sm:p-8 space-y-8">
                        {/* ── Language Selection ── */}
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                                <Globe size={12} /> {t('settings.language')}
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                {['English', 'Hindi'].map((l) => (
                                    <button
                                        key={l}
                                        onClick={() => handleLangChange(l)}
                                        className={`flex items-center justify-between px-4 py-3 rounded-2xl border transition-all duration-300 font-bold text-sm ${
                                            lang === l 
                                            ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/20' 
                                            : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'
                                        }`}
                                    >
                                        {l}
                                        {lang === l && <Check size={14} />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* ── Interactive Toggles ── */}
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 h-3 block">{t('settings.features')}</label>
                            
                            <div className="space-y-3">
                                {/* Voice Input Toggle */}
                                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all group">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2 rounded-xl transition-colors ${voiceOn ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-600'}`}>
                                            {voiceOn ? <Volume2 size={20} /> : <VolumeX size={20} />}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-200">{t('settings.voice')}</p>
                                            <p className="text-[10px] text-slate-500">{t('settings.voice_desc')}</p>
                                        </div>
                                    </div>
                                    <Switch checked={voiceOn} onCheckedChange={setVoiceOn} className="data-[state=checked]:bg-emerald-500" />
                                </div>

                                {/* Notifications Toggle */}
                                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all group">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2 rounded-xl transition-colors ${notifsOn ? 'bg-blue-500/10 text-blue-400' : 'bg-slate-800 text-slate-600'}`}>
                                            <Bell size={20} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-200">{t('settings.updates')}</p>
                                            <p className="text-[10px] text-slate-500">{t('settings.updates_desc')}</p>
                                        </div>
                                    </div>
                                    <Switch checked={notifsOn} onCheckedChange={setNotifsOn} className="data-[state=checked]:bg-blue-500" />
                                </div>
                            </div>
                        </div>

                        {/* ── Danger Zone ── */}
                        <div className="pt-4 border-t border-white/5 space-y-4">
                             <label className="text-[10px] font-black text-rose-500/80 uppercase tracking-widest ml-1 block">{t('settings.account')}</label>
                             <Button 
                                variant="ghost" 
                                onClick={handleClearHistory}
                                className="w-full h-14 rounded-2xl bg-rose-500/5 hover:bg-rose-500/10 text-rose-400 hover:text-rose-300 border border-rose-500/10 border-dashed gap-3 justify-start px-6 group"
                             >
                                <div className="p-2 rounded-lg bg-rose-500/10 group-hover:scale-110 transition-transform">
                                    <Trash2 size={18} />
                                </div>
                                <span className="text-sm font-bold">{t('settings.clear_history')}</span>
                             </Button>
                        </div>
                    </CardContent>
                </Card>
                <p className="text-center text-[10px] text-slate-600 font-bold uppercase tracking-widest mt-8">
                    {t('settings.version')} 2.4.1 (Stable Build)
                </p>
            </motion.div>
        </div>
    );
};

export default Settings;
