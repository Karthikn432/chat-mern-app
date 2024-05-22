import { useEffect } from "react"
import { useSocketContext } from "../context/SocketContext"
import { useAuthContext } from "../context/AuthContext"
import notificationSound from "../assets/sounds/notification.mp3"
const useListenMessages = ({ messages, setMessages }) => {

  const { socket } = useSocketContext();
  const { authUser } = useAuthContext();

  useEffect(() => {
    socket?.on("newMessage", (newMessage) => {
      const findSender = authUser._id === newMessage.receiverId
      if (findSender) {
        newMessage.shouldShake = true;
        const sound = new Audio(notificationSound);
        sound.play()
      }
      setMessages([...messages, newMessage])
    })

    return () => socket?.off("newMessage")
  }, [socket, setMessages, messages])
}

export default useListenMessages

// const handleNewMessage = (newMessage) => {
//   console.log({newMessage})
//     setMessages((prev) => [...prev, newMessage]);
//   };

//   socket?.on('newMessage', handleNewMessage);

//   return () => {
//     socket?.off('newMessage', handleNewMessage);
//   };