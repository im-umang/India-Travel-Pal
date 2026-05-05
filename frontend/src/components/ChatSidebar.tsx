import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChat, Conversation } from '@/context/ChatContext';
import { useAuth } from '@/context/AuthContext';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
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
import {
    Plus,
    MessageSquare,
    MessagesSquare,
    Settings,
    LogOut,
    User,
    PanelLeftClose,
    ShieldCheck,
    X,
    Compass,
    Sparkles,
    MapPin,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatSidebarProps {
    isOpen: boolean;
    toggleSidebar: () => void;
    isMobile: boolean;
}

// ── Helper: extract preview text from last user message ──
function getPreviewText(messages: any[]): string {
    if (!messages || messages.length === 0) return 'No messages yet';
    const lastUser = [...messages].reverse().find((m: any) => m.sender === 'user');
    if (lastUser) {
        const t = typeof lastUser.text === 'string' ? lastUser.text : '';
        return t.length > 42 ? t.slice(0, 42) + '…' : t || 'New message';
    }
    return 'Start chatting...';
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({ isOpen, toggleSidebar, isMobile }) => {
    const {
        conversations,
        currentConversationId,
        createNewConversation,
        selectConversation,
        deleteConversation,
    } = useChat();

    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [showClearConfirm, setShowClearConfirm] = useState(false);
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);

    // ── Filter empty chats ──
    const visibleConversations = conversations.filter(
        (c: Conversation) => c.messages.length > 0 || c.id === currentConversationId
    );

    const handleNewChat = () => {
        createNewConversation();
        if (isMobile) toggleSidebar();
    };

    const handleSelectChat = (id: string) => {
        selectConversation(id);
        if (isMobile) toggleSidebar();
    };

    const handleDeleteChat = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        deleteConversation(id);
    };

    // const handleClearAll = () => {
    //     if (!showClearConfirm) {
    //         setShowClearConfirm(true);
    //         setTimeout(() => setShowClearConfirm(false), 3000);
    //         return;
    //     }
    //     conversations.forEach((c: Conversation) => {
    //         if (c.id !== currentConversationId) deleteConversation(c.id);
    //     });
    //     setShowClearConfirm(false);
    // };

    // const handleLogout = () => {
    //     logout();
    //     navigate('/login');
    // };

    return (
        <>
            {/* Mobile overlay */}
            <AnimatePresence>
                {isMobile && isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                        onClick={toggleSidebar}
                    />
                )}
            </AnimatePresence>

            {/* ── Sidebar Panel ── */}
            <div
                className={cn(
                    "fixed inset-y-0 left-0 z-50 flex flex-col transition-all duration-300 ease-in-out",
                    "sidebar-royal",
                    isOpen ? "w-80 translate-x-0" : "-translate-x-full",
                )}
            >
                {/* Decorative orbs inside sidebar */}
                <div className="absolute top-10 left-4 w-24 h-24 rounded-full pointer-events-none"
                    style={{ background: 'radial-gradient(circle, hsl(192 85% 40% / 0.2), transparent)', filter: 'blur(20px)' }} />
                <div className="absolute bottom-32 right-4 w-20 h-20 rounded-full pointer-events-none"
                    style={{ background: 'radial-gradient(circle, hsl(35 100% 52% / 0.15), transparent)', filter: 'blur(20px)' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full pointer-events-none"
                    style={{ background: 'radial-gradient(circle, hsl(280 70% 55% / 0.08), transparent)', filter: 'blur(30px)' }} />

                {/* ── Header ── */}
                <div className="relative z-10 px-4 py-4 flex items-center justify-between shrink-0"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                    <div className="flex items-center gap-2.5">
                        {/* Animated logo */}
                        <div className="relative w-9 h-9 shrink-0 logo-ring rounded-xl">
                            <div className="w-full h-full rounded-xl flex items-center justify-center"
                                style={{ background: 'linear-gradient(135deg, hsl(28 95% 45%), hsl(28 90% 35%))' }}>
                                <Compass className="h-4 w-4 text-white" />
                            </div>
                        </div>
                        <div className="leading-tight">
                            <div className="text-sm font-bold" style={{ color: 'rgba(255,255,255,0.95)' }}>
                                India Travel Pal
                            </div>
                            {/* <div className="flex items-center gap-1" style={{ color: 'hsl(192 85% 55%)' }}>
                                <Sparkles size={8} />
                                <span className="text-[9px] font-semibold tracking-wide">AI Travel Assistant</span>
                            </div> */}
                        </div>
                    </div>

                    {/* ── Sidebar Toggle Button (Floating) ── */}
                    <div className="absolute left-full top-2 ml-2 z-50">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={toggleSidebar}
                            className={cn(
                                "flex items-center justify-center w-10 h-10 rounded-xl shadow-lg transition-all",
                                "bg-white/95 backdrop-blur-md border border-slate-200 text-teal-600 hover:text-teal-700"
                            )}
                            title={isOpen ? "Close sidebar" : "Open sidebar"}
                        >
                            {isOpen ? <PanelLeftClose size={20} /> : <Menu size={20} />}
                        </motion.button>
                    </div>
                </div>

                {/* ── New Conversation Button ── */}
                <div className="relative z-10 px-3 py-3 shrink-0">
                    <motion.button
                        whileHover={{ scale: 1.02, y: -1 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleNewChat}
                        className="btn-new-chat w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-white text-sm font-semibold"
                    >
                        <Plus size={16} className="shrink-0" />
                        New Conversation
                        <Sparkles size={12} className="opacity-70 shrink-0" />
                    </motion.button>
                </div>

                {/* ── Conversation List ── */}
                <div className="relative z-10 flex-1 overflow-hidden">
                    <ScrollArea className="h-full px-2">
                        <div className="space-y-0.5 py-1.5">

                            {/* Section header */}
                            <div className="px-2 mb-2 flex items-center justify-between">
                                <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest"
                                    style={{ color: 'rgba(255,255,255,0.52)' }}>
                                    <MessagesSquare size={9} />
                                    Recent Chats ({visibleConversations.length})
                                </span>
                                {/* {visibleConversations.length > 1 && (
                                    <button
                                        onClick={handleClearAll}
                                        className={cn(
                                            "text-[9px] px-2 py-0.5 rounded-md transition-all font-semibold",
                                            showClearConfirm
                                                ? "bg-red-500/25 text-red-400 animate-pulse"
                                                : "text-slate-600 hover:text-red-400 hover:bg-white/10"
                                        )}
                                    >
                                        {showClearConfirm ? "Confirm?" : "Clear All"}
                                    </button>
                                )} */}
                            </div>

                            {/* Conversation items */}
                            <AnimatePresence>
                                {visibleConversations.map((chat: Conversation, idx: number) => {
                                    const isActive = chat.id === currentConversationId;
                                    const preview = getPreviewText(chat.messages);
                                    return (
                                        <motion.div
                                            key={chat.id}
                                            initial={{ opacity: 0, x: -12 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -12 }}
                                            transition={{ delay: idx * 0.03, duration: 0.2 }}
                                            onClick={() => handleSelectChat(chat.id)}
                                            className={cn(
                                                "group relative flex items-start gap-2.5 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 mx-1 mb-0.5",
                                                isActive
                                                    ? "border-l-2 border-teal-400"
                                                    : "border-l-2 border-transparent"
                                            )}
                                            style={{
                                                background: isActive
                                                    ? 'linear-gradient(90deg, hsl(192 85% 30% / 0.4), hsl(192 85% 30% / 0.12))'
                                                    : undefined,
                                            }}
                                            onMouseEnter={e => {
                                                if (!isActive) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)';
                                            }}
                                            onMouseLeave={e => {
                                                if (!isActive) (e.currentTarget as HTMLElement).style.background = '';
                                            }}
                                        >
                                            {/* Icon */}
                                            <div className={cn(
                                                "shrink-0 mt-0.5 w-5 h-5 rounded-md flex items-center justify-center",
                                                isActive ? "bg-teal-400/20" : "bg-white/5"
                                            )}>
                                                <MapPin size={10} className={isActive ? "text-teal-400" : "text-slate-500"} />
                                            </div>

                                            {/* Title + Preview */}
                                            <div className="flex-1 min-w-0 pr-8">
                                                <div className="text-xs font-semibold truncate leading-tight"
                                                    style={{ color: isActive ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.65)' }}>
                                                    {chat.title || "New Chat"}
                                                </div>
                                                <div className="text-[10px] truncate mt-0.5 leading-tight"
                                                    style={{ color: 'rgba(255,255,255,0.55)' }}>
                                                    {preview}
                                                </div>
                                            </div>

                                            {/* Delete button */}
                                            <button
                                                onClick={(e) => handleDeleteChat(e, chat.id)}
                                                title="Delete chat"
                                                className={cn(
                                                    "absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-md",
                                                    "text-slate-600 hover:text-red-400 hover:bg-red-400/10 transition-all",
                                                    isActive ? "opacity-60 hover:opacity-100" : "opacity-0 group-hover:opacity-100"
                                                )}
                                            >
                                                <X size={10} />
                                            </button>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>

                            {/* Empty state */}
                            {visibleConversations.length === 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="px-4 py-12 text-center"
                                >
                                    <div className="text-4xl mb-3 animate-float">✈️</div>
                                    <div className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
                                        No trips planned yet.<br />
                                        <span style={{ color: 'hsl(192 85% 55%)' }}>Start a new conversation!</span>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </ScrollArea>
                </div>

                {/* ── User Profile Footer ── */}
                <div className="relative z-10 px-3 py-3 shrink-0"
                    style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <div className="flex items-center gap-2.5 p-2.5 rounded-xl cursor-pointer transition-all group"
                                style={{ background: 'rgba(255,255,255,0.04)' }}
                                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)'}
                                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'}
                            >
                                {/* Avatar */}
                                <div className="h-8 w-8 rounded-xl flex items-center justify-center text-white font-bold text-xs shrink-0"
                                    style={{
                                        background: 'linear-gradient(135deg, hsl(280 70% 55%), hsl(192 85% 45%))',
                                        boxShadow: '0 2px 12px hsl(280 70% 55% / 0.4)',
                                    }}>
                                    {user?.full_name
                                        ? user.full_name.charAt(0).toUpperCase()
                                        : (user?.email?.charAt(0).toUpperCase() || "U")}
                                </div>
                                <div className="flex-1 min-w-0 text-left">
                                    <div className="text-sm font-semibold truncate" style={{ color: 'rgba(255,255,255,0.9)' }}>
                                        {user?.full_name || user?.email?.split('@')[0] || "Traveler"}
                                    </div>
                                    <div className="text-[10px] truncate" style={{ color: 'rgba(255,255,255,0.35)' }}>
                                        {user?.email || "Free Plan"}
                                    </div>
                                </div>
                                <Settings size={13} className="text-slate-600 group-hover:text-slate-300 shrink-0 transition-colors" />
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" side="top" className="w-52 mb-1"
                            style={{ background: '#0f1d3a', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.9)' }}>
                            <DropdownMenuLabel style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px' }}>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator style={{ background: 'rgba(255,255,255,0.08)' }} />
                            <DropdownMenuItem
                                className="cursor-pointer gap-2 focus:bg-white/10 hover:bg-white/10"
                                style={{ color: 'rgba(255,255,255,0.8)' }}
                                onClick={() => navigate('/profile')}
                            >
                                <User className="h-4 w-4" />
                                <span>Profile</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="cursor-pointer gap-2 focus:bg-white/10 hover:bg-white/10"
                                style={{ color: 'rgba(255,255,255,0.8)' }}
                                onClick={() => navigate('/settings')}
                            >
                                <Settings className="h-4 w-4" />
                                <span>Settings</span>
                            </DropdownMenuItem>
                            {user?.role === 'admin' && (
                                <>
                                    <DropdownMenuSeparator style={{ background: 'rgba(255,255,255,0.08)' }} />
                                    <DropdownMenuItem
                                        className="cursor-pointer gap-2 focus:bg-amber-400/10 hover:bg-amber-400/10"
                                        style={{ color: 'hsl(35 100% 60%)' }}
                                        onClick={() => navigate('/admin')}
                                    >
                                        <ShieldCheck className="h-4 w-4" />
                                        <span>Admin Panel</span>
                                    </DropdownMenuItem>
                                </>
                            )}
                            {/* <DropdownMenuSeparator style={{ background: 'rgba(255,255,255,0.08)' }} />
                            <DropdownMenuItem
                                className="cursor-pointer gap-2 focus:bg-red-400/10 hover:bg-red-400/10"
                                style={{ color: 'hsl(0 80% 60%)' }}
                                onClick={() => setShowLogoutDialog(true)}
                            >
                                <LogOut className="h-4 w-4" />
                                <span>Log out</span>
                            </DropdownMenuItem> */}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Logout Confirmation Dialog */}
            {/* <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
                <AlertDialogContent className="bg-[#0f1d3a] border border-white/10 text-white">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-400">
                            You will be logged out of your account. You'll need to sign in again to access your saved trips.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="bg-white/5 border-white/10 hover:bg-white/10 text-white">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleLogout}
                            className="bg-red-500 hover:bg-red-600 text-white border-none"
                        >
                            Log Out
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog> */}
        </>
    );
};

export default ChatSidebar;
