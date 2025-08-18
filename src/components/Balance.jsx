import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import { Wallet } from 'lucide-react';
import React, { useEffect, useState } from 'react'

// Balance Component
const Balance = () => {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchBalance = async () => {
    if (wallet.publicKey) {
      setLoading(true);
      try {
        const lamports = await connection.getBalance(wallet.publicKey);
        setBalance(lamports / LAMPORTS_PER_SOL);
      } catch (error) {
        console.error('Failed to fetch balance:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchBalance();
  }, [wallet.publicKey, connection]);

  return (
    <div className="bg-slate-900 rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Wallet className="w-5 h-5 text-green-600" />
          <h2 className="text-lg font-semibold text-white">Wallet Balance</h2>
        </div>
        <button
          onClick={fetchBalance}
          disabled={!wallet.connected || loading}
          className="text-sm text-blue-600 hover:text-blue-700 disabled:opacity-50"
        >
          Refresh
        </button>
      </div>
      
      <div className="text-center py-4">
        <div className="text-3xl font-bold text-white">
          {loading ? (
            <span className="text-lg text-white">Loading...</span>
          ) : balance !== null ? (
            `${balance.toFixed(4)} SOL`
          ) : (
            <span className="text-lg text-white-">Connect wallet</span>
          )}
        </div>
        {wallet.publicKey && (
          <p className="text-xs text-white mt-2 break-all">
            {wallet.publicKey.toBase58()}
          </p>
        )}
      </div>
    </div>
  );
};


export default Balance