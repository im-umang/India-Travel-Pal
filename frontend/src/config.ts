/**
 * Application Configuration
 * All environment variables are centralized here
 */

export const config = {
  apiBase: import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000/api/v1',
  adminEmail: import.meta.env.VITE_ADMIN_EMAIL || 'admin@indiatravelpal.com',
};

export default config;
