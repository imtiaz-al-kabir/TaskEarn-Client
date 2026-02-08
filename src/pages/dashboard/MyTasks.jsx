import { useEffect, useState } from 'react';
import api from '../../lib/api.js';
import { motion } from 'framer-motion';

export default function MyTasks() {
  const [tasks, setTasks] = useState([]);
  const [edit, setEdit] = useState(null);
  const [editForm, setEditForm] = useState({ task_title: '', task_detail: '', submission_info: '' });

  useEffect(() => {
    api.get('/tasks/buyer/mine').then(({ data }) => setTasks(data)).catch(() => {});
  }, []);

  const handleUpdate = (t) => {
    setEdit(t);
    setEditForm({ task_title: t.task_title, task_detail: t.task_detail, submission_info: t.submission_info });
  };

  const handleSaveUpdate = async () => {
    if (!edit) return;
    try {
      await api.patch('/tasks/' + edit._id, editForm);
      setTasks((prev) => prev.map((x) => (x._id === edit._id ? { ...x, ...editForm } : x)));
      setEdit(null);
    } catch (_) {}
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this task? Uncompleted worker slots will refund to your coin balance.')) return;
    try {
      await api.delete('/tasks/' + id);
      setTasks((prev) => prev.filter((t) => t._id !== id));
      setEdit(null);
    } catch (_) {}
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-amber-400">My Tasks</h1>
      <div className="overflow-x-auto rounded-lg border border-slate-700">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-800 text-slate-300">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Workers</th>
              <th className="px-4 py-3">Pay/worker</th>
              <th className="px-4 py-3">Deadline</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {tasks.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-6 text-slate-500 text-center">No tasks yet.</td></tr>
            )}
            {tasks.map((t) => (
              <tr key={t._id} className="bg-slate-800/50 hover:bg-slate-800">
                <td className="px-4 py-3 text-slate-200 max-w-[200px] truncate">{t.task_title}</td>
                <td className="px-4 py-3 text-amber-400">{t.required_workers}</td>
                <td className="px-4 py-3 text-slate-300">{t.payable_amount} coins</td>
                <td className="px-4 py-3 text-slate-400">{new Date(t.completion_date).toLocaleDateString()}</td>
                <td className="px-4 py-3 flex gap-2">
                  <button onClick={() => handleUpdate(t)} className="px-3 py-1 rounded bg-amber-600 text-slate-900 text-xs hover:bg-amber-500">Update</button>
                  <button onClick={() => handleDelete(t._id)} className="px-3 py-1 rounded bg-red-600 text-white text-xs hover:bg-red-500">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {edit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70" onClick={() => setEdit(null)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-800 rounded-xl border border-slate-700 p-6 max-w-lg w-full space-y-4"
          >
            <h3 className="font-semibold text-amber-400">Edit Task</h3>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Title</label>
              <input
                value={editForm.task_title}
                onChange={(e) => setEditForm((f) => ({ ...f, task_title: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg bg-slate-900 border border-slate-600 text-slate-100"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Task Detail</label>
              <textarea
                value={editForm.task_detail}
                onChange={(e) => setEditForm((f) => ({ ...f, task_detail: e.target.value }))}
                rows={3}
                className="w-full px-4 py-2 rounded-lg bg-slate-900 border border-slate-600 text-slate-100 resize-none"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Submission Info</label>
              <input
                value={editForm.submission_info}
                onChange={(e) => setEditForm((f) => ({ ...f, submission_info: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg bg-slate-900 border border-slate-600 text-slate-100"
              />
            </div>
            <div className="flex gap-3">
              <button onClick={handleSaveUpdate} className="px-4 py-2 rounded-lg bg-amber-500 text-slate-900 font-medium hover:bg-amber-400">Save</button>
              <button onClick={() => setEdit(null)} className="px-4 py-2 rounded-lg bg-slate-600 text-slate-200 hover:bg-slate-500">Cancel</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
