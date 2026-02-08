import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../lib/firebase.js';
import api from '../lib/api.js';
import { uploadImage, hasImgBB } from '../lib/imgbb.js';
import { motion } from 'framer-motion';

const passwordStrength = (p) => {
  let score = 0;
  if (p.length >= 8) score++;
  if (/[A-Z]/.test(p)) score++;
  if (/[a-z]/.test(p)) score++;
  if (/[0-9]/.test(p)) score++;
  if (/[^A-Za-z0-9]/.test(p)) score++;
  return score;
};

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('worker');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !hasImgBB()) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      if (url) setPhotoURL(url);
    } catch (_) {}
    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!auth) {
      setError('Firebase is not configured. Add VITE_FIREBASE_* to client .env');
      return;
    }
    if (!name.trim()) {
      setError('Please enter your name.');
      return;
    }
    if (!email.trim()) {
      setError('Please enter your email.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (passwordStrength(password) < 3) {
      setError('Password must be at least 8 characters and include uppercase, lowercase, and a number.');
      return;
    }
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
      if (name.trim()) await updateProfile(cred.user, { displayName: name.trim(), photoURL: photoURL || undefined });
      const token = await cred.user.getIdToken();
      localStorage.setItem('accessToken', token);
      const { data } = await api.post('/users/register-db', {
        email: cred.user.email,
        name: name.trim(),
        photoURL: photoURL.trim() || cred.user.photoURL || '',
        role,
      });
      localStorage.setItem('user', JSON.stringify({
        email: cred.user.email,
        name: name.trim(),
        photoURL: photoURL.trim() || cred.user.photoURL || '',
        role,
        coin: data.coin ?? (role === 'worker' ? 10 : 50),
      }));
      navigate('/dashboard', { replace: true });
      window.location.reload();
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Try logging in.');
      } else {
        setError(err.message || 'Registration failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-slate-800/50 rounded-2xl border border-slate-700 p-6 md:p-8"
      >
        <h1 className="text-2xl font-bold text-amber-400 text-center mb-6">Register</h1>
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-slate-900 border border-slate-600 text-slate-100 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-slate-900 border border-slate-600 text-slate-100 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="your@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Profile Picture URL</label>
            {hasImgBB() && (
              <div className="mb-2">
                <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} className="text-sm text-slate-400 file:mr-2 file:py-1 file:px-3 file:rounded file:bg-amber-500 file:text-slate-900 file:border-0" />
                {uploading && <span className="text-slate-500 text-xs ml-2">Uploading...</span>}
              </div>
            )}
            <input
              type="url"
              value={photoURL}
              onChange={(e) => setPhotoURL(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-slate-900 border border-slate-600 text-slate-100 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="https://... or upload above"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-slate-900 border border-slate-600 text-slate-100 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="Min 8 chars, mixed case & number"
            />
            {password && (
              <p className="mt-1 text-xs text-slate-500">
                Strength: {passwordStrength(password)}/5
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-slate-900 border border-slate-600 text-slate-100 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="worker">Worker</option>
              <option value="buyer">Buyer</option>
            </select>
            <p className="mt-1 text-xs text-slate-500">
              Worker: 10 coins. Buyer: 50 coins on signup.
            </p>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-amber-500 text-slate-900 font-semibold rounded-lg hover:bg-amber-400 transition disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <p className="mt-6 text-center text-slate-400 text-sm">
          Already have an account? <Link to="/login" className="text-amber-400 hover:underline">Login</Link>
        </p>
      </motion.div>
    </div>
  );
}
