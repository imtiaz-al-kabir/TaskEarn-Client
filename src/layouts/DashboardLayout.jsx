import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import NotificationPopover from '../components/NotificationPopover.jsx';
import {
  LayoutDashboard, ListTodo, FileText, Wallet, History, User,
  PlusCircle, CheckSquare, ShoppingBag, Users, ShieldAlert, BarChart3, LogOut, Receipt
} from 'lucide-react';
import clsx from 'clsx';

const workerNav = [
  { to: '/dashboard/worker-home', label: 'Home', icon: LayoutDashboard },
  { to: '/dashboard/task-list', label: 'Task List', icon: ListTodo },
  { to: '/dashboard/my-submissions', label: 'My Submissions', icon: FileText },
  { to: '/dashboard/withdrawals', label: 'Withdrawals', icon: Wallet },
  { to: '/dashboard/payment-history', label: 'Payment History', icon: History },
  { to: '/dashboard/profile', label: 'Profile', icon: User },
];

const buyerNav = [
  { to: '/dashboard/buyer-home', label: 'Home', icon: LayoutDashboard },
  { to: '/dashboard/add-task', label: 'Add New Task', icon: PlusCircle },
  { to: '/dashboard/my-tasks', label: "My Tasks", icon: ListTodo },
  { to: '/dashboard/tasks-to-review', label: "Review Tasks", icon: CheckSquare },
  { to: '/dashboard/purchase-coin', label: 'Purchase Coin', icon: ShoppingBag },
  { to: '/dashboard/payment-history', label: 'Payment History', icon: History },
  { to: '/dashboard/profile', label: 'Profile', icon: User },
];

const adminNav = [
  { to: '/dashboard/admin-home', label: 'Home', icon: LayoutDashboard },
  { to: '/dashboard/manage-users', label: 'Manage Users', icon: Users },
  { to: '/dashboard/manage-tasks', label: 'Manage Tasks', icon: ListTodo },
  { to: '/dashboard/withdraw-requests', label: 'Withdraw Requests', icon: Receipt },
  { to: '/dashboard/reports', label: 'Reports', icon: BarChart3 },
  { to: '/dashboard/profile', label: 'Profile', icon: User },
];

export default function DashboardLayout() {
  const { user } = useAuth();
  const nav = user?.role === 'worker' ? workerNav : user?.role === 'buyer' ? buyerNav : adminNav;

  return (
    <div className="min-h-screen flex flex-col lg:flex-row font-body selection:bg-brand-500/30">
      <div className="fixed inset-0 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 z-[1]"></div>

      {/* Sidebar */}
      <aside className="w-full lg:w-72 lg:h-screen lg:fixed lg:top-0 lg:left-0 z-20 border-b lg:border-r border-white/5 bg-dark-950/80 backdrop-blur-xl flex flex-col">
        <div className="p-6 flex items-center gap-3 border-b border-white/5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-brand-500/20">
            T
          </div>
          <span className="font-display font-bold text-xl tracking-wide text-white">
            TaskEarn
          </span>
        </div>

        <div className="p-4 flex items-center gap-3 bg-white/5 mx-4 mt-6 rounded-xl border border-white/5">
          <img
            src={user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}`}
            alt=""
            className="w-10 h-10 rounded-full object-cover border-2 border-brand-500/30"
          />
          <div className="min-w-0">
            <p className="font-bold text-sm truncate">{user?.name}</p>
            <p className="text-xs text-brand-400 font-medium capitalize">{user?.role}</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {nav.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group',
                  isActive
                    ? 'bg-brand-500 text-dark-950 shadow-lg shadow-brand-500/20'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                )
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5 text-center text-xs text-slate-600">
          &copy; {new Date().getFullYear()} TaskEarn
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-72 relative z-10 transition-all duration-300">
        <header className="sticky top-0 z-10 flex items-center justify-between gap-4 p-4 lg:p-6 border-b border-white/5 bg-dark-950/80 backdrop-blur-xl">
          <h1 className="text-xl font-display font-bold text-white hidden md:block">Dashboard</h1>

          <div className="flex items-center gap-4 ml-auto">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full glass border-brand-500/20">
              <span className="text-sm text-slate-400">Balance:</span>
              <strong className="text-brand-400 font-bold text-lg">{user?.coin ?? 0}</strong>
            </div>
            <NotificationPopover />
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
