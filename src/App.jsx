import React, { FC, useMemo, useState } from "react";
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
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

// Default styles that can be overridden by your app
import "@solana/wallet-adapter-react-ui/styles.css";
import Airdrop from "./components/Airdrop";
import Balance from "./components/Balance";
import SendToken from "./components/SendTokem";
import { SignMessage } from "./components/SignMessage";
import { Sidebar } from "./components/SideBar.jsx";
import { Wallet } from "lucide-react";
import { Toaster } from "sonner";
import { CreateToken } from "./components/token/CreateToken";

// Dashboard Component
const Dashboard = () => {
  const wallet = useWallet();

  return (
    <div className="p-6">
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
  );
};

const AppContent = () => {
  const wallet = useWallet();
  const location = useLocation();

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
      
      <div className="flex h-screen">
        {/* Sidebar */}
        <Sidebar currentPath={location.pathname} />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="bg-slate-800 shadow-sm border-b border-gray-700">
            <div className="px-6">
              <div className="flex justify-between items-center py-4">
                <div className="flex items-center gap-3">
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

          {/* Content with Routes */}
          <div className="flex-1 overflow-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/token" element={<CreateToken />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  const endpoint = "https://solana-devnet.g.alchemy.com/v2/QELskRlvP3MOxsoXjyqvp";
  
  return (
    <Router>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={[]} autoConnect>
          <WalletModalProvider>
            <AppContent />
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </Router>
  );
}

export default App;