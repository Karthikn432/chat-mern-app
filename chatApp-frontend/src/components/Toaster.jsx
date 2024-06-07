import React from 'react'

const Toaster = ({message,type}) => {
    console.log({message,type})
    return (
        <div className="toast toast-top">
            <div className={`alert alert-success `}>
                <span>{message}</span>
            </div>
        </div>
    )
}

export default Toaster