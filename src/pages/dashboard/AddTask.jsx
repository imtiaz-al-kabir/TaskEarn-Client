import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/api.js';
import { uploadImage, hasImgBB } from '../../lib/imgbb.js';
import { motion } from 'framer-motion';

export default function AddTask() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    task_title: '',
    task_detail: '',
    required_workers: '',
    payable_amount: '',
    completion_date: '',
    submission_info: '',
    task_image_url: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadingImg, setUploadingImg] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !hasImgBB()) return;
    setUploadingImg(true);
    try {
      const url = await uploadImage(file);
      if (url) setForm((f) => ({ ...f, task_image_url: url }));
    } catch (_) {}
    setUploadingImg(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const required_workers = Number(form.required_workers);
    const payable_amount = Number(form.payable_amount);
    const total = required_workers * payable_amount;
    if (!form.task_title.trim()) {
      setError('Please enter task title.');
      return;
    }
    if (!form.task_detail.trim()) {
      setError('Please enter task detail.');
      return;
    }
    if (required_workers < 1) {
      setError('Required workers must be at least 1.');
      return;
    }
    if (payable_amount < 1) {
      setError('Payable amount must be at least 1.');
      return;
    }
    if (!form.completion_date) {
      setError('Please select completion date.');
      return;
    }
    if (!form.submission_info.trim()) {
      setError('Please enter submission info.');
      return;
    }
    setLoading(true);
    try {
      const { data: user } = await api.get('/auth/me');
      if (user.coin < total) {
        setError('Not enough coins. Purchase coins first.');
        setLoading(false);
        navigate('/dashboard/purchase-coin');
        return;
      }
      await api.post('/tasks', {
        ...form,
        required_workers,
        payable_amount,
        completion_date: new Date(form.completion_date).toISOString(),
      });
      setForm({ task_title: '', task_detail: '', required_workers: '', payable_amount: '', completion_date: '', submission_info: '', task_image_url: '' });
      setError('');
      navigate('/dashboard/my-tasks');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add task.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-amber-400">Add New Task</h1>
      <motion.form
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onSubmit={handleSubmit}
        className="bg-slate-800 rounded-xl border border-slate-700 p-6 space-y-4"
      >
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <div>
          <label className="block text-sm text-slate-400 mb-1">Task Title</label>
          <input
            name="task_title"
            value={form.task_title}
            onChange={handleChange}
            placeholder="e.g. Watch my YouTube video and comment"
            className="w-full px-4 py-2 rounded-lg bg-slate-900 border border-slate-600 text-slate-100"
          />
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-1">Task Detail</label>
          <textarea
            name="task_detail"
            value={form.task_detail}
            onChange={handleChange}
            rows={3}
            placeholder="Detailed description of the task"
            className="w-full px-4 py-2 rounded-lg bg-slate-900 border border-slate-600 text-slate-100 resize-none"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1">Required Workers</label>
            <input
              type="number"
              name="required_workers"
              value={form.required_workers}
              onChange={handleChange}
              min={1}
              placeholder="e.g. 100"
              className="w-full px-4 py-2 rounded-lg bg-slate-900 border border-slate-600 text-slate-100"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Payable Amount (coins per worker)</label>
            <input
              type="number"
              name="payable_amount"
              value={form.payable_amount}
              onChange={handleChange}
              min={1}
              placeholder="e.g. 10"
              className="w-full px-4 py-2 rounded-lg bg-slate-900 border border-slate-600 text-slate-100"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-1">Completion Date (Deadline)</label>
          <input
            type="datetime-local"
            name="completion_date"
            value={form.completion_date}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-slate-900 border border-slate-600 text-slate-100"
          />
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-1">Submission Info (what to submit)</label>
          <input
            name="submission_info"
            value={form.submission_info}
            onChange={handleChange}
            placeholder="e.g. Screenshot of comment, link to your comment"
            className="w-full px-4 py-2 rounded-lg bg-slate-900 border border-slate-600 text-slate-100"
          />
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-1">Task Image URL</label>
          {hasImgBB() && (
            <div className="mb-2">
              <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploadingImg} className="text-sm text-slate-400 file:mr-2 file:py-1 file:px-3 file:rounded file:bg-amber-500 file:text-slate-900 file:border-0" />
              {uploadingImg && <span className="text-slate-500 text-xs ml-2">Uploading...</span>}
            </div>
          )}
          <input
            type="url"
            name="task_image_url"
            value={form.task_image_url}
            onChange={handleChange}
            placeholder="https://... or upload above"
            className="w-full px-4 py-2 rounded-lg bg-slate-900 border border-slate-600 text-slate-100"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-amber-500 text-slate-900 font-semibold rounded-lg hover:bg-amber-400 transition disabled:opacity-50"
        >
          {loading ? 'Adding...' : 'Add Task'}
        </button>
      </motion.form>
    </div>
  );
}
