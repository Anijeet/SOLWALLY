import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import React, { useEffect, useState } from 'react'

const Balance = () => {
    const {connection} = useConnection()
    const wallet = useWallet()

     const [balance, setBalance] = useState(null)

  useEffect(() => {
    async function fetchBalance() {
      if (wallet.publicKey) {
        const lamports = await connection.getBalance(wallet.publicKey)
        setBalance(lamports / LAMPORTS_PER_SOL)
      }
    }

    fetchBalance()
  }, [wallet.publicKey, connection]) // re-run if wallet or connection changes

  return (
    <div>
      Sol Balance: {balance !== null ? balance : "Loading..."}
   
    </div>
  )
}

export default Balance