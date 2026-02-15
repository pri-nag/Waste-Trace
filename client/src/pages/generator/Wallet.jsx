import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { HiCreditCard, HiArrowTrendingUp, HiArrowTrendingDown, HiPaperAirplane, HiBanknotes, HiCurrencyRupee } from 'react-icons/hi2';

export default function Wallet() {
    const { user, refreshProfile } = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [balance, setBalance] = useState({ balance: 0, totalEarned: 0 });
    const [loading, setLoading] = useState(true);
    const [showTransfer, setShowTransfer] = useState(false);
    const [showSell, setShowSell] = useState(false);
    const [transferForm, setTransferForm] = useState({ toEmail: '', amount: '' });
    const [sellAmount, setSellAmount] = useState('');
    const [msg, setMsg] = useState('');
    const [err, setErr] = useState('');

    useEffect(() => {
        async function load() {
            try {
                const [balRes, txRes] = await Promise.all([
                    api.get('/wallet/balance'),
                    api.get('/wallet/transactions'),
                ]);
                setBalance(balRes.data);
                setTransactions(txRes.data);
            } catch (e) { console.error(e); }
            finally { setLoading(false); }
        }
        load();
    }, []);

    const doTransfer = async (e) => {
        e.preventDefault();
        setErr(''); setMsg('');
        try {
            const res = await api.post('/wallet/transfer', { toEmail: transferForm.toEmail, amount: Number(transferForm.amount) });
            setMsg(res.data.message);
            setBalance(b => ({ ...b, balance: res.data.newBalance }));
            setShowTransfer(false);
            refreshProfile();
            const txRes = await api.get('/wallet/transactions');
            setTransactions(txRes.data);
        } catch (e) { setErr(e.response?.data?.error || 'Transfer failed'); }
    };

    const doSell = async (e) => {
        e.preventDefault();
        setErr(''); setMsg('');
        try {
            const res = await api.post('/wallet/sell', { amount: Number(sellAmount) });
            setMsg(res.data.message);
            setBalance(b => ({ ...b, balance: res.data.newBalance }));
            setShowSell(false);
            refreshProfile();
            const txRes = await api.get('/wallet/transactions');
            setTransactions(txRes.data);
        } catch (e) { setErr(e.response?.data?.error || 'Sell failed'); }
    };

    if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin h-10 w-10 border-4 border-eco-500 border-t-transparent rounded-full" /></div>;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-black text-concrete-900 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                        <HiCreditCard className="text-white text-xl" />
                    </div>
                    Green Wallet
                </h1>
                <p className="text-concrete-500 mt-1">Manage your Green Credits</p>
            </div>

            {msg && <div className="bg-eco-50 border border-eco-200 text-eco-800 px-5 py-3 rounded-xl text-sm">{msg}</div>}
            {err && <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-3 rounded-xl text-sm">{err}</div>}

            {/* Balance cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="card-eco col-span-1 sm:col-span-2 lg:col-span-1">
                    <p className="text-sm text-eco-200 mb-1">Available Balance</p>
                    <p className="text-4xl font-black">{balance.balance.toFixed(1)} <span className="text-lg font-normal text-eco-300">GC</span></p>
                    <p className="text-xs text-eco-300 mt-2">≈ ₹{(balance.balance * 50).toFixed(0)} value</p>
                </div>
                <div className="stat-card">
                    <div className="w-12 h-12 rounded-xl bg-eco-100 text-eco-800 flex items-center justify-center flex-shrink-0">
                        <HiArrowTrendingUp className="text-2xl" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-concrete-900">{balance.totalEarned.toFixed(1)}</p>
                        <p className="text-xs text-concrete-500">Total Earned</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center flex-shrink-0">
                        <HiBanknotes className="text-2xl" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-concrete-900">₹{(balance.totalEarned * 50).toFixed(0)}</p>
                        <p className="text-xs text-concrete-500">Lifetime Value</p>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
                <button onClick={() => { setShowTransfer(!showTransfer); setShowSell(false); }} className="btn-primary flex items-center gap-2">
                    <HiPaperAirplane /> Transfer Credits
                </button>
                <button onClick={() => { setShowSell(!showSell); setShowTransfer(false); }} className="btn-secondary flex items-center gap-2">
                    <HiCurrencyRupee /> Sell Credits
                </button>
            </div>

            {/* Transfer form */}
            {showTransfer && (
                <form onSubmit={doTransfer} className="card space-y-4 animate-slide-up">
                    <h3 className="font-bold text-concrete-800">Transfer Green Credits</h3>
                    <div>
                        <label className="label">Recipient Email</label>
                        <input type="email" value={transferForm.toEmail} onChange={e => setTransferForm(f => ({ ...f, toEmail: e.target.value }))} className="input" required />
                    </div>
                    <div>
                        <label className="label">Amount (GC)</label>
                        <input type="number" value={transferForm.amount} onChange={e => setTransferForm(f => ({ ...f, amount: e.target.value }))} className="input" min="0.1" step="0.1" required />
                    </div>
                    <button type="submit" className="btn-primary">Send Credits</button>
                </form>
            )}

            {/* Sell form */}
            {showSell && (
                <form onSubmit={doSell} className="card space-y-4 animate-slide-up">
                    <h3 className="font-bold text-concrete-800">Sell Credits for ₹</h3>
                    <p className="text-sm text-concrete-500">Rate: 1 GC = ₹50</p>
                    <div>
                        <label className="label">Amount (GC)</label>
                        <input type="number" value={sellAmount} onChange={e => setSellAmount(e.target.value)} className="input" min="0.1" step="0.1" required />
                        {sellAmount && <p className="text-sm text-eco-700 mt-2 font-semibold">You will receive ₹{(Number(sellAmount) * 50).toFixed(2)}</p>}
                    </div>
                    <button type="submit" className="btn-primary">Sell Credits</button>
                </form>
            )}

            {/* Transactions */}
            <div className="card">
                <h3 className="text-lg font-bold text-concrete-900 mb-4">Transaction History</h3>
                {transactions.length === 0 ? (
                    <p className="text-concrete-400 text-center py-8">No transactions yet.</p>
                ) : (
                    <div className="space-y-3">
                        {transactions.map(tx => (
                            <div key={tx._id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-concrete-50 transition-colors">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${tx.type === 'credit' ? 'bg-eco-100 text-eco-800' : 'bg-red-100 text-red-600'}`}>
                                    {tx.type === 'credit' ? <HiArrowTrendingUp className="text-xl" /> : <HiArrowTrendingDown className="text-xl" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-concrete-800 truncate">{tx.description}</p>
                                    <p className="text-xs text-concrete-400">{new Date(tx.createdAt).toLocaleString('en-IN')}</p>
                                </div>
                                <p className={`text-sm font-bold ${tx.type === 'credit' ? 'text-eco-700' : 'text-red-600'}`}>
                                    {tx.type === 'credit' ? '+' : '-'}{tx.amount.toFixed(2)} GC
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
