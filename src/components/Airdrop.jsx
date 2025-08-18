
import  { useState } from 'react';
import {
  useWallet,
  useConnection,
} from '@solana/wallet-adapter-react';
import {  
  LAMPORTS_PER_SOL, 
} from '@solana/web3.js';
import { Download } from 'lucide-react';
import { toast } from 'sonner';

// Airdrop Component
export default function Airdrop () {
  const wallet = useWallet();
  const { connection } = useConnection();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const requestAirdrop = async () => {
    if (!wallet.publicKey) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setLoading(true);
    const loadingToastId = toast.loading('Requesting airdrop...');

    try {
      await connection.requestAirdrop(wallet.publicKey, parseFloat(amount) * LAMPORTS_PER_SOL);
      toast.dismiss(loadingToastId);
      toast.success(`Successfully airdropped ${amount} SOL!`);
      setAmount('');
    } catch (error) {
      toast.dismiss(loadingToastId);
      toast.error('Airdrop failed. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-4">
        <Download className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-white">Request Airdrop</h2>
      </div>
      <p className="text-sm text-white mb-4">Get test SOL for development (Devnet only)</p>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-white mb-2">Amount (SOL)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount (e.g., 1)"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
            disabled={loading}
          />
        </div>
        
        <button
          onClick={requestAirdrop}
          disabled={loading || !wallet.connected}
          className="w-full bg-[#512DA8] text-white py-2 px-4 rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Requesting...' : 'Request Airdrop'}
        </button>
      </div>
    </div>
  );
};
