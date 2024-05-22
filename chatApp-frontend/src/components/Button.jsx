import React from 'react'

const Button = (name) => {
    return (
        <div className='flex justify-center'>
            <button className='btn btn-sm mt-2 px-10 bg-slate-800 text-white hover:text-black'>{name}</button>
        </div>
    )
}

export default Button