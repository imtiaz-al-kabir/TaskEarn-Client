import { useEffect, useState } from 'react';
import api from '../../lib/api.js';
import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign, Clock, CheckCircle2, AlertCircle, Coins } from 'lucide-react';
import Swal from 'sweetalert2';

export default function WithdrawRequests() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const { data } = await api.get('/withdrawals/admin/pending');
      setList(data);
    } catch (_) {
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id, worker, amount) => {
    const result = await Swal.fire({
      title: 'Confirm Payment',
      text: `Are you sure you want to approve the $${amount} withdrawal for ${worker}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, Success!',
      background: '#1e293b',
      color: '#f1f5f9'
    });

    if (result.isConfirmed) {
      try {
        await api.post('/withdrawals/' + id + '/approve');
        setList((prev) => prev.filter((w) => w._id !== id));
        Swal.fire({
          icon: 'success',
          title: 'Payment Successful',
          text: 'The withdrawal has been approved and processed.',
          timer: 2000,
          showConfirmButton: false,
          background: '#1e293b',
          color: '#f1f5f9'
        });
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Failed',
          text: err.response?.data?.message || 'Failed to approve withdrawal.',
          background: '#1e293b',
          color: '#f1f5f9'
        });
      }
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-display font-bold text-white tracking-tight">Withdrawal Requests</h1>
        <p className="text-slate-400 mt-1">Manage and approve worker payout requests.</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/5 bg-slate-900/50 backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-800/50 text-slate-400 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Worker Details</th>
                <th className="px-6 py-4">Coins / Amount</th>
                <th className="px-6 py-4">Payment System</th>
                <th className="px-6 py-4">Requested Date</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <AnimatePresence mode="popLayout">
                {list.length === 0 && !loading ? (
                  <motion.tr
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-3 text-slate-500">
                        <CheckCircle2 size={40} className="text-slate-700" />
                        <p className="text-lg">All caught up! No pending requests.</p>
                      </div>
                    </td>
                  </motion.tr>
                ) : (
                  list.map((w, i) => (
                    <motion.tr
                      key={w._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: i * 0.05 }}
                      className="hover:bg-white/5 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-white font-bold">{w.worker_name}</span>
                          <span className="text-slate-400 text-xs">{w.worker_email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex flex-col">
                            <span className="text-amber-400 font-bold flex items-center gap-1">
                              <Coins size={14} /> {w.withdrawal_coin}
                            </span>
                            <span className="text-emerald-400 text-sm font-medium">
                              ${w.withdrawal_amount.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-slate-200 text-sm">{w.payment_system}</span>
                          <span className="text-slate-500 text-xs">{w.account_number}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-slate-400 text-sm">
                          <Clock size={14} />
                          {new Date(w.withdraw_date).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleApprove(w._id, w.worker_name, w.withdrawal_amount)}
                          className="btn-primary !px-4 !py-2 !text-xs !rounded-lg bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20"
                        >
                          Payment Success
                        </button>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
