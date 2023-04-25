import { Box, Button, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure, useToast } from '@chakra-ui/react'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import  crowngold  from "../../../assets/crown.png"
import  crownblue  from "../../../assets/crownblue.png"
import { ChatState } from "../../../context/ChatProvider"
import io from "socket.io-client";

const ENDPOINT = process.env.REACT_APP_SERVERURL;
var socket, selectedChatCompare;

const UpdateGroupChatModal = ({children, setGroupChatName, setFetchAgain, fetchAgain}) => {
     
    const OverlayOne = () => (
        <ModalOverlay
          bg="blackAlpha.300"
          backdropFilter="blur(0px) hue-rotate(0deg)"
        />
      );
        const { isOpen, onOpen, onClose } = useDisclosure()
        const [overlay, setOverlay] = useState(<OverlayOne />);
        const [loading, setLoading] = useState(false);
        const { selectedChat, setSelectedChat, user } = ChatState();
        const [socketConnected, setSocketConnected] = useState(false);
        const toast = useToast()

        useEffect(() => {
          socket = io(ENDPOINT);
          socket.emit("setup", user);
          socket.on("connected", () => setSocketConnected(true));
      
          // eslint-disable-next-line
        }, []);





          const handleDeleteGroup = async () => {
            try {
              const config = {
                headers: {
                  Authorization: `Bearer ${user.token}`,
                },
              };
              
              const info = new FormData();
              info.append('chatId', selectedChat._id);
              const data = await axios.put(`/api/chat/deletechat`, info, config );
    
              setSelectedChat(undefined)
              setFetchAgain(!fetchAgain)
              socket.emit("chatdelete", {data: data, sender: user})
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
          };
        
          


        return (
          <>
            <span onClick={onOpen}>{children}</span>
            <Modal isCentered isOpen={isOpen} onClose={onClose}>
                {overlay}
                <ModalContent bg="#17182a" color="white">
          <ModalHeader>Delete Group</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Deleting Group will delete all the messages and media shared in the Group!</Text>
          </ModalBody>
          <ModalFooter>
            <Button mx="5px" colorScheme="red" onClick={() => handleDeleteGroup()} >Delete Group</Button>
            <Button onClick={onClose} mx="5px" bg="blue.100" >Close</Button>
          </ModalFooter>
        </ModalContent>
            </Modal>
          </>
        )
}

export default UpdateGroupChatModal