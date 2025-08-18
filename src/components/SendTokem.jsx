import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { Connection, LAMPORTS_PER_SOL, SystemProgram, Transaction } from '@solana/web3.js'
import { Send } from 'lucide-react';
import React, { useState } from 'react'
import { toast } from 'sonner';

const SendToken = () => {
  const wallet = useWallet();
  const { connection } = useConnection();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const sendTransaction = async () => {
    if (!wallet.publicKey) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!recipient || !amount) {
      toast.error('Please fill in all fields');
      return;
    }

    if (parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setLoading(true);
    const loadingToastId = toast.loading('Sending transaction...');

    try {
      const recipientPubkey = recipient;
      const transaction = new Transaction();
      
      transaction.add(
        SystemProgram.transfer({
          fromPubkey: wallet.publicKey,
          toPubkey: recipientPubkey,
          lamports: parseFloat(amount) * LAMPORTS_PER_SOL,
        })
      );

      await wallet.sendTransaction(transaction, connection);
      toast.dismiss(loadingToastId);
      toast.success(`Successfully sent ${amount} SOL!`);
      setRecipient('');
      setAmount('');
    } catch (error) {
      toast.dismiss(loadingToastId);
      toast.error('Transaction failed. Please check the recipient address and try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-4">
        <Send className="w-5 h-5 text-purple-600" />
        <h2 className="text-lg font-semibold text-white">Send SOL</h2>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-white mb-2">Recipient Address</label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="Enter recipient's public key"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
            disabled={loading}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-white mb-2">Amount (SOL)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount to send"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
            disabled={loading}
          />
        </div>
        
        <button
          onClick={sendTransaction}
          disabled={loading || !wallet.connected}
          className="w-full bg-[#512DA8] text-white py-2 px-4 rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Sending...' : 'Send SOL'}
        </button>
      </div>
    </div>
  );
};

export default SendToken