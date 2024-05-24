import React from 'react'
import Messages from './Messages'
import MessageInput from './MessageInput'
import { TiMessages } from 'react-icons/ti'
import {useDispatch, useSelector } from 'react-redux'
import { useAuthContext } from '../../context/AuthContext'
import { IoArrowBackCircleSharp } from 'react-icons/io5'
import { resetSelectedChatUser } from '../../features/slice/chatSlice'

const MessageContainer = () => {
    const chatContactsData = useSelector(state => state.chatContactsData)
    const dispatch = useDispatch()
    const handleBackConversation = async() =>{
        await dispatch(resetSelectedChatUser())
        console.log('called')
        localStorage.removeItem('selected_conversation')
    }
    console.log({chatContactsData})
    return (
        <div className="flex flex-col justify-center w-full">
            {
                !chatContactsData.id ? (<NoChatSelected />) : (
                    <>
                        {/* Header */}
                        <div className="bg-slate-500 px-4 py-3 mb-2 flex items-center gap-4">
                            {/* <span className="label-text">To:</span> */}
                            <span onClick={handleBackConversation}>
                            <IoArrowBackCircleSharp className='flex md:hidden w-8 h-8 text-white cursor-pointer hover:text-black'/>
                            </span>
                            <img src={chatContactsData.profile} alt="" className='w-10 h-10' />
                            <span className="text-gray-900 font-bold capitalize text-white">{chatContactsData?.name}</span>
                        </div>
                        {/* Messages */}
                        <Messages />

                        {/* MessageInput */}
                        <MessageInput />
                    </>
                )
        }
        </div>
    )
}

export default MessageContainer


const NoChatSelected = () => {
    const {authUser} = useAuthContext()
    return (
        <div className="flex items-center justify-center w-full h-full">
            <div className="px-4 text-center sm:text-lg md:text-xl text-gray-200 font-semibold flex flex-col items-center gap-2">
                <p className='capitalize'>Welcome 👋 {authUser.fullName}</p>
                <p>Select a chat to start messaging</p>
                <TiMessages className='text-3xl md:text-6xl items-center' />
            </div>
        </div>
    )
}