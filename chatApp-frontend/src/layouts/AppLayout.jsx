import React from 'react'
import { Outlet } from 'react-router-dom'

const AppLayout = () => {

  return (
    <div className='layout-bg'>
      <div className='h-screen flex items-center justify-center'>
        <div className="flex h-full w-full roundedf-lg overflow-hidden bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0 ">
          <Outlet/>
        </div>
      </div>
    </div>
  )
}

export default AppLayout