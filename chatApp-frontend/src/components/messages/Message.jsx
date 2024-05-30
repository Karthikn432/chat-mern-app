import React, { useEffect } from 'react'
import { useAuthContext } from '../../context/AuthContext'
import { useSelector } from 'react-redux';
import { extractTime } from '../../utils/utils';
import RenderFileContent from './RenderFileContent';
import PreviewFile from './PreviewFile';
import { useState } from 'react';
import { IoPencil, IoReloadSharp, IoTrash } from 'react-icons/io5';
import { IoMdMore } from 'react-icons/io';

const Message = ({ chat }) => {
    const { authUser } = useAuthContext();
    const chatContactsData = useSelector(state => state.chatContactsData)
    const fromMe = chat.senderId === authUser._id;
    // CSS Style CLass change
    const chatClassName = fromMe ? "chat-end" : "chat-start"
    const profilePic = fromMe ? authUser.profilePic : chatContactsData.profile
    const bubbleBgColor = fromMe ? "bg-blue-50" : ""
    const shakeClass = chat?.shouldShake ? "shake" : ""
    const [isMsgHoverd, setIsMegHovered] = useState(false)
    const [isImageClicked, setIsImageClicked] = useState(false);
    const [isShowMsgMoreOption, setIsShowMsgMoreOption] = useState(false)


    const handleImageClick = () => {
        setIsImageClicked(true)
    }

    const handleReply = () => {
        console.log('Reply clicked');
        // Add your reply logic here
    };

    const handleDelete = () => {
        console.log('Delete clicked');
        // Add your delete logic here
    };

    const handleEdit = () => {
        console.log('Edit clicked');
        // Add your edit logic here
    };

    const handleShowHoverOption = () => {
        setIsMegHovered(true)
    }


    const handleHideHoverOption = () => {
            setTimeout(() => {
                setIsMegHovered(false);
            }, 200);
    }

    // const handleMsgMoreClick = () => {
    //     setIsMegHovered(false)
    //     setIsShowMsgMoreOption(true)
    // }

    // const handleHideMoreOption =() =>{
    //     setIsShowMsgMoreOption(false)
    // }



    return (
        <div className={`chat ${chatClassName}`}>
            <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                    <img alt='Tailwind CSS chat bubble component'
                        src={profilePic}
                    />
                </div>
            </div>
            <div className="relative" onMouseEnter={handleShowHoverOption} onMouseLeave={handleHideHoverOption}>
                {chat.filepath && (
                    <>
                        <div className={`chat-bubble text-black bg-blue-100 ${bubbleBgColor} ${shakeClass}`} onClick={handleImageClick}>
                            {RenderFileContent(chat.filepath)}
                            <div className={`p-2`}>{chat?.message}</div>
                        </div>
                        <div className="chat-footer text-white opacity-50 text-xs flex gap-1 items-center">{extractTime(chat.createdAt)}</div>
                        {
                            isImageClicked && <PreviewFile fileData={chat.filepath} setIsImageClicked={setIsImageClicked} />
                        }
                    </>
                )
                }
                {
                    !chat.filepath && (
                        <>
                            <div className={`chat-bubble text-black bg-blue-200 pb-1 ${bubbleBgColor} ${shakeClass}`}>{chat.message}</div>
                            <div className="chat-footer text-white opacity-50 text-xs flex gap-1 items-center">{extractTime(chat.createdAt)}</div>
                        </>
                    )
                }
                {/* {
                    isMsgHoverd && (
                        <button className='absolute z-2 -top-10 px-2 py-1 rounded-md bg-white' onClick={handleMsgMoreClick} onMouseEnter={handleShowHoverOption} onMouseLeave={handleHideMoreOption}>
                            <IoMdMore className='w-7 h-7 text-black' />
                        </button>
                    )
                } */}
                {/* Hover buttons */}
                {
                    isMsgHoverd && (
                        <div className="absolute w-32 -top-9  rounded-lg px-4 py-1 right-0   bg-white" onMouseEnter={handleShowHoverOption} onMouseLeave={handleHideHoverOption}>
                            <button onClick={handleReply} className="text-black px-1.5 hover:text-blue-500">
                                <IoReloadSharp className="w-5 h-5 " />
                            </button>
                            <button onClick={handleDelete} className="text-black px-1.5 hover:text-red-500">
                                <IoTrash className="w-5 h-5" />
                            </button>
                            <button onClick={handleEdit} className="text-black px-1.5 hover:text-yellow-500">
                                <IoPencil className="w-5 h-5" />
                            </button>
                        </div>
                    )
                }

            </div>
        </div>
    )
}

export default Message