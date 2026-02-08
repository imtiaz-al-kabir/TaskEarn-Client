import { useEffect, useState } from 'react';
import api from '../../lib/api.js';
import { motion } from 'framer-motion';

const limit = 10;

export default function MySubmissions() {
  const [data, setData] = useState({ submissions: [], total: 0, page: 1, totalPages: 1 });
  const [page, setPage] = useState(1);

  useEffect(() => {
    api.get('/submissions/worker/mine', { params: { page, limit } }).then(({ data: d }) => setData(d)).catch(() => {});
  }, [page]);

  const statusColor = (s) => {
    if (s === 'approved') return 'bg-green-500/20 text-green-400';
    if (s === 'rejected') return 'bg-red-500/20 text-red-400';
    return 'bg-amber-500/20 text-amber-400';
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-amber-400">My Submissions</h1>
      <div className="overflow-x-auto rounded-lg border border-slate-700">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-800 text-slate-300">
            <tr>
              <th className="px-4 py-3">Task Title</th>
              <th className="px-4 py-3">Payable</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {data.submissions.length === 0 && (
              <tr><td colSpan={4} className="px-4 py-6 text-slate-500 text-center">No submissions yet.</td></tr>
            )}
            {data.submissions.map((s) => (
              <tr key={s._id} className="bg-slate-800/50 hover:bg-slate-800">
                <td className="px-4 py-3 text-slate-200">{s.task_title}</td>
                <td className="px-4 py-3 text-amber-400">{s.payable_amount} coins</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded capitalize ${statusColor(s.status)}`}>{s.status}</span>
                </td>
                <td className="px-4 py-3 text-slate-400">{new Date(s.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {data.totalPages > 1 && (
        <div className="flex justify-center items-center gap-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="px-4 py-2 rounded-lg bg-slate-700 text-slate-200 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-slate-400">Page {page} of {data.totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
            disabled={page >= data.totalPages}
            className="px-4 py-2 rounded-lg bg-slate-700 text-slate-200 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
