import {
  Avatar,
  Box,
  FormControl,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Center,
  Divider,
  Button,
  useToast
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { ChatState } from "../../context/ChatProvider";
import { FaCamera } from "react-icons/fa";
import { useHistory } from "react-router-dom"
import DisplayprofilePic from "./DisplayprofilePic";
import { getencryption } from "../config/ChatLogics"



const Settings = ({ children, user, fetchAgain, setFetchAgain }) => {

  const history = useHistory()

  const OverlayOne = () => (
    <ModalOverlay
      bg="blackAlpha.300"
      backdropFilter="blur(10px) hue-rotate(0deg)"
    />
  );
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [currentPassword, setCurrentPassword] = useState();
  const [newPassword, setNewPassword] = useState();
  const [renameloading, setRenameLoading] = useState(false);
  const [picLoading, setPicLoading] = useState(false);
  const [overlay, setOverlay] = useState(<OverlayOne />);
  const { setUser } = ChatState();
  const toast = useToast();


  const baseURL = process.env.REACT_APP_SERVERURL; 
  if (typeof baseURL !== 'undefined') {
    axios.defaults.baseURL = baseURL;
  }



  /// Rename function that rename name or email and also change the password.
  const handleRename = async () => {

      console.log(user.name);
      console.log(user.email);
      console.log(currentPassword);
      console.log(newPassword);
    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const info = new FormData()
      info.append('_id',user._id)
      info.append('name',(!name ? user.name : name))
      info.append('email',(!email ? user.email : email))

      const { data } = await axios.post(`/api/user/rename`, info, config );

      console.log(data._id);
      await localStorage.setItem("userInfo", JSON.stringify(data));
      setRenameLoading(false);
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      setUser(userInfo);
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
    setName("");
    setEmail("");

    if(currentPassword || newPassword){
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }; 

      const info2 = new FormData();
      info2.append('_id',user._id);
      info2.append('password', getencryption(currentPassword))
      info2.append('newpassword', getencryption(newPassword))
      const { data } = await axios.post(`/api/user/resetpassword`, info2, config );

      if(data){
        toast({
          title: "Password Changed Successfully",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
    setCurrentPassword(undefined);
    setNewPassword(undefined)

  }
  };




  //this function changes the profile pic of the user


  const [image, setImage] = useState(null)




  const ensureupload = async(e) => {
    if(e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  
  };

  useEffect(() => {
    if(image){
      console.log(image)
      postDetails();
    }
  }, [image])
  


  const postDetails = async () => {
    try {
     
          setPicLoading(true);
          const config = {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          };

          const info = new FormData();
          info.append('_id',user._id)
          info.append('file',image)
          const { data } = await axios.post( `/api/user/editprofilepic`, info, config );

            console.log(data);
            await localStorage.setItem("userInfo", JSON.stringify(data));
            window.location.reload(false);

        setPicLoading(false);
     
        } catch (error) {

          console.log(error);
          setPicLoading(false);

        }
        console.log("end") 
  };


  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    history.push("/");
  };

  const click = async () => {
    await handleRename()
          onClose()
  }

  
  const upload = () => {
    document.getElementById('selectImage').click()
  }
  return (
    <>
      <span onClick={onOpen}>{children}</span>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        motionPreset="slideInBottom"
        isCentered
      >
        {overlay}
        <ModalContent h="810px" position="fixed" w="935px" mb="-90px" maxW="1000px" bg="#171829" borderRadius="15px">
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
          alignItems="center">
            
          <Box
            marginTop="-7px"
            bg="blue.100"
            h="23.5%"
            w="105.3%"
            padding="10px"
            borderTopRadius="15px"
            >
              <Box
              minW="0px"
          bg="blue.800"
          h="7px"
          width="5%"
          m="auto"
          justify-content="center"
          borderRadius="25px"
          ></Box>
           <Text
           w="330px"
           position="relative"
           float="right"
           fontSize="75px"
           fontWeight="800"
           top="95px"
           right="300px"
           color="white"
           >
            Settings
          </Text>
            <Box
          mt="40px"
          ml="20px"
          bg="white"
          h="109%"
          w="21%"
          borderRadius="full"
          padding={3}
          >
            <DisplayprofilePic User={user}>
            <Image
            marginTop="0px"
            borderRadius="full"
            boxSize="150px"
            h="170px"
            w="170px"
            src={user.pic}
            alt={user.name}
            />
            </DisplayprofilePic>
            
            <Input
            id='selectImage'
            marginTop="100px" 
            variant='flushed' 
            p={1.5}
            accept="image/*"
            hidden
            type="file"
            onChange={ensureupload}
        />

        
             <Button
            float="right"
            bg="blue.200"
            borderRadius="full"
            top="-30px"
            p={1}
            _hover={{
              bg:"blue.200"
            }}
            _active={{
              bg:"blue.200"
            }}
            onClick={upload}
            > 
          <FaCamera fontSize="15px" color="#ffffff" /> 

            </Button> 
            
          </Box>
            </Box>
            
         
            <Box
            float="left"
            left="-200px"
            mt="60px"
            width="100%"
            >
              <Text mt={10} ml="30px" position="relative">
                User Id :
              </Text>
              <Text
                color="blue.100"
                fontSize="18px"
                position="relative"
                ml={30}
                w="100%"
              >
                {user._id}
              </Text>
            </Box>
            <Box flexDir="row" h={70}>
              
            </Box>
              <FormControl>

            <Box
             flexDir="row"
             h="110px"
             mt="-90px"
             >
              <Text mt={10} ml="30px" position="relative">
                Username :
              </Text>
              <Text
                color="blue.100"
                fontSize="20px"
                position="relative"
                ml={30}
                w="20%"
              >
                {user.name}
              </Text>
              <Center position="relative" top="-45px" height="50px">
                <Divider orientation="vertical" />
              </Center>
                <Input
                  w="400px"
                  position="relative"
                  top="-90px"
                  float="right"
                  placeholder="Change your name"
                  value={name}
                  maxLength={15}
                  onChange={(e) => setName(e.target.value)}
                  />
                  </Box>
                  <Box
             flexDir="row"
             h="110px"
             mt="-70px"
             >
              <Text mt={10} ml="30px" position="relative">
                Email :
              </Text>
              <Text
                color="blue.100"
                fontSize="20px"
                position="relative"
                ml={30}
                w="50%"
              >
                {user.email}
              </Text>
              <Center position="relative" top="-45px" left="200px" height="50px">
                <Divider orientation="vertical" />
              </Center>
                <Input
                  w="400px"
                  position="relative"
                  top="-90px"
                  float="right"
                  placeholder="Change your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  />
                  </Box>
                  <Box
             flexDir="row"
             h="110px"
             mt="-70px"
             >
              <Text mt={10} ml="30px" position="relative">
                Change Password :
              </Text>
              <Input
                  w="370px"
                  ml="20px"
                  position="relative"
                  top="10px"
                  zIndex="1"
                  placeholder="Enter your Current password"
                  value={currentPassword}
                  maxLength={15}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  />
              <Center position="relative" top="-35px" left="00px" height="50px">
                <Divider orientation="vertical" />
              </Center>
                <Input
                  w="400px"
                  position="relative"
                  top="-81px"
                  float="right"
                  placeholder="Enter new password"
                  value={newPassword}
                  maxLength={15}
                  onChange={(e) => setNewPassword(e.target.value)}
                  />
                  </Box>
                  <Box
                  position="relative"
                  top="-20px"
                  width="100%"
                  h="40%"
                  float="right"
                  >
                <Text 
                position="relative"
                left="20px"
                textAlign="left"
                w="100%"
                color="blue.100"
                >
                .dotbox
                </Text>
                <Button
               float="right"
               position="relative"
               top="-50px"
              m={2} 
              bg="blue.100" 
              color="blue.900" 
              onClick={logoutHandler}
              >
              Log Out
              </Button>
              <Button
               float="right"
               position="relative"
               top="-50px"
              m={2} 
              bg="blue.100" 
              color="blue.900" 
              isLoading={renameloading}
              onClick={click}
              >
              update
              </Button>
                </Box>
              </FormControl>
          </ModalBody>
          <ModalFooter>
            
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Settings;
