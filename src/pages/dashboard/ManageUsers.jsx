import { useEffect, useState } from 'react';
import api from '../../lib/api.js';
import { motion } from 'framer-motion';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [roleEdit, setRoleEdit] = useState(null);

  useEffect(() => {
    api.get('/users').then(({ data }) => setUsers(data)).catch(() => {});
  }, []);

  const handleRoleChange = async (email, role) => {
    try {
      await api.patch('/users/' + encodeURIComponent(email) + '/role', { role });
      setUsers((prev) => prev.map((u) => (u.email === email ? { ...u, role } : u)));
      setRoleEdit(null);
    } catch (_) {}
  };

  const handleRemove = async (email) => {
    if (!confirm('Remove this user from the database?')) return;
    try {
      await api.delete('/users/' + encodeURIComponent(email));
      setUsers((prev) => prev.filter((u) => u.email !== email));
    } catch (_) {}
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-amber-400">Manage Users</h1>
      <div className="overflow-x-auto rounded-lg border border-slate-700">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-800 text-slate-300">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Photo</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Coin</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {users.map((u) => (
              <tr key={u.email} className="bg-slate-800/50 hover:bg-slate-800">
                <td className="px-4 py-3 text-slate-200">{u.name}</td>
                <td className="px-4 py-3 text-slate-300 truncate max-w-[180px]">{u.email}</td>
                <td className="px-4 py-3">
                  <img src={u.photoURL || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(u.name)} alt="" className="w-8 h-8 rounded-full object-cover" />
                </td>
                <td className="px-4 py-3">
                  {roleEdit === u.email ? (
                    <select
                      defaultValue={u.role}
                      onChange={(e) => handleRoleChange(u.email, e.target.value)}
                      onBlur={() => setRoleEdit(null)}
                      className="bg-slate-900 border border-slate-600 rounded text-slate-100 px-2 py-1"
                    >
                      <option value="admin">Admin</option>
                      <option value="buyer">Buyer</option>
                      <option value="worker">Worker</option>
                    </select>
                  ) : (
                    <span className="capitalize text-amber-400">{u.role}</span>
                  )}
                </td>
                <td className="px-4 py-3 text-slate-300">{u.coin}</td>
                <td className="px-4 py-3 flex gap-2">
                  <button onClick={() => setRoleEdit(u.email)} className="px-3 py-1 rounded bg-amber-600 text-slate-900 text-xs hover:bg-amber-500">Update Role</button>
                  <button onClick={() => handleRemove(u.email)} className="px-3 py-1 rounded bg-red-600 text-white text-xs hover:bg-red-500">Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
