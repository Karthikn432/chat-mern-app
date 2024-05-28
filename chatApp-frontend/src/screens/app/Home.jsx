import React, { useLayoutEffect } from 'react'
import Sidebar from '../../components/sidebar/Sidebar'
import MessageContainer from '../../components/messages/MessageContainer'
import { useAuthContext } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { routePath } from '../../routes/RoutePath'
import { useSelector } from 'react-redux'
import { useMediaQuery } from 'react-responsive'
import { useEffect } from 'react'

const Home = () => {
  const { authUser } = useAuthContext()
  const navigate = useNavigate()
  const chatContactsData = useSelector(state => state.chatContactsData)
    const isMediumScreenOrSmaller = useMediaQuery({ query: '(max-width :767px)' })

  useLayoutEffect(() => {
    if (!authUser) {
      navigate(routePath.auth.login)
    }
  }, [authUser])
  useEffect(()=>{
    console.log('first')
  },[chatContactsData])
  return (
    <div className="flex w-full rounded-lg shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0 ">
      <div className={`${chatContactsData.id && isMediumScreenOrSmaller ? "hidden" : "flex"} `}>
        <Sidebar />
      </div>
      <div className={`${chatContactsData.id && isMediumScreenOrSmaller ? "flex" : "hidden"} sm:flex w-full`} >
        <MessageContainer />
      </div>
    </div>
  )
}

export default Home