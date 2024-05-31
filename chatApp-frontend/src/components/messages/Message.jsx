import React, { useEffect } from 'react'
import { useAuthContext } from '../../context/AuthContext'
import { useDispatch, useSelector } from 'react-redux';
import { extractTime } from '../../utils/utils';
import RenderFileContent from './RenderFileContent';
import PreviewFile from './PreviewFile';
import { useState } from 'react';
import { IoPencil, IoReloadSharp, IoTrash } from 'react-icons/io5';
import { IoMdMore } from 'react-icons/io';
import { selectedMsg } from '../../features/slice/selectedChatSlice';
import RepliedMsgFormat from './RepliedMsgFormat';
import { editMsg } from '../../features/slice/editChatSlice';
import EditMsgInput from './EditMsgInput';

const Message = ({ chat }) => {
    const { authUser } = useAuthContext();
    const editMsgData = useSelector(state => state.editMsgData);
    console.log({ editMsgData })

    const dispatch = useDispatch();

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

    const handleReply = async (chat) => {
        await dispatch(selectedMsg(chat))
    };

    const handleDelete = () => {
        console.log('Delete clicked');
        // Add your delete logic here
    };

    const handleEdit = async (chat) => {
        await dispatch(editMsg(chat))
    };

    const handleShowHoverOption = () => {
        setIsMegHovered(true)
    }


    const handleHideHoverOption = () => {
        setIsMegHovered(false);
    }

    // const handleMsgMoreClick = () => {
    //     setIsMegHovered(false)
    //     setIsShowMsgMoreOption(true)
    // }

    // const handleHideMoreOption =() =>{
    //     setIsShowMsgMoreOption(false)
    // }
    // console.log({chat})


    return (
        <div className={`chat ${chatClassName} `}>
            <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                    <img alt='Tailwind CSS chat bubble component'
                        src={profilePic}
                    />
                </div>
            </div>
            {
                editMsgData._id !== chat._id ? 
                (
                    <div className="relative" onMouseEnter={handleShowHoverOption} onMouseLeave={handleHideHoverOption}>

                {
                    chat.repliedTo && (
                        <RepliedMsgFormat chat={chat} bubbleBgColor={bubbleBgColor} shakeClass={shakeClass} />
                    )
                }
                {!chat.repliedTo && chat.filepath && (
                    <>
                        <div className={`chat-bubble min-w-full text-black bg-blue-100 ${bubbleBgColor} ${shakeClass}`} onClick={handleImageClick}>
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
                    !chat.filepath && !chat.repliedTo && (
                        <>
                            <div className={`chat-bubble min-w-full text-black bg-blue-200 pb-1 ${bubbleBgColor} ${shakeClass}`}>{chat.message}</div>
                            <div className="chat-footer text-white opacity-50 text-xs flex gap-1 items-center">{extractTime(chat.createdAt)}</div>
                        </>
                    )
                }

                {/* Hover buttons */}
                {
                    isMsgHoverd && (
                        <div className="absolute w-28 -top-8 rounded-lg px-2 py-1 left-0   bg-white" onMouseEnter={handleShowHoverOption} onMouseLeave={handleHideHoverOption}>
                            <button onClick={() => handleReply(chat)} className="text-black px-1 hover:text-blue-500">
                                <IoReloadSharp className="w-5 h-5 " />
                            </button>
                            <button onClick={() => handleDelete(chat)} className="text-black px-1 hover:text-red-500">
                                <IoTrash className="w-5 h-5" />
                            </button>
                            <button onClick={() => handleEdit(chat)} className="text-black px-1 hover:text-yellow-500">
                                <IoPencil className="w-5 h-5" />
                            </button>
                        </div>
                    )
                }
            </div>
                ) : (
                    <EditMsgInput editMsgData={editMsgData} />
                )
            }
        </div>
    )
}

export default Message