import { useEffect, useState } from 'react';
import api from '../../lib/api.js';
import { motion } from 'framer-motion';

export default function Reports() {
  const [list, setList] = useState([]);

  useEffect(() => {
    api.get('/reports').then(({ data }) => setList(data)).catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-amber-400">Reports (Invalid Submissions)</h1>
      <p className="text-slate-400 text-sm">Buyers can report invalid submissions. Review and take action on users if needed.</p>
      <div className="overflow-x-auto rounded-lg border border-slate-700">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-800 text-slate-300">
            <tr>
              <th className="px-4 py-3">Submission ID</th>
              <th className="px-4 py-3">Reported By</th>
              <th className="px-4 py-3">Reason</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {list.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-6 text-slate-500 text-center">No reports yet.</td></tr>
            )}
            {list.map((r) => (
              <tr key={r._id} className="bg-slate-800/50 hover:bg-slate-800">
                <td className="px-4 py-3 text-slate-400 font-mono text-xs truncate max-w-[120px]">{r.submission_id}</td>
                <td className="px-4 py-3 text-slate-300 truncate max-w-[180px]">{r.reported_by}</td>
                <td className="px-4 py-3 text-slate-200">{r.reason}</td>
                <td className="px-4 py-3"><span className="px-2 py-1 rounded bg-amber-500/20 text-amber-400 capitalize">{r.status}</span></td>
                <td className="px-4 py-3 text-slate-400">{new Date(r.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
