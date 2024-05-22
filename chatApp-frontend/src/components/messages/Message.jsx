import React from 'react'
import { useAuthContext } from '../../context/AuthContext'
import { useSelector } from 'react-redux';
import { extractTime } from '../../utils/utils';

const Message = ({ chat }) => {
    const { authUser } = useAuthContext();
    const chatContactsData = useSelector(state => state.chatContactsData)
    const fromMe = chat.senderId === authUser._id;

    // CSS Style CLass change
    const chatClassName = fromMe ?  "chat-end" : "chat-start"
    const profilePic = fromMe ? authUser.profilePic : chatContactsData.profile
    const bubbleBgColor = fromMe ? "bg-blue-500" : ""
    const shakeClass = chat?.shouldShake ? "shake" : ""
    return (
        <div className={`chat ${chatClassName}`}>
            <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                    <img alt='Tailwind CSS chat bubble component'
                        src={profilePic}
                    />
                </div>
            </div>
            <div className={`chat-bubble text-white bg-blue pb-1 ${bubbleBgColor} ${shakeClass}`}>{chat.message}</div>
            <div className="chat-footer text-white opacity-50 text-xs flex gap-1 items-center">{extractTime(chat.createdAt)}</div>
        </div>
    )
}

export default Message