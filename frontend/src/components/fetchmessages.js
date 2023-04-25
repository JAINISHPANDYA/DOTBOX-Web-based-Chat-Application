import React from 'react'
import { ChatState } from '../context/ChatProvider';

const fetchmessages = () => {
    const { user, selectedChat, setSelectedChat, notification, setNotification,messages,setMessages} = ChatState();
  return (
    <div>fetchmessages</div>
  )
}

export default fetchmessages