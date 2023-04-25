import React, { useState, useEffect } from "react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  Box,
  FormControl,
  IconButton,
  Text,
  Input,
  useToast,
  Avatar,
  position,
  Image,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Center,
} from "@chakra-ui/react";
import { Spinner } from "@chakra-ui/react";
import { ChatState } from "../context/ChatProvider";
import { getencryption, getSender, getSenderFull } from "./config/ChatLogics";
import ProfileModal from "./miscellaneous/ProfileModel";
import UpdateGroupChatModal from "./miscellaneous/groupChat/UpdateGroupChatModal";
import axios from "axios";
import "./style.css";
import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client";
import Lottie from "react-lottie";
import animationData from "../animations/dote-typing-animation.json";
import emojipic from "../assets/image-removebg-preview.png";
import Picker from "emoji-picker-react-2"
import clickUser from "../assets/clickuser.png";
import back from "../assets/blur.jpg";
import upin from "../assets/upin.png";
import { IoImage, IoDocument, IoVideocam, IoVolumeHigh} from "react-icons/io5";
import ImageMessageModal from "./miscellaneous/messageModal/ImageMessageModal";
import FileMessageModal from "./miscellaneous/messageModal/FileMessageModal";
import VideoMessageModal from "./miscellaneous/messageModal/VideoMessageModal";
import AudioMessageModal from "./miscellaneous/messageModal/AudioMessageModal";
import "../components/SingleChat.css"


const ENDPOINT = process.env.REACT_APP_SERVERURL;
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const {
    user,
    selectedChat,
    setSelectedChat,
    notification,
    setNotification,
    messages,
    setMessages,
    updateMessages,
    setUpdateMessages,
    chatBg,
    setChatBg,
  } = ChatState();
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState();
  const [socketAddUserChat, setSocketAddUserChat] = useState();
  const [socketAddAdminChat, setSocketAddAdminChat] = useState();
  const [socketRemoveUserChat, setSocketRemoveUserChat] = useState();
  const [socketRemoveAdminChat, setSocketRemoveAdminChat] = useState();
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const toast = useToast();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };






  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `/api/messages/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");

        const info = new FormData;
        info.append('content', getencryption(newMessage))
        info.append('chatId', selectedChat._id)
        info.append('messageType', "1")
        const { data } = await axios.post("/api/messages", info, config);

        socket.emit("new message", data);
        setMessages([...messages, data]);
        setFetchAgain(!fetchAgain)
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "cannot sent the message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
      setNewMessage(undefined);
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    fetchMessages();

    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  console.log(notification, "--------------------------");
  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
        setFetchAgain(!fetchAgain)
      }
    });
  });

  // user add socket
  useEffect(() => {
    socket.on("userupdate",(useradded) => {
      setSocketAddUserChat(JSON.parse(JSON.stringify(useradded)))
    });
  });

  // user remove socket
  useEffect(() => {
    socket.on("userremoved",(userremove) => {
      setSocketRemoveUserChat(JSON.parse(JSON.stringify(userremove)))
    });
  });

  // admin add socket
  useEffect(() => {
    socket.on("adminadded",(addedadmin) => {
      console.log('admin added')
      setSocketAddAdminChat(JSON.parse(JSON.stringify(addedadmin)))
    });
  });

    // admin remove socket
    useEffect(() => {
      socket.on("adminremoved",(removedadmin) => {
        console.log('admin removed')
        setSocketRemoveAdminChat(JSON.parse(JSON.stringify(removedadmin)))
      });
    });





  // to delete chat from app
  useEffect(() => {
    socket.on("deletedchat",(userremove) => {
      if(selectedChat){
        if(userremove.data.data._id === selectedChat._id){
          setSelectedChat(undefined)
          setFetchAgain(!fetchAgain)
        } else {
          setFetchAgain(!fetchAgain)
        }
      } else {
        setFetchAgain(!fetchAgain)
      }
    })
  })


// to create chat in app
  useEffect(() => { 
    socket.on("createdchat",(userremove) => {
      if(selectedChat){
        if(userremove.data.data._id === selectedChat._id){
          setSelectedChat(undefined) 
          setFetchAgain(!fetchAgain)
        } else {
          setFetchAgain(!fetchAgain)
        }
      } else {
        setFetchAgain(!fetchAgain)
      }
    })
  })







// when add user state changes in group
  useEffect(() => {
    if(socketAddUserChat){
      console.log(socketAddUserChat)
      if(selectedChat){
        if(selectedChat._id === socketAddUserChat.data._id){
          setSelectedChat(socketAddUserChat.data);
          setFetchAgain(!fetchAgain)
        } else {
          setFetchAgain(!fetchAgain)
        }
      } else {
        setFetchAgain(!fetchAgain)
      }
  }
  setSocketAddUserChat(undefined)
  }, [socketAddUserChat])


// when user remove state changes
  useEffect(() => {
    if(socketRemoveUserChat){
      if(selectedChat){

        if(socketRemoveUserChat.data.data._id === selectedChat._id){
          console.log('we are in level 4');
          console.log("chat is selected in which user is deleted");
          setSelectedChat(JSON.parse(JSON.stringify(socketRemoveUserChat.data.data))) 
        } else {
          console.log("chat is selected in which user is deleted2"); 
          setFetchAgain(!fetchAgain)
        }
      } else {
        setFetchAgain(!fetchAgain)
      }
      }
    setSocketRemoveUserChat(undefined)
  }, [socketRemoveUserChat])
  



  // admin added in group
  useEffect(() => {
    if(socketAddAdminChat){
      console.log(socketAddAdminChat)
      if(selectedChat){
        console.log('level 1 if');
        if(selectedChat._id === socketAddAdminChat.data._id){
          console.log('level 2 if');
          setSelectedChat(socketAddAdminChat.data);
          setFetchAgain(!fetchAgain)
        } else {
          console.log('level 1 else');
          setFetchAgain(!fetchAgain)
        }
      } else {
        setFetchAgain(!fetchAgain)
      }
  }
  setSocketAddAdminChat(undefined)
  }, [socketAddAdminChat])


   // admin removed in group
   useEffect(() => {
    if(socketRemoveAdminChat){
      console.log(socketRemoveAdminChat)
      if(selectedChat){
        console.log('level 1 if');
        if(selectedChat._id === socketRemoveAdminChat.data._id){
          console.log('level 2 if');
          setSelectedChat(socketRemoveAdminChat.data);
          setFetchAgain(!fetchAgain)
        } else {
          console.log('level 1 else');
          setFetchAgain(!fetchAgain)
        }
      } else {
        setFetchAgain(!fetchAgain)
      }
  }

  setSocketRemoveAdminChat(undefined)
  }, [socketRemoveAdminChat])







  useEffect(() => {
    fetchMessages();
    setUpdateMessages(false);
  }, [updateMessages]);

  const typingHandler = async (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;

    setTimeout(() => {
      var timenow = new Date().getTime();
      var timediff = timenow - lastTypingTime;

      if (timediff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  const [showPicker, setShowPicker] = useState(null);

  const onEmojiClick = (event, emojiObject) => {
    if (newMessage === undefined) setNewMessage(emojiObject.emoji);
    else setNewMessage((newMessage) => newMessage + emojiObject.emoji);
    emojiObject.emoji = "";
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            alignItems="center"
            fontFamily="Work sans"
            position="relative"
            bg="#171844"
            pb={2.5}
            px={2}
            w="102.3%"
            maxH="50px"
            d="flex"
            mt="-2px"
            borderTopWidth="1px"
            borderColor="#2c2c2c"
            boxShadow="0px 0px 0px #090a1b,-0px -0px 0px #25266d"
          >
            <IconButton
              backgroundColor="#131844"
              icon={<ArrowBackIcon />}
              mt="10px"
              _hover={{
                bg: "#171844",
              }}
              _active={{
                bg: "#171844",
              }}
              _focus={{
                shadow: "none"
              }}
              onClick={() => setChatBg(!chatBg)}
            />

            {!selectedChat.isGroupChat ? (
              <>
                <Box position="fixed" mt={2} ml={45}>
                  <ProfileModal
                    user={getSenderFull(user, selectedChat.users)}
                  />
                </Box>
                <Box position="fixed" mt={2} ml={100} alignContent="left">
                  {getSender(user, selectedChat.users)}
                </Box>
              </>
            ) : (
              <>
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
                <Box mt="2px" ml="10px">
                  {selectedChat.chatName}
                </Box>
              </>
            )}
          </Text>
          <Box
            d="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={4}
            pt="0px"
            mb={-8}
            mt={0}
            mr={-2}
            bg="#13152f"
            backgroundImage={back}
            backgroundSize="cover"
            w="102.3%"
            h="98.2%"
            overflowY="hidden"
          >
            {loading ? (
              <Center
              alignContent="center"
              w="100%"
              h="600px" 
              >
              <Spinner
                size="x1"
                w={20}
                h={20}
              />
              </Center>
            ) : (
              <Box className="messages" maxH="910px" h="910px">
                <ScrollableChat messages={messages} fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
              </Box>
            )}
          <Avatar
                className="emojimenu"
                src={emojipic}
                bg="transperent"
                w="26.5px"
                h="30px"
                top="12px"
                left="5px"
                zIndex={2}
                onClick={(e) => setShowPicker((val) => !val)}
              />
              {showPicker && (
                <Picker
                  pickerStyle={{ width: "100%",height: "80%", zIndex: "1",marginLeft: "-5px", marginBottom: "20px" }}
                  onEmojiClick={onEmojiClick}
                />
              )}
             
            <FormControl onKeyDown={sendMessage} w="100%" h="10px">
              {istyping ? (
                <Box
                >
                  <Lottie
                    options={defaultOptions}
                    height={40}
                    width={100}
                    style={{
                      backgroundColor: "#17182a",
                      marginBottom: 30,
                      marginTop:-70,
                      marginLeft: 20,
                      borderRadius: 15,
                      borderBottomLeftRadius: 0,
                    }}
                  />
                </Box>
              ) : (
                <></>
              )}
               <Input
               className="writingpad"
                position="absolute"
                variant="outline"
                placeholder="Type a message"
                marginTop="-23px"
                marginBottom="0px"
                marginLeft="-3px"
                bg="white"
                color="black"
                value={newMessage}
                onChange={typingHandler}
                w="1105px"
                borderRadius="20px"
                pl="40px"
                pr="50px"
              />

              <Menu autoSelect={false}>
                <MenuButton
                className="upinmenu"
                  position="relative"
                  float="right"
                  top="-18px"
                  right="2px"
                  w="30px"
                  h="30px"
                  background="transparent"
                  overflow="hidden"
                  zIndex={2}
                  _hover={{
                    background: "transperent",
                  }}
                  _active={{
                    background: "transperent",
                  }}
                  _focus={{
                    shadow: "none",
                  }}
                >
                  <Image
                    src={upin}
                    m="0px"
                    bg="tranperent"
                    h="22px"
                    w="22px"
                  ></Image>
                </MenuButton>
                <MenuList
                  m="0"
                  bg="transperent"
                  w="100px"
                  minW="30px"
                  border="none"
                >
                  <FileMessageModal setFetchAgain={setFetchAgain} fetchAgain={fetchAgain}>
                  <MenuItem
                    h="50px"
                    w="50px"
                    bg="blue.300"
                    color="white"
                    borderRadius="full"
                    justifyContent="center"
                    m="20px"
                    _hover={{
                      bg:"blue.300"
                    }}
                    _active={{
                      bg:"blue.300"
                    }}
                    >
                    <IoDocument fontSize="20px" m="auto" />
                  </MenuItem>
                    </FileMessageModal>

                  <ImageMessageModal setFetchAgain={setFetchAgain} fetchAgain={fetchAgain}>
                  <MenuItem
                    h="50px"
                    w="50px"
                    bg="teal.300"
                    color="white"
                    borderRadius="full"
                    justifyContent="center"
                    m="20px"
                    _hover={{
                      bg:"teal.300"
                    }}
                    _active={{
                      bg:"teal.300"
                    }}
                    >
                    <IoImage fontSize="20px" m="auto" />
                  </MenuItem>
                    </ImageMessageModal>
                    <VideoMessageModal setFetchAgain={setFetchAgain} fetchAgain={fetchAgain}>
                    <MenuItem
                    h="50px"
                    w="50px"
                    bg="red.300"
                    color="white"
                    borderRadius="full"
                    justifyContent="center"
                    m="20px"
                    _hover={{
                      bg:"red.300"
                    }}
                    _active={{
                      bg:"red.300"
                    }}
                    >
                    <IoVideocam fontSize="20px" m="auto" />
                  </MenuItem>
                      </VideoMessageModal>
                      <AudioMessageModal setFetchAgain={setFetchAgain} fetchAgain={fetchAgain}>
                    <MenuItem
                    h="50px"
                    w="50px"
                    bg="purple.300"
                    color="white"
                    borderRadius="full"
                    justifyContent="center"
                    m="20px"
                    _hover={{
                      bg:"purple.300"
                    }}
                    _active={{
                      bg:"purple.300"
                    }}
                    >
                    <IoVolumeHigh fontSize="20px" m="auto" />
                  </MenuItem>
                      </AudioMessageModal>
                </MenuList>
              </Menu>
            </FormControl>
          </Box>
        </>
      ) : (
        // to get socket.io on same page
        <Box
        d="flex"
        alignItems="center"
          justifyContent="center"
          w="102.3%"
          h="105%"
          mt="-0.5"
          mb="-8"
          mr={-3}
          bg="#090C27"
          borderTopWidth="1px"
          borderColor="#2c2c2c"
        >
          <Image
          className="blanktext"
            src={clickUser}
            w="400px"
            boxShadow="5px 5px 10px #040510, -5px -5px 10px #0e133e"
            borderRadius="15px"
          />
        </Box>
      )}
    </>
  );
};
export default SingleChat;
