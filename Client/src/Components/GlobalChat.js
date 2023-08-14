import React from 'react'
import { socket } from './SocketManager'

const GlobalChat = () => {
    const HandleClick = ( event) =>{
        event.preventDefault();
    }

  return (
    <div className='GlobalChat' >  
    
    <form> <input type="text" /> <br />
    
    <button onClick={HandleClick} >Send</button  >
     </form>
     <ul id='messages' ></ul>
    
      </div>
  )
}

export default GlobalChat