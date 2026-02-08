import { useEffect, useState } from 'react';
import api from '../../lib/api.js';
import { motion } from 'framer-motion';

export default function AdminHome() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/users/stats').then(({ data }) => setStats(data)).catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-amber-400">Admin Home</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats && (
          <>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-800 rounded-xl p-4 border border-slate-700">
              <p className="text-slate-400 text-sm">Total Workers</p>
              <p className="text-2xl font-bold text-amber-400">{stats.totalWorkers}</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="bg-slate-800 rounded-xl p-4 border border-slate-700">
              <p className="text-slate-400 text-sm">Total Buyers</p>
              <p className="text-2xl font-bold text-amber-400">{stats.totalBuyers}</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-slate-800 rounded-xl p-4 border border-slate-700">
              <p className="text-slate-400 text-sm">Total Coins (platform)</p>
              <p className="text-2xl font-bold text-amber-400">{stats.totalCoins}</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-slate-800 rounded-xl p-4 border border-slate-700">
              <p className="text-slate-400 text-sm">Total Payments ($)</p>
              <p className="text-2xl font-bold text-amber-400">{stats.totalPayments}</p>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
