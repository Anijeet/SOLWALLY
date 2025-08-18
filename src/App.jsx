import React, { FC, useMemo } from "react";
import {
  ConnectionProvider,
  useWallet,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { UnsafeBurnerWalletAdapter } from "@solana/wallet-adapter-wallets";
import {
  WalletModalProvider,
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";

// Default styles that can be overridden by your app
import "@solana/wallet-adapter-react-ui/styles.css";
import Airdrop from "./components/Airdrop";
import Balance from "./components/Balance";
import SendToken from "./components/SendTokem";
import { SignMessage } from "./components/SignMessage";
import { Wallet } from "lucide-react";
import { Toaster } from "sonner";

const AppContent = () => {
  const wallet = useWallet();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-400 via-slate-500 to-slate-600">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#1f2937',
            border: '1px solid #e5e7eb',
            borderRadius: '0.75rem',
            fontSize: '14px',
          },
          success: {
            style: {
              border: '1px solid #10b981',
            },
          },
          error: {
            style: {
              border: '1px solid #ef4444',
            },
          },
        }}
      />
      
      {/* Header */}
      <div className="bg-slate-800 shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">SolWally</h1>
              <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">Devnet</span>
            </div>
            
            <div className="flex items-center gap-3">
              <WalletMultiButton className="!bg-blue-600 !rounded-lg hover:!bg-purple-700" />
              {wallet.connected && (
                <WalletDisconnectButton className="!bg-gray-500 !rounded-lg hover:!bg-gray-600" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ">
        {!wallet.connected ? (
          <div className="text-center py-12">
            <Wallet className="w-16 h-16 text-gray-900 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Connect Your Wallet</h2>
            <p className="text-gray-300 mb-6">Connect your Solana wallet to get started with the dashboard</p>
            <div className="flex justify-center">
              <WalletMultiButton className="!bg-blue-600 !rounded-lg hover:!bg-blue-700" />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-2">
              <Balance />
            </div>
            <Airdrop />
            <SendToken />
            <div className="lg:col-span-2">
              <SignMessage />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

function App() {
  const endpoint = "https://solana-devnet.g.alchemy.com/v2/QELskRlvP3MOxsoXjyqvp";
  
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>
          <AppContent />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;
