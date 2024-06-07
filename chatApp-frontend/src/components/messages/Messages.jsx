import Message from './Message';
import { useSelector, useDispatch } from 'react-redux';
import { useGetSelectedUserMessagesQuery, useSetAsReadMessagesMutation } from '../../features/rtkquery/app-query/usersQuery';
import MessageSkeleton from '../skeletons/MessageSkeleton';
import { useRef, useEffect } from 'react';
import { updateAsViewed } from '../../features/slice/newMessageSlice'; // Update import
import useListenMessages from '../../hooks/useListenMessages';
import { useState } from 'react';

const Messages = () => {
    const dispatch = useDispatch();
    const chatContactsData = useSelector(state => state.chatContactsData);
    const unReadData = useSelector((state) => state.newMessageData.unviewedCounts);
    const lastMsgRef = useRef();
    const { data: getSelectedUserMessages, isLoading, refetch } = useGetSelectedUserMessagesQuery(chatContactsData?.id, {
        skip: !chatContactsData,
    });
    const [setAsReadMessages] = useSetAsReadMessagesMutation()
    const readNewMessage = useSelector((state) => state.newMessageData.newMessages);
    const [messages, setMessages] = useState()
    useListenMessages({ selectedChatId: chatContactsData?.id, setMessages });


    useEffect(() => {
        if (unReadData[chatContactsData.id] > 0) {
            refetch();
            console.log('called')
        }
    }, [chatContactsData, unReadData]);

    useEffect(() => {
        if (getSelectedUserMessages) {
            setMessages(getSelectedUserMessages)
        }
    }, [getSelectedUserMessages]);

    useEffect(() => {
        const markMessagesAsViewed = async () => {
            try {
                if (messages && messages.length > 0) {
                    const messageIds = messages.map(message => message._id);
                    const response = await setAsReadMessages({ messageIds });
                    await dispatch(updateAsViewed({ userId: chatContactsData.id, count: 0 }));
                    console.log('printed')
                }
            } catch (error) {
                console.error('Error marking messages as viewed:', error);
            }
        };
        markMessagesAsViewed();
    }, [chatContactsData.id]);



    useEffect(() => {
        setTimeout(() => {
            lastMsgRef?.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    }, [lastMsgRef, messages]);

    if (isLoading) {
        return (
            <div className='px-8 md:px-16 lg:px-32 xl:px-64 flex-1 overflow-auto'>
                {isLoading && [...Array(3)].map((_, idx) => <MessageSkeleton key={idx} />)}
            </div>
        );
    }
    return (
        <div className='px-8 py-4 md:px-16 lg:px-32 xl:px-64 flex-1 overflow-auto'>
            {
                messages?.length ? (
                    messages.map((chat, idx) => (
                        <div ref={lastMsgRef} key={idx} className='mt-4'>
                            <Message chat={chat} dateString={chat.createdAt} senderId={chat.senderId} shake={chat.shouldShake} />
                        </div>
                    ))
                ) : <p className='text-center text-white opacity-70'>Send a message to start the conversation</p>
            }
        </div>
    );
};

export default Messages;
