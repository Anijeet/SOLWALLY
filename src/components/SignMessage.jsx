import { ed25519 } from '@noble/curves/ed25519';
import { useWallet } from '@solana/wallet-adapter-react';
import bs58 from 'bs58';
import { CheckCircle, Shield } from 'lucide-react';
// import { ed25519 } from '@noble/curves/ed25519';
import React, { useState } from 'react';
import { toast } from 'sonner';

export const SignMessage = () => {
  const { publicKey, signMessage } = useWallet();
  const [message, setMessage] = useState('');
  const [signature, setSignature] = useState('');
  const [verifyMessage, setVerifyMessage] = useState('');
  const [verifySignature, setVerifySignature] = useState('');
  const [loading, setLoading] = useState({ sign: false, verify: false });

  const handleSignMessage = async () => {
    if (!publicKey) {
      toast.error('Please connect your wallet first');
      return;
    }
    
    if (!signMessage) {
      toast.error('Wallet does not support message signing');
      return;
    }

    if (!message.trim()) {
      toast.error('Please enter a message to sign');
      return;
    }

    setLoading(prev => ({ ...prev, sign: true }));

    try {
      const encodedMessage = new TextEncoder().encode(message);
      const signatureBytes = await signMessage(encodedMessage);

      if (!ed25519.verify(signatureBytes, encodedMessage, publicKey.toBytes())) {
        throw new Error('Message signature invalid!');
      }

      const signatureBase58 = bs58.encode(signatureBytes);
      setSignature(signatureBase58);
      toast.success('Message signed successfully!');
    } catch (error) {
      toast.error('Failed to sign message');
      console.error(error);
    } finally {
      setLoading(prev => ({ ...prev, sign: false }));
    }
  };

  const handleVerifySignature = async () => {
    if (!publicKey) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!verifyMessage.trim() || !verifySignature.trim()) {
      toast.error('Please enter both message and signature');
      return;
    }

    setLoading(prev => ({ ...prev, verify: true }));

    try {
      const encodedMessage = new TextEncoder().encode(verifyMessage);
      const signatureBytes = bs58.decode(verifySignature);

      const isValid = ed25519.verify(signatureBytes, encodedMessage, publicKey.toBytes());

      if (isValid) {
        toast.success('Signature is valid!');
      } else {
        toast.error('Signature is invalid!');
      }
    } catch (error) {
      toast.error('Failed to verify signature. Please check the inputs.');
      console.error(error);
    } finally {
      setLoading(prev => ({ ...prev, verify: false }));
    }
  };

  return (
    <div className="bg-slate-900 rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="w-5 h-5 text-orange-600" />
        <h2 className="text-lg font-semibold text-white">Message Signing</h2>
      </div>
      
      <div className="space-y-6">
        {/* Sign Message Section */}
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-md font-medium text-white mb-4">Sign Message</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter message to sign"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none text-white"
                disabled={loading.sign}
              />
            </div>
            
            <button
              onClick={handleSignMessage}
              disabled={loading.sign || !publicKey}
              className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading.sign ? 'Signing...' : 'Sign Message'}
            </button>
            
            {signature && (
              <div>
                <label className="block text-sm font-medium text-white mb-2">Signature</label>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <code className="text-xs break-all text-white-700">{signature}</code>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Verify Signature Section */}
        <div>
          <h3 className="text-md font-medium text-white mb-4">Verify Signature</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Original Message</label>
              <textarea
                value={verifyMessage}
                onChange={(e) => setVerifyMessage(e.target.value)}
                placeholder="Enter original message"
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none text-white"
                disabled={loading.verify}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white mb-2">Signature</label>
              <input
                type="text"
                value={verifySignature}
                onChange={(e) => setVerifySignature(e.target.value)}
                placeholder="Enter signature to verify"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-white focus:border-transparent"
                disabled={loading.verify}
              />
            </div>
            
            <button
              onClick={handleVerifySignature}
              disabled={loading.verify || !publicKey}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {loading.verify ? (
                'Verifying...'
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Verify Signature
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

