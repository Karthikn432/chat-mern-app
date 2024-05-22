import React from 'react'
import { Outlet } from 'react-router-dom'

const AppLayout = () => {

  return (
    <div className='layout-bg'>
      <div className='p-4 h-screen flex items-center justify-center'>
        <div className="flex sm:h-[450px] md:h-[650px] roundedf-lg overflow-hidden bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0 ">
          <Outlet/>
        </div>
      </div>
    </div>
  )
}

export default AppLayout