import React from 'react'
import SearchInput from './SearchInput'
import Conversations from './Conversations'
import LogoutButton from './LogoutButton'
import { useState } from 'react'


const Sidebar = () => {

  const [searchTerm, setSearchTerm] = useState("");

  
  return (
    <div className='border-r border-slate-500 p-4 flex flex-col'>
      <SearchInput setSearchTerm={setSearchTerm} searchTerm={searchTerm}/>
      <div className="divider px-3"></div>
      <Conversations searchTerm={searchTerm} />
      {/* <div className="divider px-3"></div> */}
      <LogoutButton />
    </div>
  )
}

export default Sidebar