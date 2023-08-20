import React, { useEffect, useState, useRef } from 'react';
import { socket } from './SocketManager';
import Message from './Message';
import InputPopup from './InputPopup';
// import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { contractABI } from '../Utils/components';


const contractAddress = '0x3AA01F722b452f652A82B28CDd8C6D1C8f5a876C';
const GlobalChat = () => {
    const [id, setId] = useState("");
    const [show, setshow] = useState(false);
    const [showShop, setShowShop] = useState(false);

    const [messages, setMessages] = useState([]);
    const [name, setName] = useState("");
    const chatlogRef = useRef(null);
    const [inputPopupOpen, setInputPopupOpen] = useState(true);
    const [detailsPopupOpen, setDetailsPopupOpen] = useState(false); // State for the details popup

    const scrollToBottom = () => {
        chatlogRef.current.scrollTop = chatlogRef.current.scrollHeight;
    };
    const [provider, setProvider] = useState(null);
    const [gameContract, setGameContract] = useState(null);
    const [playerId, setPlayerId] = useState('');
    const [balance, setBalance] = useState(0);
    const [registrationId, setRegistrationId] = useState('');
    const [isRegistered, setIsRegistered] = useState(false);
    const [buyAmount, setBuyAmount] = useState(0);
    const [receiverId, setReceiverId] = useState('');
    const [sendAmount, setSendAmount] = useState(0);
    const [accept, setAccept] = useState(false);
    const [challenge, setChallenge] = useState(true);

    const [info, setInfo] = useState("");
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

    const buyCharacter = async (x) => {
        try {
            const tx = await gameContract.buyCharacter();
            await tx.wait();
            socket.emit("change", x)
            updateUI(gameContract);
        } catch (error) {
            console.error(error);
        }
    };


    const handleClick = (event) => {
        event.preventDefault();
        const message = document.getElementById('chatInput').value;
        if (message) {
            socket.emit('message', { message, id, name });
            document.getElementById('chatInput').value = "";
        }
    };

    const handleChallenge = async () => {

        try {
            const tx = await gameContract.buyCharacter();
            await tx.wait();
            const info = `${name} created a challenge`
            socket.emit('challenge', { id, info });
            // socket.emit("change", x)
            updateUI(gameContract);
        } catch (error) {
            console.error(error);
        }
        
    }
    const AcceptChallege = async () => {
        try {
            const tx = await gameContract.buyCharacter();
            await tx.wait();
            // const info = `${name} created a challenge`
            // socket.emit('challenge', { id, info });
            // socket.emit("change", x)
            updateUI(gameContract);
        } catch (error) {
            console.error(error);
        }
    }


    const handleDetailsEnter = () => {
        // Handle entering the game world or any other actions
        setDetailsPopupOpen(false);
    };

    useEffect(() => {
        const messageHandler = (data) => {
            setMessages(prevMessages => [...prevMessages, data]);
        };

        const Challengehandler = (data) => {
            if (data.id == socket.id) {
                console.log(data);
                setChallenge(false);

            } else {
                setInfo(data.info);
                setAccept(true);
                setChallenge(false);
                console.log(data);
            }
        }
        socket.on('sendChallenge', Challengehandler);
        socket.on('sendMessage', messageHandler);

        return () => {
            socket.off('sendMessage', messageHandler);
            socket.off('sendChallenge', Challengehandler);
        };
    }, []);

    useEffect(() => {
        socket.on("connect", () => {
            setId(socket.id);
        });

        return () => {
            socket.off('connect');
        };
    }, []);
    useEffect(() => {
        console.log(name);
        console.log(registrationId);
    }, [name, registrationId]);

    const handleNameSave = async (visitorName) => {
        setName(visitorName);
        //     console.log(name);
        //    await  setRegistrationId(name);
        //     console.log(registrationId);
        //     await registerPlayer();


        setInputPopupOpen(false); // Close the name popup
        setDetailsPopupOpen(true); // Open the details popup
    };

    return (<>

        <div className='GlobalChat'>

            <InputPopup isOpen={inputPopupOpen} type="name" onSave={handleNameSave} />


            <InputPopup isOpen={detailsPopupOpen} type="details" onSave={handleDetailsEnter} />

            <form>
                <input type="text" id='chatInput' />
                <button onClick={handleClick}>Send</button>
            </form>
            <div className='chatlog' ref={chatlogRef}>
                {messages.slice().reverse().map((item, i) => (
                    <Message key={i} user={item.id === id ? '' : id} name={item.name} message={item.message} />
                ))}
            </div>
        </div>

        {isRegistered ? (
            <>
                <div className="stats">
                    <ul>ID: {playerId}</ul>

                    <ul>{balance} HSR 🟡 </ul>
                </div>


                <div className="sendtoken">

                    <input type="text" value={receiverId} placeholder="Receiver's ID" onChange={(e) => setReceiverId(e.target.value)} />
                    <input type="number" value={sendAmount} onChange={(e) => setSendAmount(e.target.value)} />
                    <button onClick={sendTokens}>Send Tokens</button>
                </div>
                <div className="challenge">
                    {challenge && <button onClick={handleChallenge} >Create Challenge </button>}
                    <h5>{info}</h5>
                    {accept && (<button onClick={AcceptChallege} >Accept</button>)}
                </div>
                <div className='CharacterMenu' >

                    <button onClick={() => {

                        setshow(!show);

                        console.log(show);
                    }} > {show ? "Close" : "Buy Characters"} </button>   <button onClick={(e) => socket.emit("change")} >
                        Map
                    </button>
                    <button onClick={() => {
                        console.log(showShop);
                        setShowShop(!showShop)
                    }} >{showShop ? "Close" : "Shop"}</button>
                    {showShop && (<div className="buytoken">
                        <h4>Buy Tokens</h4>
                        <input type="number" value={buyAmount} onChange={(e) => setBuyAmount(e.target.value)} placeholder='Amount of Eth' />
                        <button onClick={buyTokens}>Buy Tokens</button>
                    </div>)}
                    {show && (<div className='images' >
                        <img src="https://i.pinimg.com/236x/ba/c7/f3/bac7f398439af088efb6f98b97744201.jpg" alt="" width="100px" height="100px"
                            onClick={() => { buyCharacter(0) }}
                        />
                        <img src="https://i.pinimg.com/236x/2d/15/a6/2d15a6815a0cf568b8efaa203ac2571b.jpg" alt="" width="100px" height="100px"
                            onClick={() => { buyCharacter(1) }}

                        />
                        <img src="https://i.pinimg.com/236x/a5/c9/c2/a5c9c2dc53a2697748d48c97cd8f1d5c.jpg" alt="" width="100px" height="100px"
                            onClick={() => { buyCharacter(2) }}
                        />
                        <img src="https://i.pinimg.com/236x/0b/4c/1e/0b4c1e1aae9cee4ae991fea7ac1e488d.jpg" alt="" width="100px" height="100px"
                            onClick={() => { buyCharacter(3) }}

                        />
                        <img src="https://i.pinimg.com/474x/76/3a/f5/763af549f774363dcb0117a10a027fb4.jpg" alt="" width="100px" height="100px"
                            onClick={() => { buyCharacter(4) }}
                        />
                        <img src="https://i.pinimg.com/236x/5f/b0/b9/5fb0b945739f4acd3de975d3a1d61b6f.jpg" alt="" width="100px" height="100px"
                            onClick={() => { buyCharacter(5) }}
                        />




                    </div>)}


                </div>
            </>
        ) : (
            <div className='center registration-container'>
                <p>Register a Unique Player ID:</p>
                <input type="text" value={registrationId} onChange={(e) => setRegistrationId(e.target.value)} />
                <button onClick={registerPlayer}>Register</button>
            </div>
        )}








    </>
    );
};

export default GlobalChat;
