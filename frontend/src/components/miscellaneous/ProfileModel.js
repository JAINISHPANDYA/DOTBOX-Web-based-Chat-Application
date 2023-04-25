import { Avatar, Box, Button, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text } from '@chakra-ui/react'
import { useDisclosure } from '@chakra-ui/react'
import React,{ useState , useEffect } from 'react'
import DisplayprofilePic from './DisplayprofilePic'


const ProfileModel = ({ user, children, fetchAgain, setFetchAgain, FetchMessages}) => {

    
    const OverlayOne = () => (
        <ModalOverlay
          bg='blackAlpha.300'
          backdropFilter='blur(10px) hue-rotate(0deg)'
        />
      )
    
      // const OverlayTwo = () => (
      //   <ModalOverlay
      //     bg='none'
      //     backdropFilter='auto'
      //     backdropInvert='80%'
      //     backdropBlur='2px'
      //   />
      // )
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [overlay, setOverlay] = React.useState(<OverlayOne />)
    const [renameloading, setRenameLoading] = useState(false);
    const [UserName, setUserName] = useState();
    const [loggedUser, setLoggedUser] = useState();

    useEffect(() => {
      setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
  // eslint-disable-next-line
}, [fetchAgain]);

   
  return (
    <>{
      
    children ? ( 
        <span onClick={onOpen}>{children}</span>
    ) : (
      <Avatar
      mt="7px"
      mr={3}
      size="sm"
      onClick={onOpen}
      cursor="pointer"
      name={user.name}
      src={user.pic}
    />
    )}
     <Modal isOpen={isOpen} onClose={onClose} motionPreset='slideInBottom' isCentered>
        {overlay}
        <ModalContent w="600px" maxW="700px" h="750px" mt="300px" bg="#171829" borderRadius="15px" position="fixed">
          
          <ModalCloseButton color="blue.900"
          _hover={{
            background:"blue.100"
          }}
          _focus={{
            background:"blue.100",
            boxShadow:"none"
          }}
          />

          <ModalBody
          d="flex"
          color="blue.100"
          flexDir="column"
          alignItems="center"
          >
            <Box
            marginTop="-10px"
            bg="blue.100"
            h="22%"
            w="108.6%"
            padding="10px"
            borderTopRadius="15px"
            >
              <Box
              minW="0px"
          bg="blue.800"
          h="5px"
          width="5%"
          m="auto"
          justify-content="center"
          borderRadius="25px"
          ></Box>
          <Text
          position="relative"
          color="white"
          top="56px"
          right="100px"
          fontSize="60px"
          fontWeight="800"
          float="right"
          >
            Profile
          </Text>
            <Box
          marginTop="20px"
          ml="20px"
          bg="white"
          h="145%"
          w="31%"
          borderRadius="full"
          padding={3}
          >
            <DisplayprofilePic zIndex={2} User={user}>
            <Image
            marginTop="0px"
            borderRadius="full"
            boxSize="155px"
            src={user.pic}
            alt={user.name}
            />
            </DisplayprofilePic>
            
            <Text
            w="300px"
          color="blue.100"
          position="relative"
          marginTop="20px"
          fontSize="30px"
          d="flex"
          left="-60px"
          justifyContent="center"
          > {user.name}</Text>
          </Box>
            </Box>
            <Box
            position="relative"
            float="left"
            top="150px"
            marginLeft="-330px"
            
            >
            <Text p={1} fontSize={{ base: "20px", md: "18px" }}>
                Email: {user.email}
            </Text>
            </Box>
          </ModalBody>
          <ModalFooter >
            <Text
            position="relative"
            top="-110px"
            textAlign="left"
            w="50%"
            color="blue.100"
            >
              .dotbox
            </Text>
            <Text
            w="50%"
            >
              <Button position="relative" top="-110px" float="right" m={2} bg="blue.100" onClick={onClose}>close</Button>
            </Text>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default ProfileModel