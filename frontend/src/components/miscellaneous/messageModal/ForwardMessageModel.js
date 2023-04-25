import {
    Avatar,
    Box,
    Button,
    Divider,
    Input,
    InputGroup,
    InputLeftAddon,
    Modal,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Stack,
    Text,
    useDisclosure,
    useToast,
  } from "@chakra-ui/react";
  import React, { useEffect, useState } from "react";
  import axios from "axios";
  import io from "socket.io-client";
  import { ChatState } from "../../../context/ChatProvider";
  import { getencryption } from "../../config/ChatLogics";
  import "./FileMessageModal.css";
  import Send from "../../../assets/send.png";
  import { getdecryption, getSender, getSenderPic } from '../../config/ChatLogics';
  import { ArrowBackIcon, AddIcon, CheckCircleIcon} from '@chakra-ui/icons'

  
  const ENDPOINT = process.env.REACT_APP_SERVERURL;
  
  var socket;
  
  const ForwardMessageModel = ({ children, setFetchAgain, fetchAgain, message}) => {
    const OverlayOne = () => (
      <ModalOverlay
        bg="blackAlpha.300"
        backdropFilter="blur(10px) hue-rotate(0deg)"
      />
    );
    const OverlayTwo = () => (
      <ModalOverlay
        bg="none"
        backdropFilter="auto"
        backdropInvert="80%"
        backdropBlur="2px"
      />
    );
    const {
      user,
      selectedChat,
      chats,
      updateMessages,
      setUpdateMessages,
    } = ChatState();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [overlay, setOverlay] = React.useState(<OverlayOne />);
    const [socketConnected, setSocketConnected] = useState(false);
    const [chatSearch, setChatSearch] = useState("");
    const [chatList, setChatList] = useState([]);
    const toast = useToast();

  
    
  
    useEffect(() => {
      socket = io(ENDPOINT);
      socket.emit("setup", user);
      socket.on("connected", () => setSocketConnected(true));
      // eslint-disable-next-line
    }, []);
  
    const setSearchListblank = async() => {
        await setChatSearch('')
        await setChatList([''])
        onClose()
    }

    const addtochatlist = async(chat) => {
        console.log(chatList)
        if (chatList.includes(chat)) {
            setChatList(chatList.filter(chatlist => chatlist._id !== chat._id))
          } else {
            await setChatList([...chatList, chat]);
        }   
    }

    useEffect(() => {
      console.log(chatList)
    }, [chatList])
    

  
  
  
  
    const handlechanges = async () => {
        if (chatList.length === 0) {
            toast({
                title: "Please select chat!",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
              });
              return;
        }
        try {
          const config = {
            headers: {
              "Content-type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
          };
          console.log(chatList.length);
  
          const info = new FormData;
          info.append('sender', user._id)
          info.append('messageType',`${message.messageType}`)
          info.append('content', message.content)
          if(message.messageType !== "1"){
              info.append('File', message.File)
              info.append('FileName', message.FileName)
            }


          for (let i = 0; i < chatList.length; i++) {
            console.log(chatList[i]._id)
            info.append('chat',chatList[i]._id)
            const { data } = await axios.post("/api/messages/forward", info, config);
            socket.emit("new message", data);
            setUpdateMessages(true);
            
            if(i === chatList.length - 1){
                onClose()
                setFetchAgain(!fetchAgain)
                }
          }
        } catch (error) {
          toast({
            title: "Error Occured!",
            description: error.message,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
        }
    };
  
        //------------- get the sender name to show in every chat -------------------------------------------------------------------- 
        const getsendername = (chat,user) => {
            if(!chat.isGroupChat){
              const sender = getSender(user, chat.users).toLowerCase();
              return sender;
            } else {
              return chat.chatName.toLowerCase();
            }
          }
      

    return (
      <div>
        <>
          <span onClick={onOpen}>{children}</span>
  
          <Modal isCentered isOpen={isOpen} onClose={onClose}>
            {overlay}
            <ModalContent
              h="700px"
              maxW="4000px"
              my="0"
              w="430px"
              bg="#171844"
              overflow="hidden"
            >
              <ModalCloseButton
                color="white"
                _focus={{
                  boxShadow: "none",
                }}
              />
              <ModalHeader color="white">Forward Message</ModalHeader>
              <Box w="90%" h="87%" mx="auto" borderRadius="15px">
                  <Text w="100%" px="10px" color="white" fontSize="18px" mb="10px" >select chat</Text>
                  <InputGroup color="white">
                  <InputLeftAddon h="35px" children={<ArrowBackIcon />} bg="blue.200" border="0px" px="6px" onClick={() => setSearchListblank()} />
                  <Input
                    id="search"
                    w="100%"
                    h="35px"
                    bg="blue.200"
                    pr="35px"
                    border="0px"
                    placeholder='Search'
                    fontSize='15px'
                    mb="10px"
                    value={chatSearch}
                    onChange={(e) => setChatSearch(e.target.value)}
                    >
                    </Input>
                    </InputGroup>
                    <Divider w="112%" color="gray.700" borderBottomWidth="2px" mx="auto" ml="-23px"></Divider>
                    <Box
                    w="100%"
                    h="80%"
                    bg="#20215b"
                    px="5px"
                    py="15px"
                    mt="10px"
                    borderRadius="15px"
                    >
            {chats.length > 0 ? (
            <Stack overflowY='scroll'>
              {chats.map((chat) => {
                if(getsendername(chat, user).indexOf(chatSearch.toLowerCase()) !== -1 ){
                 return(
                  <Box
                  className='chats'
                  id={chat._id}
                  cursor="pointer"
                  borderRadius="7px"
                  fontSize="15px"
                  color="white"
                  w="100%"
                  px={9}
                  py={2}
                  key={chat._id}
                  onClick={() => addtochatlist(chat)}
                  display="flex"
                  flexDirection="row"
                  style={{
                      background: "linear-gradient(145deg, #9adbff, #82b9dc)"
                    }}
                    >
                    
                {chatList.includes(chat) ? (<CheckCircleIcon zIndex={3} my="auto" mx="10px" ml="-20px" color="white" />) : null}
                  <Avatar
                  w="50px"
                  h="50px"
                  cursor="pointer"
                  mr="10px"
                  style={{
                      zIndex: 2,
                    }}
                    name={getSender(user,chat.users)}
                    src={
                        !chat.isGroupChat ? (
                            getSenderPic(user,chat.users)
                            ):(
                                chat.grouppic
                                )
                            }
                            /> 


                  <Box
                  float="right"
                  w="90%"
                  my="auto"
                  fontSize="20px"
                  >
                  {!chat.isGroupChat ? ( 
                      getSender(user,chat.users)
                      ) : chat.chatName } 
                    </Box>
                  </Box>
                 )}
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
                    <Button w="100%" h="35px" my="10px" bg="blue.200" color="blue.800" onClick={() => handlechanges()} >send</Button>
              </Box>
            </ModalContent>
          </Modal>
        </>
      </div>
    );
  };
  
  export default ForwardMessageModel;
  