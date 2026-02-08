import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../lib/api.js';
import { Link } from 'react-router-dom';

export default function NotificationPopover() {
  const [open, setOpen] = useState(false);
  const [list, setList] = useState([]);
  const { user } = useAuth();
  const ref = useRef(null);

  useEffect(() => {
    if (!user) return;
    api.get('/notifications').then(({ data }) => setList(data)).catch(() => {});
  }, [user]);

  useEffect(() => {
    function close(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, []);

  if (!user) return null;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="p-2 rounded-full hover:bg-slate-700 text-slate-400 hover:text-amber-400 relative"
        aria-label="Notifications"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {list.length > 0 && (
          <span className="absolute top-0 right-0 w-2 h-2 bg-amber-500 rounded-full" />
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-auto rounded-lg border border-slate-700 bg-slate-800 shadow-xl z-50">
          <div className="p-2 border-b border-slate-700 font-medium text-sm">Notifications</div>
          {list.length === 0 ? (
            <div className="p-4 text-slate-500 text-sm">No notifications</div>
          ) : (
            <ul className="divide-y divide-slate-700">
              {list.map((n) => (
                <li key={n._id}>
                  <Link
                    to={n.actionRoute || '/dashboard'}
                    onClick={() => setOpen(false)}
                    className="block p-3 text-sm hover:bg-slate-700/50 transition"
                  >
                    <p className="text-slate-200">{n.message}</p>
                    <p className="text-slate-500 text-xs mt-1">
                      {n.time ? new Date(n.time).toLocaleString() : ''}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
