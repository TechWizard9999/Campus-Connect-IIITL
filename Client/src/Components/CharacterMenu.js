// import React, { useState } from 'react'
import { socket } from './SocketManager'
import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';

const CharacterMenu = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [userBalance, setUserBalance] = useState(null);
  const [show, setshow] = useState(false);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        accountChanged(accounts[0]);
      } catch (error) {
        setErrorMessage('User denied account access');
      }
    } else {
      setErrorMessage('Please install MetaMask to connect to a wallet');
    }
  };

  const handleClick = async (x) => {
    if (window.ethereum) {
      const signer = new ethers.providers.Web3Provider(window.ethereum).getSigner();
      const receiverAddress = '0xa1c6194DE14b340AF27490EbD80C1a3ced5549eD'; // Change this to the desired receiver address
      const amountInEth = ethers.utils.parseEther('0.0001');

      try {
        const tx = await signer.sendTransaction({
          to: receiverAddress,
          value: amountInEth,
        });

        await tx.wait();
        console.log('Transaction successful:', tx.hash);

        // Call your particular function here after the transaction is successful
        // For example: yourParticularFunction();
        socket.emit("change", 1);

      } catch (error) {
        console.error('Error sending transaction:', error);
        setErrorMessage('Error sending transaction');
      }
    } else {
      setErrorMessage('Please install MetaMask to send transactions');
    }
  };
  const accountChanged = async accountName => {
    setDefaultAccount(accountName);
    await getUserBalance(accountName);
  };

  const getUserBalance = async accountAddress => {
    try {
      const balance = await window.ethereum.request({ method: 'eth_getBalance', params: [String(accountAddress), 'latest'] });
      setUserBalance(ethers.utils.formatEther(balance));
    } catch (error) {
      console.error("Error getting balance:", error);
    }
  };

  useEffect(() => {
    connectWallet(); // Automatically connect when component mounts
  }, []);
  return (
    <div className='CharacterMenu' >

      <button onClick={() => {

        setshow(!show);

        console.log(show);
      }} > {show ? "Close" : "Buy Characters"} </button>   <button onClick={(e) => socket.emit("change")} >
        Map
      </button>
      <button>Settings</button>
      {show && (<div className='images' >
        <img src="https://i.pinimg.com/236x/ba/c7/f3/bac7f398439af088efb6f98b97744201.jpg" alt="" width="100px" height="100px"
          onClick={(e) => socket.emit("change", 0)}
        />
        <img src="https://i.pinimg.com/236x/2d/15/a6/2d15a6815a0cf568b8efaa203ac2571b.jpg" alt="" width="100px" height="100px"
          onClick={() => { socket.emit("change", 1) }}

        />
        <img src="https://i.pinimg.com/236x/a5/c9/c2/a5c9c2dc53a2697748d48c97cd8f1d5c.jpg" alt="" width="100px" height="100px"
          onClick={(e) => socket.emit("change", 2)}
        />
        <img src="https://i.pinimg.com/236x/0b/4c/1e/0b4c1e1aae9cee4ae991fea7ac1e488d.jpg" alt="" width="100px" height="100px"
          onClick={(e) => socket.emit("change", 3)}

        />
        <img src="https://i.pinimg.com/474x/76/3a/f5/763af549f774363dcb0117a10a027fb4.jpg" alt="" width="100px" height="100px"
          onClick={(e) => socket.emit("change", 4)}
        />
        <img src="https://i.pinimg.com/236x/5f/b0/b9/5fb0b945739f4acd3de975d3a1d61b6f.jpg" alt="" width="100px" height="100px"
          onClick={(e) => socket.emit("change", 5)}
        />




      </div>)}


    </div>
  )
}

export default CharacterMenu