import React from 'react'



const Message = ({ user,name, message }) => {
  

        return (
            <div className={`message`}>
                {`${name}: ${message}`}
            </div>
        )
    
}

export default Message