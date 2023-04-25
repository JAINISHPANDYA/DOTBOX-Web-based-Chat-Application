import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { Avatar, Box, VStack,Heading, Divider, Text } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/toast";
import { BsCamera } from "react-icons/bs";
import axios from "axios";
import { useEffect, useState } from "react";
import { getencryption } from "./config/ChatLogics";
import './Signup.css'
import { Link, useHistory } from "react-router-dom";






const Signup = () => {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const toast = useToast();
 

  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [confirmpassword, setConfirmpassword] = useState();
  const [password, setPassword] = useState();
  const [picLoading, setPicLoading] = useState(false);
  const [file, setFile] = useState(null)
  const [filePreview, setFilePreview] = useState(null)

  const history = useHistory();
    useEffect(() => {
    const user =  JSON.parse(localStorage.getItem("userInfo"));
  
  if(user) history.push("/chats"); 
  }, [history]); 

  const upload = () => {
    document.getElementById('profileImage').click()
  }

  const handleupload = async(e) => {
      setFile(e.target.files[0]);
      const file = e.target.files[0];
      setFilePreview(URL.createObjectURL(file))
  };

  const submitHandler = async () => {
    setPicLoading(true);
    if (!name || !email || !password || !confirmpassword || !file) {
      toast({
        title: "Please Fill all the fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
      return;
    }
    if (password !== confirmpassword) {
      toast({
        title: "Passwords Do Not Match",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    console.log(name, email, password, file);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const info = new FormData();
      info.append('file',file)
      info.append('name',name)
      info.append('email',email)
      info.append('password',getencryption(password))

      const { data } = await axios.post("/api/user", info , config);
      console.log(data);
      if(data){
        toast({
          title: "Registration Successful",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        localStorage.setItem("userInfo", JSON.stringify(data));
        setPicLoading(false);
        window.location.reload(false);
      }
    } catch (error) {
      toast({
        title: "Error Occured",
        status: error.message,
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
    }
  };


  return (
    <Box className="signup">
      <Box className="signupbox">
      <Box className="signuplogo">
        <Text className="signuplogotext">.dotBox</Text>
      </Box> 
      <Box className="signupsubhead">Create an Account</Box>

      <Box
       className="signupformsection"
        >
    <VStack spacing="0.5rem">
      <Box className="signupavatarbox">
          <Box className="signupavatarinnerbox">
        <Avatar src={filePreview} className="signupavatar" />
          <Button bg="blue.200" minW="0" w="32px" h="32px"  left="80px" mt="-45px" borderRadius="full" p="5px" onClick={upload}>
          <BsCamera m="auto" fontSize="15px" color="white" />
          </Button>
          </Box>
        </Box>
        <FormControl id="first-name" isRequired>
        <FormLabel>NAME</FormLabel>
        <Input
        variant='outline' 
          maxLength={15}
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>
      <FormControl id="email-signup" isRequired>
        <FormLabel>EMAIL</FormLabel>
        <Input
          type="email"
          variant='outline' 
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl id="password-signup" isRequired>
        <FormLabel>PASSWORD</FormLabel>
        <InputGroup size="md">
          <Input
          variant='outline' 
            type={show ? "text" : "password"}
            maxLength={15}
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}
            _focus={{
              shadow:"none"
            }}
            >
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="password2-signup" isRequired>
        <FormLabel>CONFIRM PASSWORD</FormLabel>
        <InputGroup size="md">
          <Input
            type={show ? "text" : "password"}
            variant='outline'
            maxLength={15}
            onChange={(e) => setConfirmpassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick} 
            _focus={{
              shadow:"none"
            }}
            >
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="pic">
        <Input
          id="profileImage"
          type="file"
          variant='outline' 
          p={1.5}
          accept="image/*"
          hidden
          onChange={handleupload}
        />
      </FormControl>

        <Button
        bg='#1d2445'
        color='white'
        width="100%"
        style={{ marginTop: 20 }}
        onClick={submitHandler}
        isLoading={picLoading}

        _hover={{
          bg:"#1d2445"
        }}
        _focus={{
          shadow:"none"
        }}
      >
        Sign Up
      </Button>
      <Link className="loginlink" to="/login">Already have an account.Log in</Link>
    </VStack>
      </Box>
      </Box>
    </Box>


  );
};

export default Signup;