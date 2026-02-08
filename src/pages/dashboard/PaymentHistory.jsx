import { useEffect, useState } from 'react';
import api from '../../lib/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { motion } from 'framer-motion';

export default function PaymentHistory() {
  const { user } = useAuth();
  const [list, setList] = useState([]);
  const isBuyer = user?.role === 'buyer';

  useEffect(() => {
    if (isBuyer) {
      api.get('/payments/history').then(({ data }) => setList(data)).catch(() => {});
    } else {
      setList([]);
    }
  }, [isBuyer]);

  if (!isBuyer) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-amber-400">Payment History</h1>
        <p className="text-slate-400">Only buyers have payment history (coin purchases).</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-amber-400">Payment History</h1>
      <div className="overflow-x-auto rounded-lg border border-slate-700">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-800 text-slate-300">
            <tr>
              <th className="px-4 py-3">Coins</th>
              <th className="px-4 py-3">Amount ($)</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {list.length === 0 && (
              <tr><td colSpan={3} className="px-4 py-6 text-slate-500 text-center">No payments yet.</td></tr>
            )}
            {list.map((p) => (
              <tr key={p._id} className="bg-slate-800/50 hover:bg-slate-800">
                <td className="px-4 py-3 text-amber-400">{p.coins}</td>
                <td className="px-4 py-3 text-slate-200">${p.amount}</td>
                <td className="px-4 py-3 text-slate-400">{new Date(p.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
