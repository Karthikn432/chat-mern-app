import Message from './Message'
import { useSelector } from 'react-redux'
import { useGetSelectedUserMessagesQuery } from '../../features/rtkquery/app-query/usersQuery'
import MessageSkeleton from '../skeletons/MessageSkeleton'
import { useRef, useEffect } from 'react'
import useListenMessages from '../../hooks/useListenMessages'
import { useState } from 'react'

const Messages = () => {
    const [messages, setMessages] = useState([]);
    const chatContactsData = useSelector(state => state.chatContactsData)
    const lastMsgRef = useRef()
    const {data:getSelectedUserMessages, isLoading} = useGetSelectedUserMessagesQuery(chatContactsData?.id, {
        skip : !chatContactsData,
      });
      useListenMessages({messages, setMessages});
      console.log({messages})
      useEffect(() => {
        if (getSelectedUserMessages) {
          setMessages(getSelectedUserMessages);
        }
      }, [getSelectedUserMessages]);
      

      useEffect(()=>{
        setTimeout(()=> {
            lastMsgRef.current.scrollIntoView({behavior : "smooth"})
        },100)
      }, [messages])
      console.log({messages})

    if(isLoading){
        return (
            <div className='px-4 flex-1 overflow-auto'>
                {isLoading && [...Array(3)].map((_, idx) => <MessageSkeleton key={idx}/>)}
            </div>
        )
    }


    return (
        <div className="px-4 flex-1 overflow-auto">
           {
            messages?.length ? (
                messages?.map((chat, idx)=>(
                    <div ref={lastMsgRef}  key={idx}>
                         <Message chat={chat} dateString={chat.createdAt} senderId={chat.senderId} shake={chat}/>
                    </div>
                   
                ))
            )  : <p className='text-center text-white opacity-70'>Send a message to start the conversation</p>
           }
        </div>
    )
}

export default Messages