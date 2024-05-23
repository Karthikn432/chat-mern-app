import React from 'react'
import './layout.css'
import { Outlet } from 'react-router-dom'
const AuthLayout = () => {
  return (
    <div className='layout-bg'>
      <div className='p-4 h-screen flex items-center justify-center'>
        <div className="flex flex-col justify-center min-w-64 w-1/2 2xl:w-1/3 mx-auto">
          <div className="w-full p-6 rounded-lg shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0 ">
            <Outlet/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthLayout