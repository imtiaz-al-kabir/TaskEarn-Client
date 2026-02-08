import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../lib/api.js';
import { motion } from 'framer-motion';

export default function TaskList() {
  const [data, setData] = useState({ tasks: [], total: 0 });
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ rewardMin: '', rewardMax: '' });

  useEffect(() => {
    const params = new URLSearchParams({ page, limit: 12 });
    if (search) params.set('search', search);
    if (filters.rewardMin) params.set('rewardMin', filters.rewardMin);
    if (filters.rewardMax) params.set('rewardMax', filters.rewardMax);
    api.get('/tasks?' + params).then(({ data: d }) => setData(d)).catch(() => {});
  }, [page, search, filters.rewardMin, filters.rewardMax]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-amber-400">Task List</h1>
      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="search"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search tasks..."
          className="flex-1 px-4 py-2 rounded-lg bg-slate-800 border border-slate-600 text-slate-100"
        />
        <input
          type="number"
          value={filters.rewardMin}
          onChange={(e) => { setFilters((f) => ({ ...f, rewardMin: e.target.value })); setPage(1); }}
          placeholder="Min coins"
          className="w-28 px-4 py-2 rounded-lg bg-slate-800 border border-slate-600 text-slate-100"
        />
        <input
          type="number"
          value={filters.rewardMax}
          onChange={(e) => { setFilters((f) => ({ ...f, rewardMax: e.target.value })); setPage(1); }}
          placeholder="Max coins"
          className="w-28 px-4 py-2 rounded-lg bg-slate-800 border border-slate-600 text-slate-100"
        />
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.tasks.map((t, i) => (
          <motion.div
            key={t._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden"
          >
            {t.task_image_url && (
              <img src={t.task_image_url} alt="" className="w-full h-40 object-cover" />
            )}
            <div className="p-4">
              <h3 className="font-semibold text-slate-200 truncate">{t.task_title}</h3>
              <p className="text-sm text-slate-400 mt-1">Buyer: {t.buyer_name}</p>
              <p className="text-sm text-slate-400">Deadline: {new Date(t.completion_date).toLocaleDateString()}</p>
              <p className="text-amber-400 font-medium mt-2">{t.payable_amount} coins each</p>
              <p className="text-sm text-slate-500">Workers needed: {t.required_workers}</p>
              <Link
                to={`/dashboard/task-details/${t._id}`}
                className="mt-3 inline-block px-4 py-2 bg-amber-500 text-slate-900 font-medium rounded-lg hover:bg-amber-400 transition text-sm"
              >
                View Details
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
      {data.total > 12 && (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="px-4 py-2 rounded-lg bg-slate-700 text-slate-200 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-slate-400">Page {page}</span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page * 12 >= data.total}
            className="px-4 py-2 rounded-lg bg-slate-700 text-slate-200 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
