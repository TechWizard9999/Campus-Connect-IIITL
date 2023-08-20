import React from 'react'



const Message = ({ user, name, message }) => {


    return (
        <div className={`message`}>
            <p> {`  ${name}: ${message}`} </p>
        </div>
    )

}

export default Message