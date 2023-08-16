import React, { useState } from 'react'
import {socket} from './SocketManager'

const CharacterMenu = () => {
  const [show, setshow] = useState(false);
  return (
    <div className='CharacterMenu'  >
      <h5> Character's Menu </h5>
      <button onClick={() => {

        setshow(!show);

        console.log(show);
      }} > Buy </button>

      {show && (<div className='images' >
        <img src="https://i.pinimg.com/236x/ba/c7/f3/bac7f398439af088efb6f98b97744201.jpg" alt="" width="100px" height="100px"
          onClick={(e) => socket.emit("change", 0)}
        />
        <img src="https://i.pinimg.com/236x/2d/15/a6/2d15a6815a0cf568b8efaa203ac2571b.jpg" alt="" width="100px" height="100px"
          onClick={(e) => socket.emit("change", 1)}
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