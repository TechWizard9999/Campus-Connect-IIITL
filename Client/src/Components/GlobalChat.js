import React, { useEffect, useState,useRef } from 'react';
import { socket } from './SocketManager';
import { useFrame } from '@react-three/fiber';
import Message from './Message';

const GlobalChat = () => {
    const [id, setId] = useState("");
    const [messages, setMessages] = useState([]);
    const [name, setName] = useState("");
    const chatlogRef = useRef(null);
    const scrollToBottom = () => {
        chatlogRef.current.scrollTop = chatlogRef.current.scrollHeight;
    };
// useFrame(()=>{
//     scrollToBottom();

// })
    const handleClick = (event) => {
        event.preventDefault();
        const message = document.getElementById('chatInput').value;
        if(message){
            socket.emit('message', { message, id, name });
            document.getElementById('chatInput').value = "";
            console.log(id);
            // scrollToBottom();
        }
        
    };
    useEffect(() => {
        const visitorName = prompt('Please enter your name:');
        if (visitorName) {
            setName(visitorName);

        }
    }, []);

    useEffect(() => {
        const messageHandler = (data) => {
            setMessages(prevMessages => [...prevMessages, data]);
            console.log(data.message, data.id);
        };
        // scrollToBottom();

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

            <form  >
                <input type="text" id='chatInput' />
                <button onClick={handleClick}>Send</button>
            </form>
            <div className='chatlog' ref={chatlogRef}  >
                {messages.slice().reverse().map((item, i) => (
                    <Message key={i} user={item.id === id ? '' : id} name={item.name} message={item.message} />
                ))}
            </div>

        </div>
    );
};

export default GlobalChat;
