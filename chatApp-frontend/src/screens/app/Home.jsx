import React, { useLayoutEffect } from 'react'
import Sidebar from '../../components/sidebar/Sidebar'
import MessageContainer from '../../components/messages/MessageContainer'
import { useAuthContext } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { routePath } from '../../routes/RoutePath'
import { useSelector } from 'react-redux'
import { useMediaQuery } from 'react-responsive'

const Home = () => {
  const { authUser } = useAuthContext()
  const navigate = useNavigate()
  const chatContactsData = useSelector(state => state.chatContactsData)
    const isMediumScreenOrSmaller = useMediaQuery({ query: '(max-width :640px)' })

  useLayoutEffect(() => {
    if (!authUser) {
      navigate(routePath.auth.login)
    }
  }, [authUser])
  return (
    <div className="flex w-full rounded-lg shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0 ">
      <div className={`${chatContactsData.id && isMediumScreenOrSmaller ? "hidden" : "flex"} w-full xl:w-1/4 `}>
        <Sidebar />
      </div>
      <div className={`${chatContactsData.id && isMediumScreenOrSmaller ? "flex" : "hidden"} sm:flex w-full`} >
        <MessageContainer />
      </div>
    </div>
  )
}

export default Home