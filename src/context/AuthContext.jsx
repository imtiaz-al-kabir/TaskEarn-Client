import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase.js';
import api from '../lib/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const u = localStorage.getItem('user');
      const parsed = u ? JSON.parse(u) : null;
      if (parsed && parsed.role) parsed.role = parsed.role.toLowerCase();
      return parsed;
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
            const userData = { ...data, role: data.role?.toLowerCase() };
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
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
          const userData = { ...data, role: data.role?.toLowerCase(), uid: firebaseUser.uid };
          console.log('AuthContext: User logged in', userData);
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
        } catch (e) {
          console.error('AuthContext: API fetch failed', e);
          const stored = localStorage.getItem('user');
          const savedRole = stored ? JSON.parse(stored).role?.toLowerCase() : undefined;
          setUser({
            email: firebaseUser.email,
            name: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            role: savedRole
          });
        }
      } else {
        const token = localStorage.getItem('accessToken');
        const stored = localStorage.getItem('user');
        if (stored && token) {
          try {
            const { data } = await api.get('/auth/me');
            const userData = { ...data, role: data.role?.toLowerCase() };
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
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
