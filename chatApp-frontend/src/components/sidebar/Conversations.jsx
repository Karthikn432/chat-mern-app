import React, { useEffect } from 'react'
import Conversation from './Conversation'
import { useGetConversationUsersQuery } from '../../features/rtkquery/app-query/usersQuery'
import { useAuthContext } from '../../context/AuthContext'
import { useState } from 'react'
import { getAllChatUsers } from '../../features/slice/allChatUsersSlice'
import { useDispatch, useSelector } from 'react-redux'
import { updateUnviewedCounts } from '../../features/slice/newMessageSlice'
import { useSocketContext } from '../../context/SocketContext'

const Conversations = ({ searchTerm }) => {
    const { authUser } = useAuthContext()
    const { socket } = useSocketContext();

    const { data: conversationUsers, isLoading } = useGetConversationUsersQuery({
        search: searchTerm,
        page: "",
        per_page: "",
    });
    const dispatch = useDispatch();
    const unReadData = useSelector((state) => state.newMessageData.unviewedCounts);

    useEffect(() => {
        if (conversationUsers) {
            const unviewedCountPayload = [];
            conversationUsers.filteredUsers.forEach(user => {
                const unviewedCount = user.unviewedCount || 0;
                unviewedCountPayload.push({ userId: user._id, count: unviewedCount });
            });
            conversationUsers.userGroups.forEach(group => {
                const unviewedCount = group.unviewedCount || 0;
                unviewedCountPayload.push({ userId: group._id, count: unviewedCount });
            });
            dispatch(updateUnviewedCounts(unviewedCountPayload));
        }
    }, [conversationUsers, dispatch]);

    const getLocalSelectedData = localStorage.getItem("selected_conversation")
    const [selectedConversation, setSelectedConversation] = useState(getLocalSelectedData || null)


    if (isLoading) {
        return <div>Loading</div>
    }

    return (
        !isLoading && conversationUsers &&
        <div className='py-2 flex flex-col overflow-auto'>
            {
                conversationUsers?.filteredUsers?.length ? (
                    conversationUsers?.filteredUsers?.map((user, idx) =>
                        <Conversation
                            id={user._id}
                            key={idx}
                            name={user.fullName}
                            profile={user.profilePic}
                            isLastIdx={conversationUsers?.filteredUsers?.length - 1 === idx}
                            selectedConversation={selectedConversation}
                            setSelectedConversation={setSelectedConversation}
                            unviewedCount={unReadData[user._id] || 0}
                        />
                    )
                ) : "No Conversation"
            }
            {/* console.log({unReadData[group._id]}) */}

            {conversationUsers?.userGroups?.length && (
                conversationUsers.userGroups.map((group, idx) => (
                    <div key={idx} className='py-3'>
                        <Conversation
                            id={group._id}
                            name={group.name}
                            profile={group?.groupPic}
                            isLastIdx={group.length - 1 === idx}
                            selectedConversation={selectedConversation}
                            setSelectedConversation={setSelectedConversation}
                            unviewedCount={unReadData[group._id] || 0}
                        />
                    </div>
                ))
            )
            }
        </div>
    )
}

export default Conversations