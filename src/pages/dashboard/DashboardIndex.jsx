import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export default function DashboardIndex() {
  const { user } = useAuth();
  if (!user) return null;
  if (user.role === 'worker') return <Navigate to="/dashboard/worker-home" replace />;
  if (user.role === 'buyer') return <Navigate to="/dashboard/buyer-home" replace />;
  if (user.role === 'admin') return <Navigate to="/dashboard/admin-home" replace />;
  return <Navigate to="/" replace />;
}
