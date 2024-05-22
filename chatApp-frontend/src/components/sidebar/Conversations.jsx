import React from 'react'
import Conversation from './Conversation'
import { useGetConversationUsersQuery } from '../../features/rtkquery/app-query/usersQuery'
import { useAuthContext } from '../../context/AuthContext'
import { useState } from 'react'

const Conversations = ({searchTerm}) => {
    const { authUser } = useAuthContext()
    
    const { data: conversationUsers, isLoading } = useGetConversationUsersQuery({
        search: searchTerm,
        page: "",
        per_page: "",
      });

    const [selectedConversation, setSelectedConversation] = useState(null)

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
                            isLastIdx={conversationUsers?.filteredUsers?.length- 1 === idx}
                            selectedConversation={selectedConversation}
                            setSelectedConversation={setSelectedConversation}
                        />
                    )
                ) : "No Conversation"
            }
        </div>
    )
}

export default Conversations