import {  Modal, ModalCloseButton, ModalContent,  ModalOverlay,  useDisclosure, Image } from '@chakra-ui/react'
import React from 'react'

const MyChatProfilePic = ({children, Link}) => {
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

    

      return (
        <>
          <span onClick={onOpen}>{children}</span>
          <Modal isCentered isOpen={isOpen} onClose={onClose}>
            {overlay}
            <ModalContent bg="transparent" overflow="hidden" max>
              <ModalCloseButton color="white"
              _focus={{
            boxShadow:"none"
          }}/>
             
              <Image
                  cursor="pointer"
                  alt="user"
                  src={Link}
                  />
              
            </ModalContent>
          </Modal>
        </>
      )
}


export default MyChatProfilePic;