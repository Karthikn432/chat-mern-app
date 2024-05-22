import { useDispatch } from 'react-redux'
import { getSelectedChatUser } from '../../features/slice/chatSlice'
import { useSocketContext } from '../../context/SocketContext'

const Conversation = ({ name, profile, id, isLastIdx, selectedConversation, setSelectedConversation }) => {
    const { onlineUsers } = useSocketContext()
    const isOnline = onlineUsers?.includes(id)
    const dispatch = useDispatch()

    const handleSelectChatUser = async (id, name, profile) => {
        setSelectedConversation(id)
        dispatch(getSelectedChatUser({ id, name, profile }))
    }

    return (
        <>
            <div className={`flex gap-2 items-center hover:bg-yellow-500 rounded p-2 py-1 cursor-pointer ${selectedConversation === name ? "bg-sky-500" : ""}`} onClick={() => handleSelectChatUser(id, name, profile)}>
                <div className={`avatar ${isOnline ? "online" : "offline"}`}>
                    <div className="w-12 rounded-full">
                        <img src={profile ? profile : "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"} alt="user avatar" />
                    </div>
                </div>

                <div className="flex flex-col flex-1">
                    <div className="flex gap-3 justify-between">
                        <p className="font-bold text-gray-200 ">{name}</p>
                        <span className='text-xl'>🍅</span>
                    </div>
                </div>
            </div>
            {
                !isLastIdx &&
                <div className="divider my-1 py-1 h-1"></div>
            }
        </>
    )
}

export default Conversation