import { useAuth } from '../../context/AuthContext.jsx';
import { motion } from 'framer-motion';

export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="space-y-6 max-w-md">
      <h1 className="text-2xl font-bold text-amber-400">Profile</h1>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-800 rounded-xl border border-slate-700 p-6 flex flex-col items-center text-center"
      >
        <img
          src={user?.photoURL || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user?.name || 'U')}
          alt=""
          className="w-24 h-24 rounded-full object-cover border-2 border-amber-500/50"
        />
        <h2 className="mt-4 text-xl font-semibold text-slate-200">{user?.name}</h2>
        <p className="text-slate-400 text-sm">{user?.email}</p>
        <p className="mt-2 capitalize text-amber-400 font-medium">{user?.role}</p>
        <p className="mt-2 text-slate-300">Available coins: <strong className="text-amber-400">{user?.coin ?? 0}</strong></p>
      </motion.div>
    </div>
  );
}
