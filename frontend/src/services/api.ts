/**
 * API Service for India Travel Pal
 * Standardized backend communication layer
 */

import { config } from '@/config';

const API_BASE = config.apiBase;

/** Helper for authenticated fetch */
const authFetch = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `API Error: ${response.status}`);
  }

  return response.json();
};

export const api = {
  // ── Auth ──
  getCurrentUser: () => authFetch('/auth/me'),
  updateProfile: (data: any) => authFetch('/auth/me', { method: 'PATCH', body: JSON.stringify(data) }),
  
  // ── Chat ──
  getConversations: () => authFetch('/chat/conversations'),
  getConversation: (id: string) => authFetch(`/chat/conversations/${id}`),
  deleteConversation: (id: string) => authFetch(`/chat/conversations/${id}`, { method: 'DELETE' }),
  sendMessage: (content: string, conversationId?: string, language: string = 'en') => 
    authFetch('/chat/message', { 
      method: 'POST', 
      body: JSON.stringify({ content, conversation_id: conversationId, language }) 
    }),

  // ── Trips ──
  getTrips: () => authFetch('/trips/'),
  getTrip: (id: string) => authFetch(`/trips/${id}`),
  deleteTrip: (id: string) => authFetch(`/trips/${id}`, { method: 'DELETE' }),

  // ── Admin ──
  getAdminStats: () => authFetch('/admin/stats'),
  getAllUsers: () => authFetch('/admin/users'),
};

/** 
 * Legacy / Mock exports removed. 
 * Chat logic is now handled dynamically via the /chat/message endpoint 
 * which connects to Gemini AI.
 */
