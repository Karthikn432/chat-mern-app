import React, { useEffect, useState } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import { useDispatch, useSelector } from 'react-redux';
import { extractTime } from '../../utils/utils';
import RenderFileContent from './RenderFileContent';
import PreviewFile from './PreviewFile';
import { IoPencil, IoReloadSharp, IoTrash } from 'react-icons/io5';
import { selectedMsg } from '../../features/slice/selectedChatSlice';
import RepliedMsgFormat from './RepliedMsgFormat';
import { editMsg } from '../../features/slice/editChatSlice';
import EditMsgInput from './EditMsgInput';
import { useDeleteMessageMutation } from '../../features/rtkquery/app-query/usersQuery';
import Toaster from '../Toaster';

const Message = ({ chat }) => {
    const { authUser } = useAuthContext();
    const editMsgData = useSelector(state => state.editMsgData);
    const dispatch = useDispatch();
    const [deleteMessage] = useDeleteMessageMutation()
    const chatContactsData = useSelector(state => state.chatContactsData);
    const fromMe = chat.senderId === authUser._id;

    const chatClassName = fromMe ? "chat-end" : "chat-start";
    const profilePic = fromMe ? authUser.profilePic : chatContactsData.profile;
    const bubbleBgColor = fromMe ? "bg-blue-50" : "";
    const shakeClass = chat?.shouldShake ? "shake" : "";

    const [isMsgHovered, setIsMsgHovered] = useState(false);
    const [clickedFileIndex, setClickedFileIndex] = useState(null);

    const handleImageClick = (index) => {
        setClickedFileIndex(index);
    };

    const handleReply = async (chat) => {
        await dispatch(selectedMsg(chat));
    };

    const handleDelete = async (chat) => {
        try {
            console.log({ dummy: chat._id })
            const result = await deleteMessage({ id: chat._id })
            if (result.data) {
                console.log({ data: result.data })
                return <Toaster message={result.data} type='success' />;
            } else {
                console.log('error')
            }
        } catch (error) {
            console.log({ error })
        }
    };

    const handleEdit = async (chat) => {
        await dispatch(editMsg(chat));
    };

    const handleShowHoverOption = () => {
        setIsMsgHovered(true);
    };

    const handleHideHoverOption = () => {
        setIsMsgHovered(false);
    };

    return (
        <div className={`chat ${chatClassName}`}>
            <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                    <img alt='Profile' src={profilePic} />
                </div>
            </div>
            {
                editMsgData?._id !== chat._id ? (
                    <div className="relative" onMouseEnter={handleShowHoverOption} onMouseLeave={handleHideHoverOption}>
                        {chat.repliedTo && (
                            <RepliedMsgFormat chat={chat} bubbleBgColor={bubbleBgColor} shakeClass={shakeClass} />
                        )}

                        {chat.filepath.length > 0 && (
                            <div className={`chat-bubble min-w-full text-black bg-blue-100 ${bubbleBgColor} ${shakeClass}`}>
                                {chat.filepath.map((file, idx) => (
                                    <div key={idx} className='m-2' onClick={() => handleImageClick(idx)}>
                                        <RenderFileContent filepath={file} />
                                    </div>
                                ))}
                                <div className={`p-2`}>{chat?.message}</div>
                            </div>
                        )}

                        {chat.filepath.length === 0 && !chat.repliedTo && (
                            <>
                                {/* <p className='text-white'>{chat.filepath.length}</p> */}
                                <div className={`chat-bubble min-w-full text-black bg-blue-200 pb-1 ${bubbleBgColor} ${shakeClass}`}>{chat.message}</div>
                                {/* <div className="chat-footer text-white opacity-70 text-xs flex gap-1 items-center">{chat.editedAt ? `Edited : ${extractTime(chat.editedAt)}` : extractTime(chat.createdAt)}</div> */}
                            </>
                        )}

                        {isMsgHovered && (
                            <div className="absolute w-28 -top-8 rounded-lg px-2 py-1 left-0 bg-white" onMouseEnter={handleShowHoverOption} onMouseLeave={handleHideHoverOption}>
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
                        )}

                        <div className="chat-footer text-white opacity-50 text-xs flex gap-1 items-center">{extractTime(chat.createdAt)}</div>
                        {clickedFileIndex !== null && (
                            <PreviewFile
                                fileData={chat.filepath[clickedFileIndex]}
                                setIsImageClicked={() => setClickedFileIndex(null)}
                            />
                        )}
                    </div>
                ) : (
                    <EditMsgInput editMsgData={editMsgData} />
                )
            }

        </div>
    );
};

export default Message;
