import { Keypair, SystemProgram, Transaction } from "@solana/web3.js";
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useState } from 'react';
import { MINT_SIZE, TOKEN_2022_PROGRAM_ID, createMintToInstruction, createAssociatedTokenAccountInstruction, getMintLen, createInitializeMetadataPointerInstruction, createInitializeMintInstruction, TYPE_SIZE, LENGTH_SIZE, ExtensionType, mintTo, getOrCreateAssociatedTokenAccount, getAssociatedTokenAddressSync } from "@solana/spl-token"
import { createInitializeInstruction, pack } from '@solana/spl-token-metadata';

export function CreateToken() {
    const { connection } = useConnection();
    const wallet = useWallet();
    
    // State for form inputs
    const [tokenName, setTokenName] = useState('');
    const [tokenSymbol, setTokenSymbol] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [initialSupply, setInitialSupply] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    async function createToken() {
        // Validation
        if (!tokenName.trim()) {
            alert('Please enter a token name');
            return;
        }
        
        if (!tokenSymbol.trim()) {
            alert('Please enter a token symbol');
            return;
        }
        
        if (!imageUrl.trim()) {
            alert('Please enter an image URL');
            return;
        }

        if (!wallet.publicKey) {
            alert('Please connect your wallet first');
            return;
        }

        setIsCreating(true);

        try {
            const mintKeypair = Keypair.generate();
            
            // Create metadata JSON and show it
            const metadataJson = {
                name: tokenName.trim(),
                symbol: tokenSymbol.trim().toUpperCase(),
                description: `This is ${tokenName.trim()} token for demonstration purposes.`,
                image: imageUrl.trim()
            };
            
            console.log('Metadata JSON that should be hosted at URI:');
            console.log(JSON.stringify(metadataJson, null, 2));
            
            const metadata = {
                mint: mintKeypair.publicKey,
                name: tokenName.trim(),
                symbol: tokenSymbol.trim().toUpperCase(),
                uri: 'https://cdn.100xdevs.com/metadata.json',
                additionalMetadata: [],
            };

            const mintLen = getMintLen([ExtensionType.MetadataPointer]);
            const metadataLen = TYPE_SIZE + LENGTH_SIZE + pack(metadata).length;

            const lamports = await connection.getMinimumBalanceForRentExemption(mintLen + metadataLen);

            const transaction = new Transaction().add(
                SystemProgram.createAccount({
                    fromPubkey: wallet.publicKey,
                    newAccountPubkey: mintKeypair.publicKey,
                    space: mintLen,
                    lamports,
                    programId: TOKEN_2022_PROGRAM_ID,
                }),
                createInitializeMetadataPointerInstruction(mintKeypair.publicKey, wallet.publicKey, mintKeypair.publicKey, TOKEN_2022_PROGRAM_ID),
                createInitializeMintInstruction(mintKeypair.publicKey, 9, wallet.publicKey, null, TOKEN_2022_PROGRAM_ID),
                createInitializeInstruction({
                    programId: TOKEN_2022_PROGRAM_ID,
                    mint: mintKeypair.publicKey,
                    metadata: mintKeypair.publicKey,
                    name: metadata.name,
                    symbol: metadata.symbol,
                    uri: metadata.uri,
                    mintAuthority: wallet.publicKey,
                    updateAuthority: wallet.publicKey,
                }),
            );
                
            transaction.feePayer = wallet.publicKey;
            transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
            transaction.partialSign(mintKeypair);

            await wallet.sendTransaction(transaction, connection);

            console.log(`Token mint created at ${mintKeypair.publicKey.toBase58()}`);
            
            const associatedToken = getAssociatedTokenAddressSync(
                mintKeypair.publicKey,
                wallet.publicKey,
                false,
                TOKEN_2022_PROGRAM_ID,
            );

            console.log(associatedToken.toBase58());

            const transaction2 = new Transaction().add(
                createAssociatedTokenAccountInstruction(
                    wallet.publicKey,
                    associatedToken,
                    wallet.publicKey,
                    mintKeypair.publicKey,
                    TOKEN_2022_PROGRAM_ID,
                ),
            );

            await wallet.sendTransaction(transaction2, connection);

            // Only mint tokens if initial supply is provided
            if (initialSupply && initialSupply.trim() !== '') {
                const supply = parseInt(initialSupply);
                if (!isNaN(supply) && supply > 0) {
                    const transaction3 = new Transaction().add(
                        createMintToInstruction(mintKeypair.publicKey, associatedToken, wallet.publicKey, supply * 1000000000, [], TOKEN_2022_PROGRAM_ID)
                    );

                    await wallet.sendTransaction(transaction3, connection);
                    console.log(`Minted ${supply} tokens!`);
                }
            }

            alert(`Token created successfully!\n\nMint Address: ${mintKeypair.publicKey.toBase58()}\nSymbol: ${tokenSymbol.toUpperCase()}\n\nMetadata JSON (copy this and host it at your URI):\n${JSON.stringify(metadataJson, null, 2)}\n\nView on Solana Explorer:\nhttps://explorer.solana.com/address/${mintKeypair.publicKey.toBase58()}?cluster=devnet`);
            
            // Clear form after successful creation
            setTokenName('');
            setTokenSymbol('');
            setImageUrl('');
            setInitialSupply('');

        } catch (error) {
            console.error('Error creating token:', error);
            alert('Error creating token. Please check the console and try again.');
        } finally {
            setIsCreating(false);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 w-full max-w-md shadow-2xl border border-white/20">
                <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                    Solana Token Launchpad
                </h1>
                
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Token Name <span className="text-red-400">*</span>
                        </label>
                        <input 
                            type='text' 
                            placeholder='Enter token name (e.g., My Awesome Token)'
                            value={tokenName}
                            onChange={(e) => setTokenName(e.target.value)}
                            disabled={isCreating}
                            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Symbol <span className="text-red-400">*</span>
                        </label>
                        <input 
                            type='text' 
                            placeholder='Enter symbol (e.g., MAT)'
                            value={tokenSymbol}
                            onChange={(e) => setTokenSymbol(e.target.value.toUpperCase())}
                            disabled={isCreating}
                            maxLength={10}
                            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed uppercase"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Image URL <span className="text-red-400">*</span>
                        </label>
                        <input 
                            type='url' 
                            placeholder='https://example.com/token-image.png'
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            disabled={isCreating}
                            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Initial Supply <span className="text-gray-500 text-xs">(Optional)</span>
                        </label>
                        <input 
                            type='number' 
                            placeholder='Enter initial supply (e.g., 1000000) - Leave empty for no initial mint'
                            value={initialSupply}
                            onChange={(e) => setInitialSupply(e.target.value)}
                            disabled={isCreating}
                            min="1"
                            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                        <p className="text-xs text-gray-400 mt-1">
                            If left empty, no tokens will be minted initially. You can mint tokens later.
                        </p>
                    </div>
                    
                    {/* Preview metadata JSON */}
                    {tokenName && tokenSymbol && imageUrl && (
                        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3">
                            <p className="text-xs text-gray-300 mb-2">📄 Metadata JSON Preview:</p>
                            <pre className="text-xs text-green-300 overflow-x-auto">
{JSON.stringify({
    name: tokenName.trim(),
    symbol: tokenSymbol.trim().toUpperCase(),
    description: `This is ${tokenName.trim()} token for demonstration purposes.`,
    image: imageUrl.trim()
}, null, 2)}
                            </pre>
                        </div>
                    )}
                    
                    
                    
                    <button 
                        onClick={createToken} 
                        disabled={isCreating || !wallet.connected}
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                    >
                        {isCreating ? (
                            <div className="flex items-center justify-center space-x-2">
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                <span>Creating Token...</span>
                            </div>
                        ) : (
                            'Create Token'
                        )}
                    </button>
                    
                    {!wallet.connected && (
                        <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3">
                            <p className="text-red-300 text-sm text-center">
                                ⚠️ Please connect your wallet to create a token
                            </p>
                        </div>
                    )}
                
                </div>
            </div>
        </div>
    );
}