import { useEffect, useState } from 'react';
import api from '../../lib/api.js';
import { motion } from 'framer-motion';

export default function ManageTasks() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    api.get('/tasks/admin/all').then(({ data }) => setTasks(data)).catch(() => {});
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this task?')) return;
    try {
      await api.delete('/tasks/' + id);
      setTasks((prev) => prev.filter((t) => t._id !== id));
    } catch (_) {}
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-amber-400">Manage Tasks</h1>
      <div className="overflow-x-auto rounded-lg border border-slate-700">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-800 text-slate-300">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Buyer</th>
              <th className="px-4 py-3">Workers</th>
              <th className="px-4 py-3">Pay/worker</th>
              <th className="px-4 py-3">Deadline</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {tasks.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-6 text-slate-500 text-center">No tasks.</td></tr>
            )}
            {tasks.map((t) => (
              <tr key={t._id} className="bg-slate-800/50 hover:bg-slate-800">
                <td className="px-4 py-3 text-slate-200 max-w-[200px] truncate">{t.task_title}</td>
                <td className="px-4 py-3 text-slate-300 truncate max-w-[150px]">{t.buyer_name}</td>
                <td className="px-4 py-3 text-amber-400">{t.required_workers}</td>
                <td className="px-4 py-3 text-slate-300">{t.payable_amount} coins</td>
                <td className="px-4 py-3 text-slate-400">{new Date(t.completion_date).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <button onClick={() => handleDelete(t._id)} className="px-3 py-1 rounded bg-red-600 text-white text-xs hover:bg-red-500">Delete Task</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
