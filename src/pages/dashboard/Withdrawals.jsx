import { useEffect, useState } from 'react';
import api from '../../lib/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { motion } from 'framer-motion';

const COINS_PER_DOLLAR = 20;
const MIN_COINS = 200;

export default function Withdrawals() {
  const { user, setUser } = useAuth();
  const [coin, setCoin] = useState('');
  const [paymentSystem, setPaymentSystem] = useState('Stripe');
  const [accountNumber, setAccountNumber] = useState('');
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const coinNum = Number(coin) || 0;
  const dollarAmount = (coinNum / COINS_PER_DOLLAR).toFixed(2);
  const totalCoin = user?.coin ?? 0;
  const withdrawDollar = (totalCoin / COINS_PER_DOLLAR).toFixed(2);
  const canWithdraw = totalCoin >= MIN_COINS;

  useEffect(() => {
    api.get('/withdrawals/worker/mine').then(({ data }) => setList(data)).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (coinNum < MIN_COINS) {
      setMsg(`Minimum withdrawal is ${MIN_COINS} coins.`);
      return;
    }
    if (coinNum > totalCoin) {
      setMsg('Insufficient coins.');
      return;
    }
    setLoading(true);
    setMsg('');
    try {
      await api.post('/withdrawals', {
        withdrawal_coin: coinNum,
        payment_system: paymentSystem,
        account_number: accountNumber,
      });
      setMsg('Withdrawal request submitted. You will be notified when processed.');
      setCoin('');
      setAccountNumber('');
      const { data: me } = await api.get('/auth/me');
      setUser(me);
      const { data: newList } = await api.get('/withdrawals/worker/mine');
      setList(newList);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Request failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-amber-400">Withdrawals</h1>
      <p className="text-slate-400 text-sm">20 coins = $1. Minimum 200 coins ($10) to withdraw.</p>
      <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
        <p className="text-slate-300">Your current coin: <strong className="text-amber-400">{totalCoin}</strong></p>
        <p className="text-slate-300 mt-1">Withdrawal amount: <strong className="text-amber-400">${withdrawDollar}</strong></p>
      </div>
      {canWithdraw ? (
        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onSubmit={handleSubmit}
          className="bg-slate-800 rounded-xl border border-slate-700 p-6 space-y-4"
        >
          <h3 className="font-semibold text-slate-200">Withdrawal Form</h3>
          {msg && <p className={`text-sm ${msg.includes('submitted') ? 'text-green-400' : 'text-red-400'}`}>{msg}</p>}
          <div>
            <label className="block text-sm text-slate-400 mb-1">Coin to withdraw</label>
            <input
              type="number"
              min={MIN_COINS}
              max={totalCoin}
              value={coin}
              onChange={(e) => setCoin(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-slate-900 border border-slate-600 text-slate-100"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Withdraw amount ($)</label>
            <input type="text" value={dollarAmount} readOnly className="w-full px-4 py-2 rounded-lg bg-slate-900/50 border border-slate-600 text-slate-400" />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Payment system</label>
            <select
              value={paymentSystem}
              onChange={(e) => setPaymentSystem(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-slate-900 border border-slate-600 text-slate-100"
            >
              <option value="Stripe">Stripe</option>
              <option value="Bkash">Bkash</option>
              <option value="Rocket">Rocket</option>
              <option value="Nagad">Nagad</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Account number</label>
            <input
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="Account or email for payout"
              className="w-full px-4 py-2 rounded-lg bg-slate-900 border border-slate-600 text-slate-100"
            />
          </div>
          <button
            type="submit"
            disabled={loading || coinNum < MIN_COINS || coinNum > totalCoin}
            className="w-full py-3 bg-amber-500 text-slate-900 font-semibold rounded-lg hover:bg-amber-400 transition disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Withdraw'}
          </button>
        </motion.form>
      ) : (
        <p className="text-amber-400 bg-amber-500/10 rounded-lg p-4">Insufficient coin. You need at least 200 coins ($10) to withdraw.</p>
      )}
      <section>
        <h3 className="font-semibold text-slate-200 mb-3">Withdrawal History</h3>
        <div className="overflow-x-auto rounded-lg border border-slate-700">
          <table className="w-full text-sm">
            <thead className="bg-slate-800 text-slate-300">
              <tr>
                <th className="px-4 py-3 text-left">Amount</th>
                <th className="px-4 py-3 text-left">Payment</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {list.length === 0 && <tr><td colSpan={4} className="px-4 py-6 text-slate-500 text-center">No withdrawals yet.</td></tr>}
              {list.map((w) => (
                <tr key={w._id} className="bg-slate-800/50">
                  <td className="px-4 py-3">{w.withdrawal_coin} coins (${w.withdrawal_amount})</td>
                  <td className="px-4 py-3">{w.payment_system}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-1 rounded ${w.status === 'approved' ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'}`}>{w.status}</span></td>
                  <td className="px-4 py-3 text-slate-400">{new Date(w.withdraw_date).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
