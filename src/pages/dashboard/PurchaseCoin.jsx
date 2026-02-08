import { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import api from '../../lib/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { motion } from 'framer-motion';

const stripePromise = import.meta.env.VITE_STRIPE_PK ? loadStripe(import.meta.env.VITE_STRIPE_PK) : null;

const PACKAGES = [
  { coins: 10, price: 1 },
  { coins: 150, price: 10 },
  { coins: 500, price: 20 },
  { coins: 1000, price: 35 },
];

function CheckoutForm({ pkg, onSuccess }) {
  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.post('/payments/create-payment-intent', { packageIndex: PACKAGES.indexOf(pkg) })
      .then(({ data }) => {
        if (data.demo) {
          setError('Stripe not configured. Use demo payment.');
          return;
        }
        setClientSecret(data.clientSecret);
      })
      .catch(() => setError('Failed to create payment.'));
  }, [pkg]);

  const handleDemoPay = async () => {
    setLoading(true);
    setError('');
    try {
      await api.post('/payments/confirm', { coins: pkg.coins, amount: pkg.price });
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Payment failed.');
    } finally {
      setLoading(false);
    }
  };

  if (error && !clientSecret) {
    return (
      <div className="mt-4 p-4 rounded-lg bg-slate-800 border border-slate-700">
        <p className="text-slate-400 text-sm mb-2">Demo payment (no Stripe):</p>
        <button
          onClick={handleDemoPay}
          disabled={loading}
          className="px-4 py-2 rounded-lg bg-amber-500 text-slate-900 font-medium hover:bg-amber-400 disabled:opacity-50"
        >
          {loading ? 'Processing...' : `Confirm ${pkg.coins} coins for $${pkg.price}`}
        </button>
      </div>
    );
  }

  return null;
}

function PackageCard({ pkg, onSelect }) {
  const [showCheckout, setShowCheckout] = useState(false);
  const { setUser } = useAuth();

  const handleSuccess = async () => {
    const { data } = await api.get('/auth/me');
    setUser(data);
    setShowCheckout(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800 rounded-xl border border-slate-700 p-6 text-center hover:border-amber-500/50 transition cursor-pointer"
      onClick={() => setShowCheckout(true)}
    >
      <p className="text-2xl font-bold text-amber-400">{pkg.coins} coins</p>
      <p className="text-slate-400 mt-1">=</p>
      <p className="text-xl font-semibold text-slate-200">${pkg.price}</p>
      {showCheckout && (
        <div onClick={(e) => e.stopPropagation()}>
          <CheckoutForm pkg={pkg} onSuccess={handleSuccess} />
        </div>
      )}
    </motion.div>
  );
}

export default function PurchaseCoin() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-amber-400">Purchase Coin</h1>
      <p className="text-slate-400 text-sm">Click a package to pay. 10 coins = $1.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {PACKAGES.map((pkg, i) => (
          <PackageCard key={i} pkg={pkg} onSelect={() => {}} />
        ))}
      </div>
    </div>
  );
}
