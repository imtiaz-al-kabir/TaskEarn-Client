import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase.js';
import api from '../lib/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const u = localStorage.getItem('user');
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      const token = localStorage.getItem('accessToken');
      const stored = localStorage.getItem('user');
      if (stored && token) {
        api.get('/auth/me')
          .then(({ data }) => {
            setUser({ ...data, role: data.role?.toLowerCase() });
            localStorage.setItem('user', JSON.stringify({ ...data, role: data.role?.toLowerCase() }));
          })
          .catch(() => {
            setUser(null);
            localStorage.removeItem('user');
            localStorage.removeItem('accessToken');
          })
          .finally(() => setLoading(false));
      } else {
        setUser(null);
        setLoading(false);
      }
      return;
    }
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const token = await firebaseUser.getIdToken();
        localStorage.setItem('accessToken', token);
        try {
          const { data } = await api.get('/auth/me');
          setUser({ ...data, role: data.role?.toLowerCase(), uid: firebaseUser.uid });
          localStorage.setItem('user', JSON.stringify({ ...data, role: data.role?.toLowerCase(), uid: firebaseUser.uid }));
        } catch {
          setUser({ email: firebaseUser.email, name: firebaseUser.displayName, photoURL: firebaseUser.photoURL });
        }
      } else {
        const token = localStorage.getItem('accessToken');
        const stored = localStorage.getItem('user');
        if (stored && token) {
          try {
            const { data } = await api.get('/auth/me');
            setUser({ ...data, role: data.role?.toLowerCase() });
            localStorage.setItem('user', JSON.stringify({ ...data, role: data.role?.toLowerCase() }));
          } catch {
            setUser(null);
            localStorage.removeItem('user');
            localStorage.removeItem('accessToken');
          }
        } else {
          setUser(null);
          if (!token) localStorage.removeItem('user');
        }
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
