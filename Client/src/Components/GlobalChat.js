import React, { useEffect, useState } from 'react';
import { socket } from './SocketManager';
import Message from './Message';

const GlobalChat = () => {
    const [id, setId] = useState("");
    const [messages, setMessages] = useState([]);

    const handleClick = (event) => {
        event.preventDefault();
        const message = document.getElementById('chatInput').value;
        socket.emit('message', { message, id });
        document.getElementById('chatInput').value = "";
console.log(id);
    };

    useEffect(() => {
        const messageHandler = (data) => {
            setMessages(prevMessages => [...prevMessages, data]);
            console.log(data.message, data.id);
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
            <form>
                <input type="text" id='chatInput' /> <br />
                <button onClick={handleClick}>Send</button>
            </form>
            <ul>
                {messages.map((item, i) => (
                    <Message key={i} user={item.id === id ? '' : id} message={item.message} />
                ))}
            </ul>
        </div>
    );
};

export default GlobalChat;
