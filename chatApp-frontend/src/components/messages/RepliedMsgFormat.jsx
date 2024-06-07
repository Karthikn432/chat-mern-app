import React from 'react'
import { useAuthContext } from '../../context/AuthContext';
import { useSelector } from 'react-redux';
import { extractTime } from '../../utils/utils';
import FileFormatRead from './FileFormatRead';

const RepliedMsgFormat = ({ chat, bubbleBgColor, shakeClass }) => {
    const { authUser } = useAuthContext();
    const chatSelectedData = useSelector(state => state.chatContactsData)

    return (
        <>
            <div className={`chat-bubble min-w-full text-black bg-blue-200  ${bubbleBgColor} ${shakeClass}`}>
                <div className='bg-white border border-gray-600 rounded-sm px-2'>
                    <div className='gap-2 items-center'>
                        <span className='font-bold ml-1'>{chat.senderId === authUser._id ? authUser.fullName : chatSelectedData.name}</span>
                        {/* <p>{chat?.repliedTo?.createdAt}</p> */}
                        <span className='opacity-80 text-xs ml-2' >{extractTime(chat?.repliedTo?.createdAt)} </span>
                        <p className='text-md ml-1'>{chat?.repliedTo?.message}</p>
                    </div>
                    <div className='flex items-center'>
                        {
                            chat?.repliedTo?.filepath && (
                                <div className='flex gap-3 items-center font-semibold'>
                                    {FileFormatRead(chat?.repliedTo?.filepath?.type)}
                                    <p>{chat?.repliedTo?.filepath?.name}</p>
                                </div>
                            )
                        }
                    </div>
                </div>

                <div>
                    <p>{chat?.message}</p>
                </div>
            </div>
            <div className="chat-footer text-white opacity-50 text-xs flex gap-1 items-center">{extractTime(chat.createdAt)}</div>
        </>
    )
}

export default RepliedMsgFormat