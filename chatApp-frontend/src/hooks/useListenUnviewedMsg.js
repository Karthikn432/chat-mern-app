import { useEffect } from "react";
import { useSocketContext } from "../context/SocketContext";
import { useAuthContext } from "../context/AuthContext";
import notificationSound from "../assets/sounds/notification.mp3";
import { addNewMessage, updateUnviewedCounts } from "../features/slice/newMessageSlice";
import { useDispatch, useSelector } from "react-redux";

const useListenUnviewedMsg = () => {
    const { socket } = useSocketContext();
    const { authUser } = useAuthContext();
    const dispatch = useDispatch()
    const chatContactsData = useSelector(state => state.chatContactsData);
    useEffect(() => {
        if (!chatContactsData) {
            const handleNewMessage = (newMessage) => {
                const userId = authUser.id === newMessage.senderId ? newMessage.senderId : newMessage.receiverId;
                dispatch(updateUnviewedCounts([{ userId, count: 1 }]));
                const sound = new Audio(notificationSound);
                sound.play();
            };

            socket?.on("newMessage", handleNewMessage);
            // socket?.on("deletedMessage", handleDeletedMessage);
            // socket?.on("editedMessage", handleEditedMessage);

            return () => {
                socket?.off("newMessage", handleNewMessage);
                // socket?.off("deletedMessage", handleDeletedMessage);
                // socket?.off("editedMessage", handleEditedMessage);
            };
        }

    }, [socket, authUser, dispatch, chatContactsData]);

    return null;
};

export default useListenUnviewedMsg;