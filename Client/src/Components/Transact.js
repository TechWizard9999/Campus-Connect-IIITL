import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';

const Transact = () => {
    const [errorMessage, setErrorMessage] = useState(null);
    const [defaultAccount, setDefaultAccount] = useState(null);
    const [userBalance, setUserBalance] = useState(null);
    const [amountToSend, setAmountToSend] = useState("");

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

    async function sendTransaction(event) {
        event.preventDefault();
        if (window.ethereum) {
            const signer = new ethers.providers.Web3Provider(window.ethereum).getSigner();
            const receiverAddress = event.target.to_address.value;
            const amountInEth = ethers.utils.parseEther(event.target.amount.value);

            try {
                const tx = await signer.sendTransaction({
                    to: receiverAddress,
                    value: amountInEth,
                });

                await tx.wait();
                console.log("Transaction successful:", tx.hash);

                // Update the user's balance after a successful transaction
                await getUserBalance(defaultAccount);
            } catch (error) {
                console.error("Error sending transaction:", error);
            }
        } else {
            setErrorMessage("Please install MetaMask to send transactions");
        }
    }
    useEffect(() => {
        // Fetch user balance initially
        getUserBalance(defaultAccount);

        // Fetch user balance every 5 seconds
        const interval = setInterval(() => {
            getUserBalance(defaultAccount);
        }, 5000); // 5000 milliseconds = 5 seconds

        // Clean up the interval when the component unmounts
        return () => clearInterval(interval);
    }, [defaultAccount]);

    useEffect(() => {
        connectWallet(); // Automatically connect when component mounts
    }, []);

    return (<>
        <div className='wallet' >
          
                <ul>

                <li>Address: {defaultAccount}</li>
                <ul>Balance: {userBalance} ETH </ul>
                </ul>
                </div>
                    <div className='Tasks' >
                <form onSubmit={sendTransaction}>
                    <input type="text" name="to_address" placeholder="Receiver's Address" />
                    <input type="number" step="0.0001" min="0" name="amount" placeholder="Amount of ETH" value={amountToSend} onChange={(e) => setAmountToSend(e.target.value)} />
                  <button onClick={sendTransaction}  >Send</button>
                </form>
                {errorMessage && <p>{errorMessage}</p>}
            
        </div>
    </>
    );
};

export default Transact;
