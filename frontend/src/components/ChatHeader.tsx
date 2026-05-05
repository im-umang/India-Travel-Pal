import { useState, useEffect } from 'react';
import { ArrowLeft, RotateCcw, Volume2, VolumeX, Menu, Wifi, Compass } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useChat } from '@/context/ChatContext';
import { stopSpeaking } from '@/lib/voiceService';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { LogOut } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ChatHeaderProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ toggleSidebar, isSidebarOpen }) => {
  const navigate = useNavigate();
  const { resetChat, isVoiceEnabled, toggleVoice, conversations, currentConversationId } = useChat();
  const { logout } = useAuth();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const [isAnySpeaking, setIsAnySpeaking] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const speaking = typeof window !== 'undefined' && 'speechSynthesis' in window
        ? window.speechSynthesis.speaking
        : false;
      setIsAnySpeaking(speaking);
    }, 200);
    return () => clearInterval(interval);
  }, []);

  const currentChat = conversations.find(c => c.id === currentConversationId);
  const chatTitle = currentChat?.title || "New Chat";

  const handleSpeakerClick = () => {
    if (isAnySpeaking) {
      stopSpeaking();
    } else {
      toggleVoice();
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-50 w-full h-14 flex items-center shrink-0"
      style={{
        background: '#ffffff',
        borderBottom: '1px solid rgba(15,113,115,0.12)',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
      }}
    >
      <div className="flex items-center justify-between w-full px-3 sm:px-4">

        {/* ── Left Section ── */}
        <div className="flex items-center gap-2 min-w-0">
          {/* Sidebar toggle */}
          <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="h-8 w-8 rounded-xl shrink-0 transition-all"
              style={{
                color: isSidebarOpen ? 'hsl(192 85% 35%)' : '#64748b',
                background: isSidebarOpen ? 'hsl(192 85% 35% / 0.08)' : undefined,
              }}
              title={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
            >
              <Menu size={18} />
            </Button>
          </motion.div>

          {/* Back button (desktop only) */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="hidden lg:block">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/dashboard')}
              className="h-8 w-8 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
              id="chat-back-btn"
              title="Back to Dashboard"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </motion.div>

          {/* Chat Title */}
          <div className="flex flex-col min-w-0">
            <h2 className="font-bold text-sm sm:text-[15px] tracking-tight truncate max-w-[140px] xs:max-w-[180px] sm:max-w-xs md:max-w-sm text-slate-800">
              {chatTitle}
            </h2>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span className="text-[10px] text-slate-400 font-medium">AI Online</span>
            </div>
          </div>
        </div>

        {/* ── Right Section ── */}
        <div className="flex items-center gap-1.5">
          {/* Desktop agent info */}
          <div className="hidden md:flex items-center gap-3 mr-3">
            <div className="flex flex-col items-end">
              <span className="text-xs font-semibold text-slate-700">India Travel Pal</span>
              {/* <div className="flex items-center gap-1">
                <Wifi size={9} className="text-emerald-500" />
                <span className="text-[10px] text-slate-400">Real-time AI</span>
              </div> */}
            </div>
            {/* Agent avatar */}
            <div className="w-8 h-8 rounded-xl flex items-center justify-center shadow-md shrink-0 logo-ring"
              style={{ background: 'linear-gradient(135deg, hsl(28 95% 45%), hsl(28 90% 35%))' }}>
              <Compass className="h-4 w-4 text-white" />
            </div>
          </div>

          {/* ── Voice Button ── */}
          {/* <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSpeakerClick}
              className={cn(
                "h-8 w-8 rounded-xl transition-all duration-200",
                isAnySpeaking
                  ? "text-blue-600 bg-blue-50"
                  : isVoiceEnabled
                    ? "bg-teal-50"
                    : "text-slate-400 hover:bg-slate-100"
              )}
              style={isVoiceEnabled && !isAnySpeaking ? { color: 'hsl(192 85% 32%)' } : undefined}
              title={isAnySpeaking ? "Speaking — click to stop" : isVoiceEnabled ? "Auto-voice ON" : "Auto-voice OFF"}
            >
              {isAnySpeaking
                ? <Volume2 className="h-4 w-4 animate-pulse" />
                : isVoiceEnabled
                  ? <Volume2 className="h-4 w-4" />
                  : <VolumeX className="h-4 w-4" />
              }
            </Button>
          </motion.div>

          {/* ── Reset Button ── */}
          {/* <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.4 }}>
            <Button
              variant="ghost"
              size="icon"
              onClick={resetChat}
              className="h-8 w-8 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
              title="Clear chat"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </motion.div>

          {/* ── Logout Button ── */}
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowLogoutDialog(true)}
              className="h-8 w-8 rounded-xl text-red-500 hover:text-red-600 hover:bg-red-50 transition-all"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent className="bg-white border border-slate-200 text-slate-900">
          <AlertDialogHeader>
            <AlertDialogTitle>Logout Confirmation</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500">
              Are you sure you want to log out? You will need to sign in again to access your travel plans.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-slate-100 border-none hover:bg-slate-200 text-slate-700">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white border-none"
            >
              Log Out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.header>
  );
};

export default ChatHeader;
