import { Box } from "@chakra-ui/layout"
import SideDrawer from "../components/miscellaneous/SideDrawer";
import React, { useState } from "react";
import {  useDisclosure } from "@chakra-ui/react";
import { ChatState } from "../context/ChatProvider";
import MyChats from "../components/MyChats";
import Chatbox from "../components/ChatBox";

const ChatPage = () => {
  
  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);

  return <div style={{ width: "100%" ,color:"white" }}>
       {user && <SideDrawer/> } 
    <Box
    d="flex"
    w='100%'
    h='91.5vh'
    p='10px'
    >
      {user && <MyChats fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
      {user && <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
    </Box>
    </div>
};

export default ChatPage;
