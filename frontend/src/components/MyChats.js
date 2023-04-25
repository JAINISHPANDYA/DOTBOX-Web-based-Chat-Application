import { Box, useToast, Stack, Menu, MenuButton, MenuItem, MenuDivider, MenuList, Avatar, Input, Img, Circle, Text, InputGroup, InputLeftAddon} from '@chakra-ui/react';
import { ArrowBackIcon, AddIcon } from '@chakra-ui/icons'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { ChatState } from '../context/ChatProvider';
import GroupChatModal from './miscellaneous/groupChat/GroupChatModal'
import { getdecryption, getSender, getSenderPic } from './config/ChatLogics';
import "../components/MyChats.css"
import MyChatProfilePic from './miscellaneous/MyChatProfilePic';
import UserListItem from './UserAvatar/UserListItem';



const MyChats = ({ fetchAgain,setFetchAgain }) => {
    
  const baseURL = process.env.REACT_APP_SERVERURL;
  if (typeof baseURL !== 'undefined') {
    axios.defaults.baseURL = baseURL;
  }
  
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loggedUser, setLoggedUser] = useState();
    const [searchFocused, setSearchFocused] = useState(false);
    const [chatSearch, setChatSearch] = useState("");
    const [toSelectChat, setToSelectChat] = useState(undefined);
    const { selectedChat, setSelectedChat, user, chats, setChats, message, setNotification, notification, chatBg, setChatBg, chatBgOnNotification, setChatBgOnNotification } = ChatState();
  
    const toast = useToast();

    const onFocus = () => setSearchFocused(true);
    const onBlur = () => setSearchFocused(false);

    useEffect(() => {
     if (searchFocused === true) {
       document.getElementById('chatlist').style.display = 'none';
      } else if(searchFocused === false) {
       document.getElementById('chatlist').style.display = 'block';
     }
    }, [searchFocused])
    
    useEffect(() => {
      if(searchFocused === true) {
        document.getElementById('searchlist').style.display = 'block';
      } else if(searchFocused === false) {
        document.getElementById('searchlist').style.display = 'none';
      }
    }, [searchFocused])
   

    const getSearchList = (e) => {
      if(e.target.value === ""){
        onBlur()
      } else{
        onFocus()
      }
      setChatSearch(e.target.value)
      handleSearch(e.target.value)
    }

    const setSearchListblank = () => {
      setChatSearch("")
      onBlur()
    }

  
    const handleSearch = async (query) => {
      setSearch(query);
      if (!query) {
        return;
      }
  
      try {
        const config = { 
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.get(`/api/user?search=${search}`, config);
        setSearchResult(data.filter(obj => obj._id !== user._id));
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to Load the Search Results",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
      }
    };
  

    const accessChat = async (userId) => {
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        const info = new FormData();
        info.append('userId', userId);
        const { data } = await axios.post(`/api/chat`, info, config);
  
        if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
        
        setToSelectChat(data)
      } catch (error) {
        toast({
          title: "Error fetching the chat",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
      }
    };

    
  
    const fetchChats = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
  
        const { data } = await axios.get("/api/chat", config);
        await setChats(data);
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
      }
    };

    // ----------- to print the letest message in chatlist -------------------------------------------
    const letest_message = (conver) => {
      if(conver.latestMessage != undefined ){
        if(conver.latestMessage.messageType === "1"){
          const message = JSON.parse(JSON.stringify(conver.latestMessage.content));
          return getdecryption(message);
        } else if(conver.latestMessage.messageType === "2"){
          return 'sent you an image';
        } else if(conver.latestMessage.messageType === "3"){
          return 'sent you a file';
        } else if(conver.latestMessage.messageType === "4"){
          return 'sent you a video';
        } else if(conver.latestMessage.messageType === "5"){
          return 'send you an audio';
        } else {
          return 'This message is deleted';
        }
      } else {
        return("no messages");
      }
    }

    // ----------- to print the sender of message in chatlist ----------------------------------------------------- 
    const message_sender = (conversation) => {
      if(conversation.latestMessage != undefined){
        if(conversation.latestMessage.sender._id === user._id){
          return "You "
        } else {
          const sender = JSON.parse(JSON.stringify(conversation.latestMessage.sender.name));
          return sender; 
        }
      } else {
        return ;
      }
    }

    //--------- to select the chat when it is clicked ------------------------------------------------------------------------------------
  useEffect( async() => {
    if(toSelectChat !== undefined){
      if(selectedChat !== undefined){
        document.getElementById(selectedChat._id).style.background = "linear-gradient(145deg, #11143e, #14184a)";
      }
      
      await setSelectedChat(toSelectChat);
      document.getElementById(toSelectChat._id).style.background = "linear-gradient(145deg, #739ee6, #89bcff)"
      setNotification(notification.filter((n) => n.chat._id !== toSelectChat._id));
      setToSelectChat(undefined);
    }
  }, [toSelectChat])
    
    // ------------ get the link of profile pic of every chat -----------------------------------------------------------------
    const getpiclink = (chat, user) => {
      if(!chat.isGroupChat){
        const sender = getSenderPic(loggedUser, chat.users)
        return sender;
      } else{
        return chat.grouppic;
      }
    }

    //------------- get the sender name to show in every chat -------------------------------------------------------------------- 
    const getsendername = (chat,user) => {
      if(!chat.isGroupChat){
        const sender = getSender(user, chat.users).toLowerCase();
        return sender;
      } else {
        return chat.chatName.toLowerCase();
      }
    }

    //USE EFFECTS ------------------->>>>>>>>>>>>---------------------------------------->>>>>>>>-------------------------------------------------------------------------------->>>

    useEffect(() => {
      setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
      fetchChats();
    }, [fetchAgain]);

    useEffect(() => {
      if (selectedChat !== undefined) {
        document.getElementById(selectedChat._id).style.background = "linear-gradient(145deg, #739ee6, #89bcff)";
        setChatBgOnNotification(!chatBgOnNotification)
      }
    },[chatBgOnNotification])

    useEffect(() => {
      if(chatBg === true){
        document.getElementById(selectedChat._id).style.background = "linear-gradient(145deg, #11143e, #14184a)";
        setSelectedChat(undefined)
        setChatBg(!chatBg)
      }
    }, [chatBg])
    
  return (
    <Box
      display="flex"
      flexDir="column"
      alignItems="center"
      p={3}
      bg="#0c0e2b"
      w="27%"
      h="100%"
      borderRightWidth="1px"
      borderColor="#2c2c2c"
      ml={-2.5}
      mt={-2.5}
    >
      <Box
      pb={3}
      px={1}
      fontSize={{ base: "28px", md: "30px" }}
      d="flex"
      w="100%"
      justifyContent="space-between"
      alignItems="center"
      >
        <InputGroup>
        <InputLeftAddon h="35px" children={<ArrowBackIcon />} bg="#1d2055" border="0px" px="10px" onClick={() => setSearchListblank()} />
        <Input
        id="search"
        w="120%"
        h="35px"
        bg="#171844"
        pr="35px"
        border="0px"
        placeholder='Search'
        fontSize='15px'
        value={chatSearch}
        onChange={getSearchList}
        >
          </Input>
          </InputGroup>
        <Menu autoSelect={false}>

        <MenuButton
        fontSize="13px"
        marginRight="-12px"
        position="relative"
        left="-25px"
        >
        <AddIcon color="white" />
        </MenuButton>
        <MenuList bgColor="#0B0517" border="0px" >
              <GroupChatModal>
              <MenuItem fontSize="15px"  _hover={{ backgroundColor:"#17182a" }} _active={{ backgroundColor:"#17182a" }} >Create Group</MenuItem>
              </GroupChatModal>
            </MenuList>
          </Menu>
          </Box>
        <Box
        id='chatlist'
        display="flex"
        flexDir="column"
        p={1}
        w="100%"
        h="100%"
        borderRadius="15px"
        overflow="scroll"
        style={{
          display:"block"
        }}
        >
          {chats.length > 0 ? (
            <Stack overflowY='scroll'>
              {chats.map((chat) => {

                 return( 
                 <Box
                  className='chats'
                  id={chat._id}
                  onClick={() => setToSelectChat(chat)}
                  cursor="pointer"
                  width="100%"
                  borderRadius="9px"
                  fontSize="13px"
                  color={selectedChat === chat ? "white" : "white"}
                  px={4}
                  py={2}
                  key={chat._id}
                  display="flex"
                  flexDirection="row"
                  style={{
                    background: "linear-gradient(145deg, #11143e, #14184a)"
                  }}
                  >
                  <MyChatProfilePic zIndex={2} Link={getpiclink(chat,user)}>
                  <Avatar
                  w="50px"
                  h="50px"
                  cursor="pointer"
                  mr="10px"
                  zIndex={2}
                  name={getSender(loggedUser,chat.users)}
                  src={
                    !chat.isGroupChat ? (
                      getSenderPic(loggedUser,chat.users)
                      ):(
                        chat.grouppic
                        )
                      }
                      />
                      </MyChatProfilePic>


                  <Box
                  display="flex"
                  flexDir="column"
                  w="80%"
                  float="right"
                  >
                  <Box
                  float="left"
                  w="100%"
                  fontSize="20px"
                  >
                  {!chat.isGroupChat ? ( 
                    getSender(loggedUser,chat.users)
                    ) : chat.chatName } 

                  {notification.map((noti) => (
                    noti.chat._id === chat._id ? (
                      <Circle position="relative" float="right" top="0px" left="30px" size='10px' bg='blue.200' color='white'></Circle>
                      ) : (
                        <></>
                        )
                        ))}
                    </Box>
                   <Box
                   float="left"
                   w="90%"
                   h="20px"
                   top="-20px"
                   display="flex"
                   flexDir="row"
                   overflow="hidden"
                   >
                  {chat.isGroupChat ? (message_sender(chat) + " :") : null }{letest_message(chat)}
                     </Box>

                 
                     
                    </Box>
                    
                  </Box>
                 )
                
                
              }
              )
            }
            </Stack>
          ) : (
            <Box m="auto">
              <Text color="white" fontWeight="100" fontFamily="Work sans" fontSize="20px" >click on search to find people to chat with</Text>
            </Box>
            )
            }
      </Box>

      <Box
        id='searchlist'
        d="flex"
        flexDir="column"
        p={1}
        bg="tranperent"
        w="100%"
        h="100%"
        borderRadius="15px"
        overflow="scroll"
        style={{
          opacity: 1,
        }}
        >
          <Text fontSize="20px">
            Chats
          </Text>
          {chats.length > 0 ? (
            <Stack overflowY='scroll'>
              {chats.map((chat) => {
                <Box>chat.name</Box>
                if(getsendername(chat, loggedUser).indexOf(chatSearch.toLowerCase()) !== -1 ){
                 return(
                  <Box
                  className='chats'
                  id={chat._id}
                  onClick={() => setToSelectChat(chat)}
                  cursor="pointer"
                  borderRadius="7px"
                  fontSize="15px"
                  color={selectedChat === chat ? "white" : "white"}
                  px={4}
                  py={2}
                  key={chat._id}
                  display="flex"
                  flexDirection="row"
                  style={{
                    background: "linear-gradient(145deg, #11143e, #14184a)"
                  }}
                  >
                  <MyChatProfilePic zIndex={2} Link={getpiclink(chat,user)}>
                  <Avatar
                  w="50px"
                  h="50px"
                  cursor="pointer"
                  mr="10px"
                  style={{
                    zIndex: 2,
                  }}
                  name={getSender(loggedUser,chat.users)}
                  src={
                    !chat.isGroupChat ? (
                      getSenderPic(loggedUser,chat.users)
                      ):(
                        chat.grouppic
                        )
                      }
                      />
                      </MyChatProfilePic>


                  <Box
                  display="flex"
                  flexDir="column"
                  w="80%"
                  float="right"
                  >
                  <Box
                  float="left"
                  w="90%"
                  fontSize="20px"
                  >
                  {!chat.isGroupChat ? ( 
                    getSender(loggedUser,chat.users)
                    ) : chat.chatName } 

                  {notification.map((noti) => (
                    noti.chat._id === chat._id ? (
                      <Circle position="relative" float="right" top="0px" left="30px" size='10px' bg='blue.200' color='white'></Circle>
                      ) : (
                        <></>
                        )
                        ))}
                    </Box>
                   <Box
                   float="left"
                   w="90%"
                   h="20px"
                   top="-20px"
                   display="flex"
                   flexDir="row"
                   overflow="hidden"
                   >
                  {chat.isGroupChat ? message_sender(chat) + ':' : null} {letest_message(chat)}
                     </Box>
                    </Box>
                  </Box>
                 )}
              })
            }
            <Text fontSize="20px">Users</Text>
            {searchResult.map((user) => {
                return(
                  <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                  />
                  )
            })
            }
            </Stack>
          ) : (
            <Box m="auto">
              <Text color="white" fontWeight="100" fontFamily="Work sans" fontSize="40px" >click on + and search users to chat with</Text>
            </Box>
            )
            }
            </Box>
    </Box>
  )
}

export default MyChats;