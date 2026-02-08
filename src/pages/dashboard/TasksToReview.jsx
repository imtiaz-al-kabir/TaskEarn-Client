import { useEffect, useState } from 'react';
import api from '../../lib/api.js';
import { motion } from 'framer-motion';

export default function TasksToReview() {
  const [list, setList] = useState([]);
  const [modal, setModal] = useState(null);
  const [reportReason, setReportReason] = useState('');
  const [reportingId, setReportingId] = useState(null);

  useEffect(() => {
    api.get('/submissions/buyer/pending').then(({ data }) => setList(data)).catch(() => {});
  }, []);

  const handleApprove = async (id) => {
    try {
      await api.post('/submissions/' + id + '/approve');
      setList((prev) => prev.filter((s) => s._id !== id));
      setModal(null);
    } catch (_) {}
  };

  const handleReject = async (id) => {
    try {
      await api.post('/submissions/' + id + '/reject');
      setList((prev) => prev.filter((s) => s._id !== id));
      setModal(null);
    } catch (_) {}
  };

  const handleReport = async () => {
    if (!modal || !reportReason.trim()) return;
    try {
      await api.post('/reports', { submission_id: modal._id, reason: reportReason.trim() });
      setReportingId(null);
      setReportReason('');
      setModal(null);
    } catch (_) {}
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-amber-400">Tasks to Review</h1>
      <div className="overflow-x-auto rounded-lg border border-slate-700">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-800 text-slate-300">
            <tr>
              <th className="px-4 py-3">Worker Name</th>
              <th className="px-4 py-3">Task Title</th>
              <th className="px-4 py-3">Payable Amount</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {list.length === 0 && (
              <tr><td colSpan={4} className="px-4 py-6 text-slate-500 text-center">No pending submissions.</td></tr>
            )}
            {list.map((s) => (
              <tr key={s._id} className="bg-slate-800/50 hover:bg-slate-800">
                <td className="px-4 py-3 text-slate-200">{s.worker_name}</td>
                <td className="px-4 py-3 text-slate-200">{s.task_title}</td>
                <td className="px-4 py-3 text-amber-400">{s.payable_amount} coins</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => setModal(s)}
                    className="px-3 py-1 rounded bg-slate-600 text-slate-200 hover:bg-slate-500 text-sm"
                  >
                    View Submission
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70" onClick={() => setModal(null)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-800 rounded-xl border border-slate-700 p-6 max-w-lg w-full max-h-[90vh] overflow-auto"
          >
            <h3 className="font-semibold text-amber-400 mb-2">{modal.task_title}</h3>
            <p className="text-slate-400 text-sm">Worker: {modal.worker_name}</p>
            <p className="text-slate-400 text-sm">Payable: {modal.payable_amount} coins</p>
            <p className="mt-3 text-slate-300 text-sm">Submission details:</p>
            <p className="mt-1 p-3 rounded bg-slate-900 text-slate-200 text-sm whitespace-pre-wrap">{modal.submission_details}</p>
            {reportingId === modal._id ? (
              <div className="mt-4 space-y-2">
                <input
                  type="text"
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  placeholder="Reason for report (invalid submission)"
                  className="w-full px-4 py-2 rounded-lg bg-slate-900 border border-slate-600 text-slate-100 text-sm"
                />
                <div className="flex gap-2">
                  <button onClick={handleReport} className="px-4 py-2 rounded-lg bg-orange-600 text-white hover:bg-orange-500 text-sm">Submit Report</button>
                  <button onClick={() => { setReportingId(null); setReportReason(''); }} className="px-4 py-2 rounded-lg bg-slate-600 text-slate-200 hover:bg-slate-500 text-sm">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  onClick={() => handleApprove(modal._id)}
                  className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-500"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleReject(modal._id)}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-500"
                >
                  Reject
                </button>
                <button
                  onClick={() => setReportingId(modal._id)}
                  className="px-4 py-2 rounded-lg bg-orange-600 text-white hover:bg-orange-500"
                >
                  Report Invalid
                </button>
                <button
                  onClick={() => setModal(null)}
                  className="px-4 py-2 rounded-lg bg-slate-600 text-slate-200 hover:bg-slate-500"
                >
                  Close
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}
