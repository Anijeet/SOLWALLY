import { createInitializeMint2Instruction, createMint, getMinimumBalanceForRentExemptMint, MINT_SIZE, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Keypair, SystemProgram, Transaction } from "@solana/web3.js";

// Token Component
export const CreateToken = () => {
    const {connection} = useConnection()
    const wallet = useWallet();


    async function createtoken(){
    
    const name = document.getElementById('name').value;
    const symbol = document.getElementById('symbol').value;
    const imageurl = document.getElementById('imageurl').value;
    const initalsupply = document.getElementById('initalsupply').value;

    const lamports = await getMinimumBalanceForRentExemptMint(connection); //to get how much minimum lamports required to create token
    const keypair= Keypair.generate(); //to generate keypair for that token


    //cretanemint() function with wallet authority and keypair
    const transaction = new Transaction().add(
            SystemProgram.createAccount({
                fromPubkey: wallet.publicKey,
                newAccountPubkey: keypair.publicKey,
                space: MINT_SIZE,
                lamports,
                programId: TOKEN_PROGRAM_ID,//owenr of the token program
            }),
            createInitializeMint2Instruction(keypair.publicKey, 8, wallet.publicKey, wallet.publicKey, TOKEN_PROGRAM_ID),
        );

        const recentBlockhash = await connection.getLatestBlockhash();
        transaction.recentBlockhash = recentBlockhash.blockhash;
        transaction.feePayer = wallet.publicKey;
       
        transaction.partialSign(keypair);
        const response = await wallet.sendTransaction(transaction, connection);
        console.log(response);

    
    }

  return (
    <div className="w-[100%] h-[100%] flex flex-col justify-center items-center">
          <h1>Solana Token Launchpad</h1>
        <input id='name' className='inputText' type='text' placeholder='Name'></input> <br />
        <input id='symbol' className='inputText' type='text' placeholder='Symbol'></input> <br />
        <input id="imageurl" className='inputText' type='text' placeholder='Image URL'></input> <br />
        <input id="initalsupply" className='inputText' type='text' placeholder='Supply'></input> <br />
        <button onClick={createtoken} className='btn'>Create a token</button>
    </div>
  );
};