import { Avatar, Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure, Image } from '@chakra-ui/react'
import React from 'react'
import { ChatState } from '../../../context/ChatProvider'
import { getSender, getSenderPic } from '../../config/ChatLogics'

const DisplayPic = ({children}) => {
    const OverlayOne = () => (
        <ModalOverlay
          bg='blackAlpha.300'
          backdropFilter='blur(10px) hue-rotate(0deg)'
        />
      )
    
      const OverlayTwo = () => (
        <ModalOverlay
          bg='none'
          backdropFilter='auto'
          backdropInvert='80%'
          backdropBlur='2px'
        />
      )
      const { isOpen, onOpen, onClose } = useDisclosure()
      const [overlay, setOverlay] = React.useState(<OverlayOne />)
      const {selectedChat, user} = ChatState();
    

      const getlink = (chat) => {
        return chat = chat.grouppic;
      }
      return (
        <>
          <span onClick={onOpen}>{children}</span>
          <Modal isCentered isOpen={isOpen} onClose={onClose}>
            {overlay}
            <ModalContent bg="transparent" overflow="hidden" max>
              <ModalCloseButton color="white"/>
             
              <Image
                  cursor="pointer"
                  name={getSender(user,selectedChat.users)}
                  src={selectedChat.grouppic}
                  />
              
            </ModalContent>
          </Modal>
        </>
      )
}

export default DisplayPic