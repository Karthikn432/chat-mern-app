import React, { useLayoutEffect } from 'react'
import Sidebar from '../../components/sidebar/Sidebar'
import MessageContainer from '../../components/messages/MessageContainer'
import { useAuthContext } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { routePath } from '../../routes/RoutePath'

const Home = () => {
  const {authUser} = useAuthContext()
  const navigate = useNavigate()
  
  useLayoutEffect(()=>{
    if(!authUser){
      navigate(routePath.auth.login)
    }
  },[authUser])
  return (
    <div className="flex w-full p-6 rounded-lg shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0 ">
    <Sidebar />
    <MessageContainer />
  </div>
  )
}

export default Home