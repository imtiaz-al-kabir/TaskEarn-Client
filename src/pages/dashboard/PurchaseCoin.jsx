import { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import api from '../../lib/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import { Coins } from 'lucide-react';
import Swal from 'sweetalert2';

const stripePromise = import.meta.env.VITE_STRIPE_PK ? loadStripe(import.meta.env.VITE_STRIPE_PK) : null;

function CheckoutForm({ pkg, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // We pass the price to help identify the package index if needed, 
    // but the backend expects packageIndex.
    // However, the backend packages are static, so we can send the index.
    // Let's find the index in the fetched packages. (passed as pkg)
    api.post('/payments/create-payment-intent', { packageIndex: pkg.index })
      .then(({ data }) => {
        setClientSecret(data.clientSecret);
      })
      .catch((err) => {
        console.error('Payment Error:', err);
        setError('Failed to initialize payment.');
      });
  }, [pkg]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || !clientSecret) return;

    setLoading(true);
    setError('');

    try {
      const { paymentIntent, error: stripeError } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (stripeError) {
        setError(stripeError.message);
      } else if (paymentIntent.status === 'succeeded') {
        // Success! Confirm on backend to update coins
        await api.post('/payments/confirm', {
          coins: pkg.coins,
          amount: pkg.price,
          paymentIntentId: paymentIntent.id
        });

        Swal.fire({
          icon: 'success',
          title: 'Payment Successful',
          text: `${pkg.coins} coins have been added to your account!`,
          background: '#1e293b',
          color: '#f1f5f9',
          confirmButtonColor: '#3b82f6'
        });

        onSuccess();
      }
    } catch (err) {
      setError('An error occurred during payment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 p-4 rounded-lg bg-slate-900/50 border border-slate-700 space-y-4">
      <div className="p-3 bg-slate-800 rounded-lg border border-slate-600">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#e2e8f0',
                '::placeholder': { color: '#94a3b8' },
              },
              invalid: { color: '#f87171' },
            },
          }}
        />
      </div>
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={!stripe || loading || !clientSecret}
        className="w-full py-2.5 rounded-lg bg-brand-500 text-white font-semibold hover:bg-brand-600 disabled:opacity-50 transition-colors shadow-lg shadow-brand-500/20"
      >
        {loading ? 'Processing...' : `Pay $${pkg.price}`}
      </button>
    </form>
  );
}

function PackageCard({ pkg, onSelect }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-slate-800 rounded-xl border border-slate-700 p-6 text-center transition cursor-pointer shadow-xl hover:border-brand-500/50 group"
      onClick={() => onSelect(pkg)}
    >
      <div className="w-12 h-12 bg-brand-500/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-brand-500/20 transition-colors">
        <Coins className="text-brand-400" size={24} />
      </div>
      <p className="text-3xl font-bold text-white font-display">{pkg.coins}</p>
      <p className="text-brand-400 font-medium text-sm uppercase tracking-wider mb-4">Coins</p>
      <div className="pt-4 border-t border-slate-700">
        <p className="text-2xl font-bold text-white">${pkg.price}</p>
        <p className="text-slate-500 text-xs mt-1">Single payment</p>
      </div>
      <button className="mt-6 w-full py-2 bg-slate-700 text-white rounded-lg text-sm font-semibold group-hover:bg-brand-500 transition-colors">
        Select Package
      </button>
    </motion.div>
  );
}

export default function PurchaseCoin() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPkg, setSelectedPkg] = useState(null);
  const { setUser } = useAuth();

  useEffect(() => {
    api.get('/payments/packages')
      .then(({ data }) => setPackages(data.map((p, i) => ({ ...p, index: i }))))
      .finally(() => setLoading(false));
  }, []);

  const handleSuccess = async () => {
    const { data } = await api.get('/auth/me');
    setUser(data);
    setSelectedPkg(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  if (selectedPkg) {
    return (
      <div className="max-w-xl mx-auto space-y-8 pb-12">
        <button
          onClick={() => setSelectedPkg(null)}
          className="text-slate-400 hover:text-white flex items-center gap-2 text-sm font-medium transition-colors"
        >
          ← Back to packages
        </button>

        <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden shadow-2xl">
          <div className="bg-slate-700/50 p-6 border-b border-slate-700">
            <h2 className="text-xl font-bold text-white">Complete Purchase</h2>
            <p className="text-slate-400 text-sm mt-1">Secure card payment via Stripe</p>
          </div>

          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl border border-slate-700">
              <div>
                <p className="text-slate-400 text-xs uppercase tracking-wider font-bold">Selected Package</p>
                <p className="text-xl font-bold text-white mt-1">{selectedPkg.coins} Coins</p>
              </div>
              <div className="text-right">
                <p className="text-slate-400 text-xs uppercase tracking-wider font-bold">Total Amount</p>
                <p className="text-2xl font-bold text-brand-400 mt-1">${selectedPkg.price}</p>
              </div>
            </div>

            {stripePromise ? (
              <Elements stripe={stripePromise}>
                <CheckoutForm pkg={selectedPkg} onSuccess={handleSuccess} />
              </Elements>
            ) : (
              <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-center">
                Stripe Configuration Error: Please check your environment variables.
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 max-w-6xl mx-auto pb-12">
      <div className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-block px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-bold uppercase tracking-widest"
        >
          Top-up wallet
        </motion.div>
        <h1 className="text-4xl font-bold text-white font-display tracking-tight sm:text-5xl">Increase your potential</h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg">Choose the best coin package for your tasks. More coins mean more productivity and faster results.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {packages.map((pkg, i) => (
          <PackageCard key={i} pkg={pkg} onSelect={setSelectedPkg} />
        ))}
      </div>
    </div>
  );
}
