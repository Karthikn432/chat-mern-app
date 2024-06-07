import React from 'react'
import SearchInput from './SearchInput'
import Conversations from './Conversations'
import LogoutButton from './LogoutButton'
import { useState } from 'react'
import GroupCreation from '../group-create/GroupCreation'
import useListenMessages from '../../hooks/useListenMessages'
import useListenUnviewedMsg from '../../hooks/useListenUnviewedMsg'


const Sidebar = () => {

  const [searchTerm, setSearchTerm] = useState("");
  useListenUnviewedMsg()
  return (
    <div className='border-r border-slate-500 p-4 flex flex-col min-w-[320px] w-full'>
      <SearchInput setSearchTerm={setSearchTerm} searchTerm={searchTerm} />
      <div className="divider px-3"></div>
      <Conversations searchTerm={searchTerm} />
      {/* <div className="divider px-3"></div> */}

      <div className='flex mt-auto justify-between'>
        <LogoutButton />
        <GroupCreation />
      </div>
    </div>
  )
}

export default Sidebar