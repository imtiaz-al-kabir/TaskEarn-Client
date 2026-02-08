import { useEffect, useState } from 'react';
import api from '../../lib/api.js';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Shield, Briefcase, Trash2, Mail, Coins as CoinIcon } from 'lucide-react';
import Swal from 'sweetalert2';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/users');
      setUsers(data);
    } catch (_) {
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (email, name, role) => {
    try {
      await api.patch('/users/' + encodeURIComponent(email) + '/role', { role });
      setUsers((prev) => prev.map((u) => (u.email === email ? { ...u, role } : u)));
      Swal.fire({
        icon: 'success',
        title: 'Role Updated',
        text: `${name}'s role is now ${role}.`,
        timer: 1500,
        showConfirmButton: false,
        background: '#1e293b',
        color: '#f1f5f9'
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: 'Could not update user role.',
        background: '#1e293b',
        color: '#f1f5f9'
      });
    }
  };

  const handleRemove = async (email, name) => {
    const result = await Swal.fire({
      title: 'Remove User?',
      text: `Are you sure you want to delete ${name} permanently? This cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, Remove',
      background: '#1e293b',
      color: '#f1f5f9'
    });

    if (result.isConfirmed) {
      try {
        await api.delete('/users/' + encodeURIComponent(email));
        setUsers((prev) => prev.filter((u) => u.email !== email));
        Swal.fire({
          icon: 'success',
          title: 'User Removed',
          text: 'Account has been deleted from the database.',
          background: '#1e293b',
          color: '#f1f5f9'
        });
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Action Failed',
          text: 'Could not remove user.',
          background: '#1e293b',
          color: '#f1f5f9'
        });
      }
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin': return <Shield size={14} className="text-purple-400" />;
      case 'buyer': return <Briefcase size={14} className="text-blue-400" />;
      default: return <User size={14} className="text-amber-400" />;
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-display font-bold text-white tracking-tight">User Management</h1>
        <p className="text-slate-400 mt-1">Directly control user access levels and roles.</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/5 bg-slate-900/50 backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-800/50 text-slate-400 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Balances</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <AnimatePresence mode="popLayout">
                {users.map((u, i) => (
                  <motion.tr
                    key={u.email}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: i * 0.03 }}
                    className="hover:bg-white/5 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={u.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=random`}
                          alt=""
                          className="w-10 h-10 rounded-xl object-cover ring-2 ring-white/5"
                        />
                        <div className="flex flex-col">
                          <span className="text-white font-bold">{u.name}</span>
                          <span className="text-slate-500 text-xs flex items-center gap-1">
                            <Mail size={12} /> {u.email}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="relative inline-block">
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u.email, u.name, e.target.value)}
                          className="appearance-none bg-slate-800/80 border border-white/5 text-xs text-white px-8 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/50 cursor-pointer hover:bg-slate-700 transition-colors uppercase font-bold tracking-wider"
                        >
                          <option value="worker">Worker</option>
                          <option value="buyer">Buyer</option>
                          <option value="admin">Admin</option>
                        </select>
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                          {getRoleIcon(u.role)}
                        </div>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none border-l border-white/10 pl-2">
                          <div className="w-1 h-1 bg-slate-400 rotate-45" />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-amber-400 font-bold flex items-center gap-1.5">
                        <CoinIcon size={16} /> {u.coin.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleRemove(u.email, u.name)}
                        className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-300"
                        title="Delete User"
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
