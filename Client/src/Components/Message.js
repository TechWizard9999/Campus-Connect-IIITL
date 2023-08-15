import React from 'react'



const Message = ({ user, message }) => {
    if (user) {
        return (
            <div className={`messageBox`}  >
                {`${user}: ${message}`}
            </div>
        )
    }
    else {


        return (
            <div className={`messageBox`}>
                {`You: ${message}`}
            </div>
        )
    }
}

export default Message