import { useEffect, useState } from 'react';
import api from '../../lib/api.js';
import { motion } from 'framer-motion';
import { Users, UserCheck, Coins, CreditCard, BarChart3, TrendingUp } from 'lucide-react';

export default function AdminHome() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/users/stats')
      .then(({ data }) => setStats(data))
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    {
      label: 'Total Workers',
      value: stats?.totalWorkers ?? 0,
      icon: Users,
      color: 'from-blue-500/20 to-blue-600/20',
      iconColor: 'text-blue-400',
      borderColor: 'border-blue-500/20'
    },
    {
      label: 'Total Buyers',
      value: stats?.totalBuyers ?? 0,
      icon: UserCheck,
      color: 'from-purple-500/20 to-purple-600/20',
      iconColor: 'text-purple-400',
      borderColor: 'border-purple-500/20'
    },
    {
      label: 'Available Coins',
      value: stats?.totalCoins ?? 0,
      icon: Coins,
      color: 'from-amber-500/20 to-amber-600/20',
      iconColor: 'text-amber-400',
      borderColor: 'border-amber-500/20'
    },
    {
      label: 'Total Payments',
      value: `$${stats?.totalPayments ?? 0}`,
      icon: CreditCard,
      color: 'from-emerald-500/20 to-emerald-600/20',
      iconColor: 'text-emerald-400',
      borderColor: 'border-emerald-500/20'
    }
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white tracking-tight">System Overview</h1>
          <p className="text-slate-400 mt-1">Real-time statistics and platform health metrics.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl glass border-brand-500/20 text-brand-400 font-bold text-sm">
          <TrendingUp size={16} />
          <span>Live Updates Enabled</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="h-32 rounded-2xl bg-slate-800/50 animate-pulse border border-slate-700" />
          ))
        ) : (
          statCards.map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`relative overflow-hidden group p-6 rounded-2xl border ${card.borderColor} bg-slate-900/50 backdrop-blur-xl hover:bg-slate-800/80 transition-all duration-300`}
            >
              <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${card.color} blur-3xl -mr-8 -mt-8 opacity-50 group-hover:opacity-100 transition-opacity`} />

              <div className="relative z-10">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.iconColor} bg-white/5 mb-4 group-hover:scale-110 transition-transform`}>
                  <card.icon size={24} />
                </div>
                <p className="text-slate-400 text-sm font-medium">{card.label}</p>
                <p className="text-3xl font-bold text-white mt-1">{card.value}</p>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card p-12 flex flex-col items-center text-center border-white/5"
      >
        <div className="w-16 h-16 rounded-full bg-brand-500/10 flex items-center justify-center text-brand-400 mb-6">
          <BarChart3 size={32} />
        </div>
        <h2 className="text-2xl font-bold text-white mb-3">Revenue & Usage Reports</h2>
        <p className="text-slate-400 max-w-md mx-auto mb-8">
          Detailed analytics for task completion rates, user retention, and financial forecasting are available in the reports section.
        </p>
        <button className="btn-secondary px-8">View Detailed Reports</button>
      </motion.div>
    </div>
  );
}
