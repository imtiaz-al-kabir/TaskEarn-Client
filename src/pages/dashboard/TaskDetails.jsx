import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../lib/api.js';
import { motion } from 'framer-motion';

export default function TaskDetails() {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [details, setDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (!id) return;
    api.get('/tasks/' + id).then(({ data }) => setTask(data)).catch(() => setTask(null));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!details.trim()) {
      setMsg('Please enter submission details.');
      return;
    }
    setLoading(true);
    setMsg('');
    try {
      await api.post('/submissions', { task_id: id, submission_details: details.trim() });
      setMsg('Submission sent successfully.');
      setDetails('');
      setTask((t) => t ? { ...t, required_workers: t.required_workers - 1 } : null);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Submission failed.');
    } finally {
      setLoading(false);
    }
  };

  if (!task) return <div className="text-slate-400">Loading...</div>;

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-2xl font-bold text-amber-400">Task Details</h1>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden"
      >
        {task.task_image_url && (
          <img src={task.task_image_url} alt="" className="w-full h-48 object-cover" />
        )}
        <div className="p-6">
          <h2 className="text-xl font-semibold text-slate-200">{task.task_title}</h2>
          <p className="text-slate-400 mt-2">{task.task_detail}</p>
          <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
            <p><span className="text-slate-500">Buyer:</span> {task.buyer_name}</p>
            <p><span className="text-slate-500">Deadline:</span> {new Date(task.completion_date).toLocaleDateString()}</p>
            <p><span className="text-slate-500">Payable:</span> <span className="text-amber-400">{task.payable_amount} coins</span></p>
            <p><span className="text-slate-500">Workers needed:</span> {task.required_workers}</p>
          </div>
          <p className="mt-2 text-sm text-slate-400"><span className="text-slate-500">What to submit:</span> {task.submission_info}</p>
        </div>
      </motion.div>
      {task.required_workers > 0 && (
        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onSubmit={handleSubmit}
          className="bg-slate-800 rounded-xl border border-slate-700 p-6"
        >
          <h3 className="font-semibold text-slate-200 mb-3">Submit Your Work</h3>
          {msg && (
            <p className={`mb-3 text-sm ${msg.includes('success') ? 'text-green-400' : 'text-red-400'}`}>{msg}</p>
          )}
          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            rows={4}
            placeholder="Paste your submission (e.g. screenshot link, comment proof)..."
            className="w-full px-4 py-2 rounded-lg bg-slate-900 border border-slate-600 text-slate-100 resize-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="mt-3 px-6 py-2 bg-amber-500 text-slate-900 font-medium rounded-lg hover:bg-amber-400 transition disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </motion.form>
      )}
    </div>
  );
}
