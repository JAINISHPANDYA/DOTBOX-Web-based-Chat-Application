import { Box, Button, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Text, useDisclosure, useToast } from '@chakra-ui/react'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import  crowngold  from "../../../assets/crown.png"
import  crownblue  from "../../../assets/crownblue.png"
import { ChatState } from "../../../context/ChatProvider"
import io from "socket.io-client";

const ENDPOINT = process.env.REACT_APP_SERVERURL;
var socket, selectedChatCompare;


const GroupChatUsersOptions = ({children, loggedInUser, user, setGroupChatName, isAdmin, fetchAgain, setFetchAgain}) => {
     
    const OverlayOne = () => (
        <ModalOverlay
          bg="blackAlpha.300"
          backdropFilter="blur(0px) hue-rotate(0deg)"
        />
      );
        const { isOpen, onOpen, onClose } = useDisclosure()
        const [overlay, setOverlay] = useState(<OverlayOne />);
        const [loading, setLoading] = useState(false);
        const { selectedChat, setSelectedChat } = ChatState();
        const [socketConnected, setSocketConnected] = useState(false);
        const toast = useToast()


        useEffect(() => {
          socket = io(ENDPOINT);
          socket.emit("setup", user);
          socket.on("connected", () => setSocketConnected(true));
      
          // eslint-disable-next-line
        }, []);
      


        const handleAddAdmin = async (user1) => {

            try {
              setLoading(true);
              const config = {
                headers: {
                  Authorization: `Bearer ${loggedInUser.token}`,
                },
              };
              const info = new FormData();
              info.append('chatId', selectedChat._id);
              info.append('userId', user1._id);
              console.log(info);
              const { data } = await axios.put(`/api/chat/adminadd`, info, config);
        
              setSelectedChat(data);
              socket.emit("addedadmin", {data: data, sender: loggedInUser});      
              onClose()
              setLoading(false);
            } catch (error) {
              toast({
                title: "Error Occured!",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
              });
              setLoading(false);
            }
            setGroupChatName("")
          };




          const handleRemoveAdmin = async (user1) => {


            try {
              const config = {
                headers: {
                  Authorization: `Bearer ${loggedInUser.token}`,
                },
              };
              
              const info = new FormData();
              info.append('chatId', selectedChat._id);
              info.append('userId', user1._id)
              const { data } = await axios.put(`/api/chat/adminremove`, info, config );
        
              setSelectedChat(data);
              socket.emit("removedadmin", {data: data, sender: loggedInUser});      
              onClose()
            } catch (error) {
              toast({
                title: "Error Occured!",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
              });
              setLoading(false);
            }
          };
        
          

        const renderButton = () => {
          if(selectedChat.groupAdmin.indexOf(user._id) > -1){
                return <Button w="300px" bg="white" _focus={{ shadow:"none" }} onClick={() => handleRemoveAdmin(user)} >Remove as Admin <Image w="20px" h="20px" ml="5px" src={crownblue} /></Button>
            } else {
                return <Button w="300px" bg="white" _focus={{ shadow:"none" }} onClick={() => handleAddAdmin(user)} >Promote as Admin <Image w="20px" h="20px" ml="5px" src={crowngold} /></Button>
            }
        }
        return (
          <>
            <span onClick={onOpen}>{children}</span>
            <Modal isCentered isOpen={isOpen} onClose={onClose}>
                {overlay}
              <ModalContent background="transparent" boxShadow="none">
                <ModalBody>
                  {renderButton()}
                </ModalBody>
              </ModalContent>
            </Modal>
          </>
        )
}

export default GroupChatUsersOptions