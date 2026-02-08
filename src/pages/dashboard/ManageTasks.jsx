import { useEffect, useState } from 'react';
import api from '../../lib/api.js';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout, User as UserIcon, Calendar, Coins, Trash2, Search } from 'lucide-react';
import Swal from 'sweetalert2';

export default function ManageTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const { data } = await api.get('/tasks/admin/all');
      setTasks(data);
    } catch (_) {
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    const result = await Swal.fire({
      title: 'Delete Task?',
      text: `Are you sure you want to remove "${title}"? This will permanently delete the task and its data.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, Delete',
      background: '#1e293b',
      color: '#f1f5f9'
    });

    if (result.isConfirmed) {
      try {
        await api.delete('/tasks/' + id);
        setTasks((prev) => prev.filter((t) => t._id !== id));
        Swal.fire({
          icon: 'success',
          title: 'Task Deleted',
          background: '#1e293b',
          color: '#f1f5f9'
        });
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to delete task.',
          background: '#1e293b',
          color: '#f1f5f9'
        });
      }
    }
  };

  const filteredTasks = tasks.filter(t =>
    t.task_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.buyer_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-white tracking-tight">Active Tasks</h1>
          <p className="text-slate-400 mt-1">Monitor and moderate all tasks posted on the platform.</p>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input
            type="text"
            placeholder="Search by title or buyer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-800/50 border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/5 bg-slate-900/50 backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-800/50 text-slate-400 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Task Info</th>
                <th className="px-6 py-4">Buyer</th>
                <th className="px-6 py-4">Required</th>
                <th className="px-6 py-4">Reward</th>
                <th className="px-6 py-4">Deadline</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <AnimatePresence mode="popLayout">
                {filteredTasks.map((t, i) => (
                  <motion.tr
                    key={t._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.02 }}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4 max-w-[250px]">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-brand-500/10 flex items-center justify-center text-brand-400 shrink-0">
                          <Layout size={20} />
                        </div>
                        <span className="text-white font-medium truncate">{t.task_title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-300 text-sm">
                        <UserIcon size={14} className="text-slate-500" />
                        {t.buyer_name}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-blue-400 font-bold">{t.required_workers}</span>
                      <span className="text-slate-500 text-xs ml-1">workers</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                        <Coins size={14} />
                        {t.payable_amount}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-400 text-sm">
                        <Calendar size={14} />
                        {new Date(t.completion_date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(t._id, t.task_title)}
                        className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-300"
                        title="Delete Task"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
