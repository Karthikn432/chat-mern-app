import { useEffect } from "react";
import { useSocketContext } from "../context/SocketContext";
import { useAuthContext } from "../context/AuthContext";
import notificationSound from "../assets/sounds/notification.mp3";
import { addNewMessage, updateUnviewedCounts } from "../features/slice/newMessageSlice";
import { useDispatch } from "react-redux";

const useListenMessages = ({ setMessages, selectedChatId }) => {
    const { socket } = useSocketContext();
    const { authUser } = useAuthContext();
    const dispatch = useDispatch();

    useEffect(() => {
        const handleNewMessage = (newMessage, isGroupChat) => {
            console.log({ selectedChatId, isGroupChat, newMessage })
            if (isGroupChat) {
                if (newMessage.receiverId === selectedChatId) {
                    dispatch(addNewMessage(newMessage));
                    setMessages((prev) => [...prev, newMessage]);
                    const sound = new Audio(notificationSound);
                    sound.play();
                } else {
                    console.log({rid: newMessage.receiverId})
                    dispatch(updateUnviewedCounts([{ userId: newMessage.receiverId, count: 1 }]));
                }
            } else {
                if (newMessage.senderId === selectedChatId) {
                    dispatch(addNewMessage(newMessage));
                    setMessages((prev) => [...prev, newMessage]);
                    const sound = new Audio(notificationSound);
                    sound.play();
                } else {
                    dispatch(updateUnviewedCounts([{ userId: newMessage.senderId, count: 1 }]));
                }
            }
        };

        // const handleDeletedMessage = (messageId) => {
        //     setMessages((prevMessages) => prevMessages.filter(message => message._id !== messageId));
        // };

        // const handleEditedMessage = (editedMessage) => {
        //     if (editedMessage.receiverId === selectedChatId || editedMessage.senderId === selectedChatId) {
        //         setMessages((prevMessages) =>
        //             prevMessages.map((message) =>
        //                 message._id === editedMessage._id ? editedMessage : message
        //             )
        //         );
        //         const isReceiver = authUser._id === editedMessage.senderId;
        //         if (isReceiver) {
        //             const sound = new Audio(notificationSound);
        //             sound.play();
        //         }
        //     }
        // };

        socket?.on("newMessage", handleNewMessage);
        // socket?.on("deletedMessage", handleDeletedMessage);
        // socket?.on("editedMessage", handleEditedMessage);

        return () => {
            socket?.off("newMessage", handleNewMessage);
            // socket?.off("deletedMessage", handleDeletedMessage);
            // socket?.off("editedMessage", handleEditedMessage);
        };
    }, [socket, selectedChatId, authUser, dispatch]);

    return null;
};

export default useListenMessages;