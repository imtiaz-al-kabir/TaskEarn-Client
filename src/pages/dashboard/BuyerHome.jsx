import { useEffect, useState } from 'react';
import api from '../../lib/api.js';
import { motion } from 'framer-motion';

export default function BuyerHome() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/tasks/buyer/stats').then(({ data }) => setStats(data)).catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-amber-400">Buyer Home</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats && (
          <>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-800 rounded-xl p-4 border border-slate-700">
              <p className="text-slate-400 text-sm">Total Tasks</p>
              <p className="text-2xl font-bold text-amber-400">{stats.totalTasks}</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="bg-slate-800 rounded-xl p-4 border border-slate-700">
              <p className="text-slate-400 text-sm">Pending Workers (slots)</p>
              <p className="text-2xl font-bold text-amber-400">{stats.pendingWorkers}</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-slate-800 rounded-xl p-4 border border-slate-700">
              <p className="text-slate-400 text-sm">Total Payment ($)</p>
              <p className="text-2xl font-bold text-amber-400">{stats.totalPayment}</p>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
