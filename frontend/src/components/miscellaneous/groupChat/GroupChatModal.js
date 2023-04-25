import {
  Avatar,
  Box,
  Button,
  Divider,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { ChatState } from "../../../context/ChatProvider";
import UserListItem from "../../UserAvatar/UserListItem";
import UserBadgeItem from "../../UserAvatar/UserBadgeItem";
import { BsCameraFill } from "react-icons/bs";
import io from "socket.io-client";

const ENDPOINT = process.env.REACT_APP_SERVERURL;
var socket, selectedChatCompare;


const GroupChatModal = ({ children }) => {


  const baseURL = process.env.REACT_APP_SERVERURL;
  if (typeof baseURL !== "undefined") {
    axios.defaults.baseURL = baseURL;
  }

  const OverlayOne = () => (
    <ModalOverlay
      bg="blackAlpha.300"
      backdropFilter="blur(10px) hue-rotate(0deg)"
    />
  );

  // const OverlayTwo = () => (
  //   <ModalOverlay
  //     bg="none"
  //     backdropFilter="auto"
  //     backdropInvert="80%"
  //     backdropBlur="2px"
  //   />
  // );
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [overlay, setOverlay] = React.useState(<OverlayOne />);
  const [groupChatName, setGroupChatName] = useState('Create Group Chat');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState();
  const [pic, setPic] = useState();
  const [picUrl, setPicUrl] = useState();
  const [picName, setPicName] = useState();
  const [picLoading, setPicLoading] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);


  const toast = useToast();

  const { user, chats, setChats , setSelectedChat, selectedChat, setChatBg, chatBg} = ChatState();


  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));

    // eslint-disable-next-line
  }, []);


// to add members in group 
  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toast({
        title: "User already added",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    console.log(selectedUsers)
    setSelectedUsers([...selectedUsers, userToAdd]);
  };


// to handle search users
  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${search}`, config);
      console.log(data);
      setLoading(false);
      console.log(data.map((data) => (data)))
      setSearchResult(data.filter(obj => obj._id !== user._id));
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };


  const postDetails = (e) => {
    setPic(e.target.files[0]);
      const file = e.target.files[0];
      setPicUrl(URL.createObjectURL(file))
  } 


// handle submit the info for creating group
const handleSubmit = async () => {
  if(!groupChatName || !selectedUsers || !pic){
    toast({   
        title: "Please fill all the fields",
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
        Authorization: `Bearer ${user.token}`,
      },
    };

    const info = new FormData();
    info.append('name', groupChatName);
    info.append('users', JSON.stringify(selectedUsers.map((u)=> u._id)));
    info.append('grouppic', pic)
    const { data } = await axios.post(
      "/api/chat/group", info, config);

    socket.emit("chatcreate", {data: data, sender: user})
    setChats([data, ...chats]);
    if(selectedChat){
      setChatBg(!chatBg)
    }
    closeFunction();
    toast({
      title: "new Group is Created!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
    })
  } catch (error) {
    toast({   
      title: "some error occured",
      description: error,
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });
  }
}

// to handle delete users form the group before making it.
  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
  };

  const click  = () => {
    document.getElementById('imageInput').click()
  }
 
 const closeFunction = () => {
   setPic(undefined)
   setPicUrl(undefined)
   setGroupChatName('Create Group Chat')
   setSelectedUsers([])
   setSearchResult([])
   onClose()
  }
   



   
   
  return (
    <>
      {(children = <span onClick={onOpen}>{children}</span>)} 
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        h="800px"
        motionPreset="slideInBottom"
        isCentered
      >
        {overlay}
        <ModalContent bg="#171829" w="853px" position="fixed" maxWidth="2000px" h="700px" marginTop="130px" >

          
          <ModalBody
            d="flex"
            color="blue.100"
            flexDir="column"
            alignItems="center"
            justifyContent="space-between"
          >

            


            {/*  the top blue background area */}
            <Box
            position="relative"
             bg="blue.100"
             maxH="1000px"
             h="160px"
             w="106.5%"
             top="-7px"
             borderTopRadius="15px"
               color="blue.800"
               fontSize="20px"
               d="flex"
               flexDirection="column"
               justifyContent="center"
            >

              {/* small rectangle at the top */}
            <Box 
            w="100%"
            >
            <Box
              minW="0px"
              position="relative"
              top="21px"
              bg="blue.800"
              h="5px"
              width="5%"
              m="auto"
              justify-content="center"
              borderRadius="25px"
              zIndex={1}
              ></Box>
              </Box>



              {/* avatar and name area */}
              <Box
              w="90%"
              h="150px"
              mx="auto"
              mt="45px"
              display="flex"
              flexDirection="row"
              >
                <Avatar
                src={picUrl}
                w="145px"
                h="145px"
                border="8px solid white"
                />
                <Button minW="0px" h="35px" w="38px" p="0px" bg="blue.300" borderRadius="full" mt="100px" ml="-27px" onClick={click} _hover={{ background : "#63b3ed"}} ><BsCameraFill fontSize="18px" /></Button>
              <Box
              m="auto"
              w="80%"
              ml="20px"
              position="relative"
              fontWeight="800"
              fontSize="55px"
              color="white"
              >
              {groupChatName}
              </Box>
              <Input
              id="imageInput"
              type="file"
              variant="outline"
              p={1.5}
              accept="image/*"
              onChange={postDetails}
              hidden
              />

                </Box>
          <ModalCloseButton onClick={closeFunction} color="blue.800" _hover={{ bg:"blue.100" }} _active={{ bg:"blue.100" }} _focus={{ boxShadow:"none"}} />
            </Box>

            <Box
            w="95%"
            mb="-20px"
            display="flex"
            flexDirection="row"
            >
            <FormControl
              w="47%"
              mx="auto"
              >
                <FormLabel position="relative" top="0px">Enter Group Name</FormLabel>
              <Input
                placeholder="Ex. Friends"
                maxLength={13}
                onChange={(e) => setGroupChatName(e.target.value)}
                />
            </FormControl>
            <Divider orientation='vertical' h="50px" mt="25px" mx="20px" />

            <FormControl
            w="47%"
            mx="auto"
            >
              <FormLabel position="relative" >Add Group Members</FormLabel>
              <Input
                
                placeholder="Add Members"
                onChange={(e) => handleSearch(e.target.value)}
                />
            </FormControl>
             


                </Box>
             <Box
             position="relative"
             w="100%"
             h="170px"
             mb="-20px"
             overflow="scroll"
             display="inline-block"
             overflowX="hidden"
             bg="#0e0f1f"
             borderRadius="15px"
             >
              {selectedUsers.map((u) => (
                <UserBadgeItem
                key={u._id}
                user={u}
                handleFunction={() => handleDelete(u)}
                />
                ))}
                </Box>
    
            <Box
            position="relative"
            w="100%"
            height="140px"
            bg="#0e0f1f"
            padding="10px"
            borderRadius="15px"
            overflow="scroll"
            overflowX="hidden"
            >

            {loading ? (
              // <ChatLoading />
              <div>Loading...</div>
              ) : (
                searchResult?.map((user) => (
                  <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleGroup(user)}
                  />
                  ))
                  )}
                  </Box>
          </ModalBody>
          <ModalFooter>
          <Button mr={4} top="-10px" bg="blue.200" onClick={handleSubmit} isLoading={picLoading} >
              Create Chat
            </Button>
            <Button bg="blue.200" top="-10px"  onClick={closeFunction}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
