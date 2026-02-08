import { useEffect, useState } from 'react';
import api from '../../lib/api.js';
import { motion } from 'framer-motion';

export default function WorkerHome() {
  const [stats, setStats] = useState(null);
  const [approved, setApproved] = useState([]);

  useEffect(() => {
    Promise.all([
      api.get('/submissions/worker/stats'),
      api.get('/submissions/worker/approved'),
    ]).then(([s, a]) => {
      setStats(s.data);
      setApproved(a.data);
    }).catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-amber-400">Worker Home</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats && (
          <>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-800 rounded-xl p-4 border border-slate-700">
              <p className="text-slate-400 text-sm">Total Submissions</p>
              <p className="text-2xl font-bold text-amber-400">{stats.totalSubmissions}</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="bg-slate-800 rounded-xl p-4 border border-slate-700">
              <p className="text-slate-400 text-sm">Pending Submissions</p>
              <p className="text-2xl font-bold text-amber-400">{stats.pendingSubmissions}</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-slate-800 rounded-xl p-4 border border-slate-700">
              <p className="text-slate-400 text-sm">Total Earning (coins)</p>
              <p className="text-2xl font-bold text-amber-400">{stats.totalEarning}</p>
            </motion.div>
          </>
        )}
      </div>
      <section>
        <h2 className="text-lg font-semibold text-slate-200 mb-3">Approved Submissions</h2>
        <div className="overflow-x-auto rounded-lg border border-slate-700">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-800 text-slate-300">
              <tr>
                <th className="px-4 py-3">Task Title</th>
                <th className="px-4 py-3">Payable Amount</th>
                <th className="px-4 py-3">Buyer Name</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {approved.length === 0 && (
                <tr><td colSpan={4} className="px-4 py-6 text-slate-500 text-center">No approved submissions yet.</td></tr>
              )}
              {approved.map((s) => (
                <tr key={s._id} className="bg-slate-800/50 hover:bg-slate-800">
                  <td className="px-4 py-3 text-slate-200">{s.task_title}</td>
                  <td className="px-4 py-3 text-amber-400">{s.payable_amount} coins</td>
                  <td className="px-4 py-3 text-slate-300">{s.buyer_name}</td>
                  <td className="px-4 py-3"><span className="px-2 py-1 rounded bg-green-500/20 text-green-400">{s.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
