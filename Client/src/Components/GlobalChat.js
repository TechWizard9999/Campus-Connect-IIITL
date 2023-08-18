import React, { useEffect, useState, useRef } from 'react';
import { socket } from './SocketManager';
import Message from './Message';
import InputPopup from './InputPopup';

const GlobalChat = () => {
    const [id, setId] = useState("");
    const [messages, setMessages] = useState([]);
    const [name, setName] = useState("");
    const chatlogRef = useRef(null);
    const [inputPopupOpen, setInputPopupOpen] = useState(true);
    const [detailsPopupOpen, setDetailsPopupOpen] = useState(false); // State for the details popup

    const scrollToBottom = () => {
        chatlogRef.current.scrollTop = chatlogRef.current.scrollHeight;
    };

    const handleClick = (event) => {
        event.preventDefault();
        const message = document.getElementById('chatInput').value;
        if (message) {
            socket.emit('message', { message, id, name });
            document.getElementById('chatInput').value = "";
        }
    };

    const handleNameSave = (visitorName) => {
        setName(visitorName);
        setInputPopupOpen(false); // Close the name popup
        setDetailsPopupOpen(true); // Open the details popup
    };

    const handleDetailsEnter = () => {
        // Handle entering the game world or any other actions
        setDetailsPopupOpen(false);
    };

    useEffect(() => {
        const messageHandler = (data) => {
            setMessages(prevMessages => [...prevMessages, data]);
        };

        socket.on('sendMessage', messageHandler);

        return () => {
            socket.off('sendMessage', messageHandler);
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

    return (
        <div className='GlobalChat'>
            {/* Name Popup */}
            <InputPopup isOpen={inputPopupOpen} type="name" onSave={handleNameSave} />

            {/* Details Popup */}
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
    );
};

export default GlobalChat;
