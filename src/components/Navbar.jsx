import { Link, useNavigate, useLocation } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase.js';
import { useAuth } from '../context/AuthContext.jsx';
import { LayoutDashboard, LogOut, User, Coins, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

export default function Navbar() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    if (auth) {
      try {
        await signOut(auth);
      } catch (_) { }
    }
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={clsx(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 py-3',
          isScrolled ? 'glass border-b border-white/5 bg-dark-950/80' : 'bg-transparent'
        )}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform">
              T
            </div>
            <span className="font-display font-bold text-xl tracking-wide text-white group-hover:text-brand-400 transition-colors">
              TaskEarn
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="text-sm font-medium text-slate-300 hover:text-brand-400 transition-colors relative group"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-400 transition-all group-hover:w-full" />
                </Link>
              ))}
            </div>

            <div className="h-6 w-px bg-white/10" />

            <div className="flex items-center gap-4">
              <a
                href="https://github.com/imtiaz-al-kabir/react-increment"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-sm !px-4 !py-2 border-brand-500/30 hover:border-brand-500"
              >
                Join as Developer
              </a>

              {user ? (
                <>
                  <Link to="/dashboard" className="btn-secondary flex items-center gap-2 text-sm !px-4 !py-2">
                    <LayoutDashboard size={16} />
                    <span>Dashboard</span>
                  </Link>

                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-dark-800/50 border border-white/5">
                    <Coins size={14} className="text-brand-400" />
                    <span className="text-sm font-bold text-brand-400">{user.coin ?? 0}</span>
                  </div>

                  <Link to="/dashboard/profile" className="relative group">
                    <img
                      src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=random`}
                      alt="Profile"
                      className="w-9 h-9 rounded-full object-cover border-2 border-transparent group-hover:border-brand-400 transition-all"
                    />
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-full hover:bg-white/5 text-slate-400 hover:text-red-400 transition-colors"
                    title="Logout"
                  >
                    <LogOut size={18} />
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                    Log In
                  </Link>
                  <Link to="/register" className="btn-primary text-sm !px-5 !py-2">
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-slate-300 hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed top-16 left-0 right-0 z-40 bg-dark-950/95 backdrop-blur-xl border-b border-white/5 overflow-hidden md:hidden"
          >
            <div className="p-4 flex flex-col gap-4">
              {user ? (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                    <img src={user.photoURL} className="w-10 h-10 rounded-full" alt="" />
                    <div>
                      <p className="font-bold text-white">{user.name}</p>
                      <p className="text-xs text-brand-400">{user.coin} Coins</p>
                    </div>
                  </div>
                  <Link to="/dashboard" className="btn-secondary w-full justify-center">Dashboard</Link>
                  <a href="https://github.com/imtiaz-al-kabir/react-increment" target="_blank" rel="noopener noreferrer" className="btn-secondary w-full justify-center border-brand-500/30 text-brand-400">Join as Developer</a>
                  <button onClick={handleLogout} className="btn-secondary w-full justify-center text-red-400 hover:bg-red-500/10 hover:text-red-300">Logout</button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Link to="/login" className="btn-secondary justify-center text-center">Log In</Link>
                  <Link to="/register" className="btn-primary justify-center text-center">Register</Link>
                  <a href="https://github.com/imtiaz-al-kabir/react-increment" target="_blank" rel="noopener noreferrer" className="col-span-2 btn-secondary justify-center text-center border-brand-500/30 text-brand-400">Join as Developer</a>
                </div>
              )}
              <div className="h-px bg-white/10 my-2" />
              {navLinks.map(link => (
                <Link key={link.name} to={link.path} className="text-slate-300 py-2 hover:text-brand-400" onClick={() => setMobileMenuOpen(false)}>
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
