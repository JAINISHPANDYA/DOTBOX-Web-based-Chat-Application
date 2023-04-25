import { ViewIcon } from '@chakra-ui/icons';
import { Avatar, Box, Button, Divider, FormControl, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, Text, useDisclosure, useToast } from '@chakra-ui/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { ChatState } from '../../../context/ChatProvider';
import UpdateGroupBadgeItem from '../../UserAvatar/UpdateGroupBadgeItem';
import UserListItem from '../../UserAvatar/UserListItem';
import { FaEdit, FaCamera } from "react-icons/fa";
import DisplayPic from './DisplayPic';
import UpdateGroupChatDeleteGroupModal from './UpdateGroupChatDeleteGroupModal'
import io from "socket.io-client";

const ENDPOINT = process.env.REACT_APP_SERVERURL;
var socket, selectedChatCompare;

const UpdateGroupChatModal = ({fetchAgain, setFetchAgain, FetchMessages}) => {


  const OverlayOne = () => (
    <ModalOverlay
      bg="blackAlpha.300"
      backdropFilter="blur(10px) hue-rotate(0deg)"
    />
  );


  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [overlay, setOverlay] = useState(<OverlayOne />);
  const [renameloading, setRenameLoading] = useState(false);
  const [picLoading, setPicLoading] = useState(false);
  const [pic, setPic] = useState();
  const [socketConnected, setSocketConnected] = useState(false);
  const toast = useToast();



  

  const { selectedChat, setSelectedChat, user, chatBg, setChatBg } = ChatState();

  const baseURL = process.env.REACT_APP_SERVERURL;
  if (typeof baseURL !== 'undefined') {
    axios.defaults.baseURL = baseURL;
  }


  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));

    // eslint-disable-next-line
  }, []);






  //  ----------------------------------------------------------------------------------------------------------------------------------------------------


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
      setSearchResult(data.filter(obj => obj._id !== user._id));
      console.log(searchResult)
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoading(false);
    }
  };


  // -------------------------------------------------------------------------------------------------------------------------------------

  const handleRename = async () => {
    if (!groupChatName) return;

    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const info = new FormData();
      info.append('chatId', selectedChat._id);
      info.append('chatName', groupChatName)
      const { data } = await axios.put(`/api/chat/rename`, info, config );

      console.log(data._id);
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setRenameLoading(false);
    }
    setGroupChatName("");
  };

  // ---------------------------------------------------------------------------------------------------------------------------------------

  const handleAddUser = async (user1) => {
    if(selectedChat.users.find(u => u._id === user1._id) !== undefined){
      toast({
        title: "This user already memeber of Group",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return
    }


    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const info = new FormData();
      info.append('chatId', selectedChat._id);
      info.append('userId', user1._id)
      const { data } = await axios.put(`/api/chat/groupadd`, info, config);

      setSelectedChat(data)
      socket.emit("useradded", {data: data, sender: user});      
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
    setGroupChatName("");
  };




  // -------------------------------------------------------------------------------------------------------------------------------------


  const handleRemove = async (user1) => {


    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
     if( user1._id === user._id && selectedChat.groupAdmin.indexOf(user._id) == 0 && selectedChat.groupAdmin[1] === undefined){
      toast({
        title: "You are the only admin in Group. Promote someone else as Admin to exit the Group.",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
     }
        if(selectedChat.groupAdmin.indexOf(user1._id) > -1 ) {

          const info = new FormData();
          info.append('chatId', selectedChat._id);
          info.append('userId', user1._id)
          const { data } = await axios.put(`/api/chat/adminremove`, info, config );
          setSelectedChat(data)
        }


      
      const info = new FormData();
      info.append('chatId', selectedChat._id);
      info.append('userId', user1._id)
      const { data } = await axios.put(`/api/chat/groupremove`, info, config );

      console.log(selectedChat)
      setSelectedChat(data)
      socket.emit("userremove", {data: data, sender: user, deletedUser: user1})
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
    setGroupChatName("");
  };


  // ------------------------------------------------------------------------------------------------------------------------------------
  const uploadfile = (e) => {
    setPic(e.target.files[0])
  }

  useEffect(() => {
    if(pic){
      console.log(pic);
      postDetails();
    }
  }, [pic])
  

  const postDetails = async () => {
    try {
      if (pic === undefined) {
        toast({
          title: "Please Select an Image!",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        return;
      }
      setPicLoading(true);
     
          const config = {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          };

          const info = new FormData();
          info.append('chatId', selectedChat._id)
          info.append('pic',pic)
          const { data } = await axios.post( `/api/chat/grouppicupdate`, info, config );

            console.log(data);
            window.location.reload(false);
            setPicLoading(false);
        } catch (error) {
          console.log(error);
          setPicLoading(false);
        }
        console.log("end")
        setPic(undefined)
  };


  


  const upload = () => {
    document.getElementById("selectImage").click()
  }

  const renderSearchField = () => {
    if(selectedChat.groupAdmin.indexOf(user._id) > -1){
      return (
              <Input
                color="blue.100"
                placeholder="Add User to group"
                mb={1}
                variant="flushed"
                onChange={(e) => handleSearch(e.target.value)}
              />
      )
    } else {
      return (
              <Input
                placeholder="Add User to group"
                mb={1}
                variant="flushed"
                disabled
                onChange={(e) => handleSearch(e.target.value)}
              />
      )
    }
  }

  const renderDelete = () => {
    if(selectedChat.groupAdmin.indexOf(user._id) > -1){
      return (<UpdateGroupChatDeleteGroupModal chat={selectedChat} fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} ><Button float="right" colorScheme="red" mx="10px" >Delete Group</Button></UpdateGroupChatDeleteGroupModal>)
    } else {
      return (<Button float="right" colorScheme="red" mx="10px" disabled >Delete Group</Button>)
    }
  }
   
  return (
    <>
    <Avatar
      mt="7px"
      mr={3}
      size="sm"
      onClick={onOpen}
      cursor="pointer"
      name={user.name}
      src={selectedChat.grouppic}
    />
    <Modal 
    motionPreset='slideInBottom'
    onClose={onClose} 
    isOpen={isOpen}
    borderRadius="15px"
    isCentered>
        {overlay}
        <ModalContent
        mt="180px"
        bg="#171829"
        maxW="4000px"
        w="855px"
        maxH="4000px"
        h="800px"
        position="fixed"
        >


          <ModalBody
          d="flex"
          flexDir="column" 
          alignItems="center"
          borderRadius="15px"
          >
            
            <Box
            bg="blue.100" 
            borderTopRadius="7px"
            mt="-7px"
            zIndex={1}
            h="18%"  
            w="105.8%"
            >
              <Box
              minW="0px"
              bg="blue.800"
              h="7px"
              width="5%"
              m="auto"
              justify-content="center"
              borderRadius="25px"
              position="relative"
              top="5px"
          ></Box>
          <ModalCloseButton color="blue.800" zIndex={2} _focus={{ boxShadow:"none" }} />

          <Box
          mt="20px"
          h="121%"
          w="95%"
          mx="auto"
          display="flex"
          flexDirection="row"
          >
            <DisplayPic zIndex={2}>
            <Avatar
            marginTop="-3px"
            borderRadius="full"
            h="165px"
            w="165px"
            border="10px solid white"
            src={selectedChat.grouppic}
            alt={selectedChat.picname}
            />
            
            </DisplayPic>
            <Button
            float="right"
            bg="blue.200"
            borderRadius="full"
            top="115px"
            left="-40px"
            p={1}
            isLoading={picLoading}
            onClick={upload}
            _hover={{
              bg:"blue.200"
            }}
            _active={{
              bg:"blue.200"
            }}
            >
          <FaCamera fontSize="15px" color="#ffffff" /> 
            </Button>
            
            {/* hidden file input field */}
          <Input
            id='selectImage'
            marginTop="80px" 
            variant='flushed' 
            p={1.5}
            accept="image/*"
            hidden
            type="file"
            onChange={uploadfile}
            />


            <Text 
            w="70%"
            fontSize="45px"
            fontWeight="900"
            color="white"
            d="flex"
            position="relative"
            >
              <Text mx="auto">
            {selectedChat.chatName}
              </Text>
            </Text>
            </Box>
              </Box>

            <Box
            w="95%"
            mt="50px"
            display="flex"
            flexDirection="row"
            >
            <FormControl w="50%" display="flex" flexDirection="row">
              <Input
                placeholder="Chat Name"
                variant="flushed"
                color="blue.100"
                maxLength={13}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                variant="solid"
                bg="blue.100"
                color="white"
                ml={3}
                _hover={{
                  bg:"blue.200"
                }}
                _active={{
                  bg:"blue.200"
                }}
                isLoading={renameloading}
                onClick={handleRename}
                >
                Update
              </Button>
            </FormControl>
            <Divider orientation='vertical' h="50px" mx="20px" />
            <FormControl position="relative" w="50%">
              {renderSearchField()}
            </FormControl>
                </Box>

            <Box position="relative" color="white" w="95%" mb="10px" mx="auto"><Text>MEMBERS</Text></Box>



            <Box w="100%" h="165px" display="inline-block" overflowX="hidden" overflowY="scroll" borderRadius="15px" bg="#0e0f1f" mx="auto" >
              {selectedChat.users.map((u) => (
                <UpdateGroupBadgeItem
                  key={u._id}
                  user={u}
                  loggedInUser={user}
                  avatar={u.pic}
                  chat={selectedChat}
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  setGroupChatName={setGroupChatName}
                  handleFunction={() => handleRemove(u)} 
                />
              ))}
            </Box>
       

            <Box position="relative" color="white" w="95%" my="10px"  p="2px">ADD MEMBER</Box>
            <Box
            position="relative"
            h="155px"
            w="100%"
            bg="#0e0f1f"
            padding="13px"
            overflow="scroll"
            borderRadius="15px"
            overflowX="hidden"
            >
            {loading ? (
              <Spinner size="lg" />
              ) : (
                searchResult?.map((user) => (
                  <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleAddUser(user)}
                  />
                  ))
                  )}
                  </Box>

                  <Box w="100%" my="10px">
                    {renderDelete()}
                  <Button onClick={() => handleRemove(user)} float="right" colorScheme="red">
              Leave Group
            </Button>
                  </Box>
          </ModalBody>
        </ModalContent>
      </Modal>

    </>
  )
}

export default UpdateGroupChatModal