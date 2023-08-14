import React, { useEffect } from 'react'
import {useAtom,atom} from 'jotai'
// import {io} from 'socket.io-client'
// export const socket = io.connect("http://localhost:3001") 
// agora



const io = require("socket.io-client");
 export const  socket = io("http://localhost:3001", {
    withCredentials: true,
    
}); 
export const charactersAtom = atom([]);
export const SocketManager = () => {
    const [_characters,setCharacters]= useAtom(charactersAtom);
    console.log(_characters);
  useEffect(()=>{
    function onConnect(){
        console.log("Connected")
    }
   function onDisconnect(){
    console.log("Disconnected")

   }
   function onCharacters(value){
    // console.log("Characters")
    setCharacters(value);
   }
   function onHello(){
    console.log("hellow");
   }
socket.on("connect", onConnect);
socket.on("disconnect", onDisconnect);
socket.on("hello", onHello);
socket.on("characters", onCharacters);
return()=>{
socket.off("connect", onConnect);
socket.off("disconnect", onDisconnect);
socket.off("hello", onHello);
socket.off("characters",onCharacters)
}

},[])
}

// export default SocketManager