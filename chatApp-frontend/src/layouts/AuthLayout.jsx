import React from 'react'
import './layout.css'
import { Outlet } from 'react-router-dom'
const AuthLayout = () => {
  return (
    <div className='layout-bg'>
      <div className='p-4 h-screen flex items-center justify-center'>
        <div className="flex flex-col justify-center min-w-96 mx-auto">
          <div className="w-full p-6 rounded-lg shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0 ">
            <Outlet/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthLayout