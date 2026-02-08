import { useEffect, useState } from 'react';
import api from '../../lib/api.js';
import { motion } from 'framer-motion';

export default function WithdrawRequests() {
  const [list, setList] = useState([]);

  useEffect(() => {
    api.get('/withdrawals/admin/pending').then(({ data }) => setList(data)).catch(() => {});
  }, []);

  const handleApprove = async (id) => {
    try {
      await api.post('/withdrawals/' + id + '/approve');
      setList((prev) => prev.filter((w) => w._id !== id));
    } catch (_) {}
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-amber-400">Withdraw Requests</h1>
      <div className="overflow-x-auto rounded-lg border border-slate-700">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-800 text-slate-300">
            <tr>
              <th className="px-4 py-3">Worker</th>
              <th className="px-4 py-3">Coins</th>
              <th className="px-4 py-3">Amount ($)</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {list.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-6 text-slate-500 text-center">No pending requests.</td></tr>
            )}
            {list.map((w) => (
              <tr key={w._id} className="bg-slate-800/50 hover:bg-slate-800">
                <td className="px-4 py-3 text-slate-200">{w.worker_name}</td>
                <td className="px-4 py-3 text-amber-400">{w.withdrawal_coin}</td>
                <td className="px-4 py-3 text-slate-300">${w.withdrawal_amount}</td>
                <td className="px-4 py-3 text-slate-400">{w.payment_system}</td>
                <td className="px-4 py-3 text-slate-400">{new Date(w.withdraw_date).toLocaleString()}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleApprove(w._id)}
                    className="px-3 py-1 rounded bg-green-600 text-white text-xs hover:bg-green-500"
                  >
                    Payment Success
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
