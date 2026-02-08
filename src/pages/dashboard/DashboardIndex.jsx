import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export default function DashboardIndex() {
  const { user } = useAuth();
  if (!user) return null;
  if (user.role === 'worker') return <Navigate to="/dashboard/worker-home" replace />;
  if (user.role === 'buyer') return <Navigate to="/dashboard/buyer-home" replace />;
  if (user.role === 'admin') return <Navigate to="/dashboard/admin-home" replace />;

  return (
    <div className="flex flex-col items-center justify-center h-full text-slate-400">
      <h2 className="text-xl font-bold text-amber-500 mb-2">Account Role Missing</h2>
      <p>Your account does not have a specific role assigned.</p>
      <p className="text-sm mt-2">Debug: {JSON.stringify(user)}</p>
      <button
        onClick={() => { localStorage.clear(); window.location.reload(); }}
        className="mt-4 px-4 py-2 bg-slate-700 rounded hover:bg-slate-600 text-white"
      >
        Clear Cache & Reload
      </button>
    </div>
  );
}
