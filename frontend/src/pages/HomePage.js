import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Container, Box, Button, Heading, Divider } from "@chakra-ui/react";

import "./HomePage.css";


import Login from "../components/Login";
import Signup from "../components/Signup";

const HomePage = (props) => {
  const history = useHistory();
    useEffect(() => {
    const user =  JSON.parse(localStorage.getItem("userInfo"));
    
    if(user) history.push("/chats"); 
    }, [history]); 

  const [inactive, setInactive] = React.useState(false);

  const handletoggle = () => {
    setInactive(!inactive);
  };

  

  return (
    <Container maxW="xl" centerContent>
      <Box
        bg="transperent"
        w="2400px"
        height="755px"
        p={4}
        color="white"
        marginTop="-10px"
        className={`mainbox${inactive ? "inactive" : ""}`}
      >


{/* this is for login --------------------------------------------------------------------------------------------------- */}
        
        <Box
        bg="#050a29"
        w="25%"
        h="77%"
        position="relative"
        top="100px"
        left="50px"
        borderRadius="15px"
        >
        <Box
          color="black"
          w="90%"
          position="relative"
          p={4}
          top="230px"
          mx="auto"
          borderRadius="lg"
          borderWidth="0px"
          box-shadow="5px 5px 10px #4c5b63,-5px -5px 10px #ffffff"
          className="box1"
          >
          <Login />
        </Box>
        
       <Box
          width='270px'
          position="relative"
          top="-220px"
          right="-160px"
          box-shadow='35px 35px 70px #0c0e1c,-35px -35px 70px #2e3a6e'
          >
          {/* <Image src={logo1} alt='message' /> */}
          <Heading color='blue.200' fontSize='55px' position='relative' top='-65px' right='-35px'>.dotBox</Heading>
        </Box> 
        <Divider position="relative" top="-280px" borderColor="blue.900" orientation='horizontal' />
        {/* <Box
          width='270px'
          position="relative"
          top="-340px"
          right="340px"
          box-shadow='35px 35px 70px #0c0e1c,-35px -35px 70px #2e3a6e'
          >
          
          <Heading color='white' fontSize='30px' fontWeight="1000" position='relative' top='-3px' right='50px'>LOGIN</Heading>
        </Box> */}
      
        <Heading
          color="blue.200"
          float="right"
          position="relative"
          top="-270px"
          right="118px"
          id="head-changing"
          >
          Hello ! Welcome Back
          <Box fontSize='15px' color='blue.600' position='relative' top='20px' left="60px">Login to your account of .dotBox</Box>
        </Heading>
        <Button
          colorScheme="blue"
          variant="outline"
          borderRadius="35px"
          borderWidth="0px"
          padding="5px"
          w="280px"
          float="right"
          position="relative"
          top="87px"
          right="50px"
          onClick={() => handletoggle()}
          _hover={{
            bg:"#050a29"
          }}
          _active={{
            background:"#050a29"
          }}
          _focus={{
            shadow:"none"
          }}
          >
          don't have account? Create account
        </Button>
          </Box>






{/* this is for sign up ------------------------------------------------------------------------------------------------------- */}


      <Box
      position="relative"
      bg="white"
      h="99%"
      w="25%"
      top="-545px"
      right="-1700px"
      borderRadius="15px"
      >
        <Box
          width='270px'
          position="relative"
          top="80px"
          right="-160px"
          box-shadow='35px 35px 70px #0c0e1c,-35px -35px 70px #2e3a6e'
          >
          {/* <Image src={logo1} alt='message' /> */}
          <Heading color='blue.200' fontSize='55px' position='relative' top='-65px' right='-35px'>.dotBox</Heading>
        </Box> 
        <Divider orientation='horizontal' position="relative" top="20px" border="2px solid blue.800" />

        <Heading
          color="blue.900"
          float="right"
          position="relative"
          top="30px"
          right="115px"
          id="head-changing"
          >
          Welcome to .dotBox
          <Box fontSize='15px' color='blue.600' position='relative' top='20px'>Create an account to .dotBox to access all features</Box>
        </Heading>
        <Button
          colorScheme="blue"
          variant="outline"
          borderRadius="35px"
          borderWidth="0px"
          padding="5px"
          w="280px"
          float="right"
          position="relative"
          top="550px"
          right="30px"
          onClick={() => handletoggle()}

          _hover={{
            background:"transperent"
          }}
          _active={{
            background:"transperent"
          }}
          _focus={{
            shadow:"none"
          }}
        >
          already have an account? Log in
        </Button>

       
        <Box
          color="black"
          w="90%"
          p={4}
          position="relative"
          right="27px"
          top="-0px"
          borderRadius="lg"
          borderWidth="0px"
          float="right"
          box-shadow="5px 5px 10px #4c5b63,-5px -5px 10px #ffffff"
          >
          <Signup />
        </Box>
        <Box
          position="relative"
          float='right'
          width='270px'
          top='-260px'
          right='-1300px'
          box-shadow='35px 35px 70px #0c0e1c,-35px -35px 70px #2e3a6e'
          >
          {/* <Image src={logo4} alt='message' /> */}
          <Heading color='blue.200' fontSize='80px' position='relative' top='-63px' right='-60px'>Sign up</Heading>
        </Box>
          </Box>
      </Box>
    </Container>
  );
};

export default HomePage;
