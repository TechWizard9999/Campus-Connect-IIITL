import React, { useState } from 'react'
import Room from './Room';
import { socket } from "./SocketManager"


const Connect = () => {
    const [joined,setjoined]= useState(false);
  return (
    <div className='connect' > <h2>Virtual Connect</h2> 
      <button onClick={(e) => socket.emit("change")} >
        Change Character
      </button>
    
    {!joined && (<button onClick={()=>{setjoined(true)}} > Join Room </button>)}
    {joined && ( <Room />)}
    </div>

  )
}

export default Connect