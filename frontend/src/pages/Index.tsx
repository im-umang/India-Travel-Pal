import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';

/**
 * Smart root redirect:
 * - Admin → /admin
 * - Regular user → /dashboard
 * - Not logged in → /login
 */
const SmartRedirect = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) return null; // Wait for auth check

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (user?.role === 'admin') return <Navigate to="/admin" replace />;

  return <Navigate to="/dashboard" replace />;
};

export default SmartRedirect;
