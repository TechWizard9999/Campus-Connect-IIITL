import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { contractABI } from '../Utils/components';

const contractAddress = '0x3AA01F722b452f652A82B28CDd8C6D1C8f5a876C';

function App() {
    const [provider, setProvider] = useState(null);
    const [gameContract, setGameContract] = useState(null);
    const [playerId, setPlayerId] = useState('');
    const [balance, setBalance] = useState(0);
    const [registrationId, setRegistrationId] = useState('');
    const [isRegistered, setIsRegistered] = useState(false);
    const [buyAmount, setBuyAmount] = useState(0);
    const [receiverId, setReceiverId] = useState('');
    const [sendAmount, setSendAmount] = useState(0);

    useEffect(() => {
        const init = async () => {
            const ethereum = window.ethereum;

            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const gameContract = new ethers.Contract(contractAddress, contractABI, signer);

                setProvider(provider);
                setGameContract(gameContract);

                await updateUI(gameContract);
            } else {
                console.error("Ethereum not found. Please install Metamask or a similar wallet.");
            }
        };

        init();
    }, []);

    const updateUI = async (contract) => {
        try {
            if (!provider) {
                return;
            }

            const accounts = await provider.listAccounts();
            const currentPlayer = accounts[0];
            const playerIdHash = await contract.getPlayerIdHash(currentPlayer);
            const balance = await contract.getBalance(playerIdHash);

            setPlayerId(playerIdHash);
            setBalance(balance.toNumber());

            setIsRegistered(playerIdHash !== '0x0000000000000000000000000000000000000000000000000000000000000000');
        } catch (error) {
            console.error("Error in updateUI:", error);
        }
    };

    const registerPlayer = async () => {
        try {
            const registrationIdHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(registrationId));
            const tx = await gameContract.initializePlayer(registrationIdHash);
            await tx.wait();
            updateUI(gameContract);
        } catch (error) {
            console.error(error);
        }
    };

    const buyTokens = async () => {
        try {
            const tx = await gameContract.buyTokens({ value: ethers.utils.parseEther(buyAmount.toString()) });
            await tx.wait();
            updateUI(gameContract);
        } catch (error) {
            console.error(error);
        }
    };

    const sendTokens = async () => {
        try {
            const tx = await gameContract.sendTokens(receiverId, sendAmount);
            await tx.wait();
            updateUI(gameContract);
        } catch (error) {
            console.error(error);
        }
    };

    const buyCharacter = async () => {
        try {
            const tx = await gameContract.buyCharacter();
            await tx.wait();
            updateUI(gameContract);
        } catch (error) {
            console.error(error);
        }
    };

    return (
            <>
                
                { (
                    <>   
                      <div className="stats">
                        <ul>ID: {playerId}</ul>

                        <ul>{balance} HSR 🟡 </ul>
                    </div>

                    <div className="buytoken">
                        <h4>Buy Tokens</h4>
                        
                        <input type="number" value={buyAmount} onChange={(e) => setBuyAmount(e.target.value)} placeholder='Amount of Eth' />
                        <button onClick={buyTokens}>Buy Tokens</button>
                    </div>
                    <div className="sendtoken">
                        <h2>Send Tokens</h2>
                        <p>Receiver's Player ID: <input type="text" value={receiverId} onChange={(e) => setReceiverId(e.target.value)} /></p>
                        <p>Amount of Tokens to Send: <input type="number" value={sendAmount} onChange={(e) => setSendAmount(e.target.value)} /></p>
                        <button onClick={sendTokens}>Send Tokens</button>
                    </div>
                    <div className="buyCharacter">
                        <h2>Buy Character</h2>
                        <button onClick={buyCharacter}>Buy Character</button>
                    </div>
                    </>
                )}
        </>
    );
}

export default App;
