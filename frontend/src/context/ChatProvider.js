import ChatContext from "./ChatContext";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useContext } from "react";


const ChatProvider = ({ children }) => {
  const [selectedChat, setSelectedChat] = useState();
  const [user, setUser] = useState();
  const [messages, setMessages] = useState([]);
  const [notification, setNotification] = useState([]);
  const [chats, setChats] = useState([]);
  const [updateMessages, setUpdateMessages] = useState(false);
  const [chatBg, setChatBg] = useState(false);
  const [chatBgOnNotification, setChatBgOnNotification] = useState(false);

  const history = useHistory();

  

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);

    if (!userInfo){
    history.push("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history]);
  return (
    <ChatContext.Provider
      value={{
        selectedChat, setSelectedChat,
        user, setUser,
        notification, setNotification,
        chats, setChats,
        messages, setMessages,
        updateMessages, setUpdateMessages,
        chatBg, setChatBg,
        chatBgOnNotification, setChatBgOnNotification,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
