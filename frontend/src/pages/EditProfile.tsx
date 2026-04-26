import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, Mail, Save, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

const EditProfile = () => {
  const { t } = useTranslation();
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFullName(user.full_name || '');
    }
  }, [user]);

  const handleSave = async () => {
    if (!fullName.trim()) {
      toast({
        title: t('common.error'),
        description: "Name cannot be empty.",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);
    try {
      const result = await updateUser({ full_name: fullName.trim() });
      if (result.success) {
        toast({
          title: t('common.success'),
          description: "Profile updated successfully.",
        });
        navigate('/profile');
      } else {
        toast({
          title: t('common.error'),
          description: result.error || "Failed to update profile.",
          variant: "destructive"
        });
      }
    } catch (err) {
      toast({
        title: t('common.error'),
        description: "A connection error occurred.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-4 sm:p-8">
      <div className="max-w-2xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)} 
          className="mb-6 text-slate-400 hover:text-white hover:bg-white/5"
        >
          <ArrowLeft className="mr-2" size={18} /> {t('edit_profile.back')}
        </Button>

        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-slate-900/50 border-white/5 backdrop-blur-xl rounded-[28px] overflow-hidden">
            <CardHeader className="border-b border-white/5 px-8 pt-8 pb-6">
              <CardTitle className="text-2xl font-bold flex items-center gap-3">
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                  <User size={24} />
                </div>
                {t('edit_profile.title')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">{t('edit_profile.full_name')}</label>
                <div className="relative">
                   <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                   <input 
                     type="text" 
                     value={fullName}
                     onChange={(e) => setFullName(e.target.value)}
                     className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 focus:border-blue-500/50 outline-none transition-all"
                     placeholder="Enter your full name"
                   />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">{t('edit_profile.email_address')}</label>
                <div className="relative">
                   <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                   <input 
                     type="email" 
                     disabled
                     value={user?.email || ''} 
                     className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-slate-500 cursor-not-allowed"
                   />
                </div>
              </div>

              <div className="pt-4 flex gap-4">
                <Button 
                   onClick={handleSave}
                   disabled={isSaving}
                   className="flex-1 h-12 rounded-2xl bg-blue-600 hover:bg-blue-500 font-bold gap-2"
                >
                  {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                  {isSaving ? t('edit_profile.saving') : t('edit_profile.save_changes')}
                </Button>
                <Button 
                  variant="ghost" 
                  disabled={isSaving}
                  className="flex-1 h-12 rounded-2xl bg-white/5 hover:bg-white/10 font-bold" 
                  onClick={() => navigate(-1)}
                >
                  {t('edit_profile.cancel')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default EditProfile;
