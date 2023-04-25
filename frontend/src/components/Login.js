import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { VStack } from "@chakra-ui/layout";
import { useEffect, useState } from "react";
import axios from "axios";
import { useToast, Box, Text } from "@chakra-ui/react";
import { Link, useHistory, withRouter } from "react-router-dom";
import { getdecryption, getencryption } from "./config/ChatLogics";
import "./Login.css";
import { ViewIcon, ViewOffIcon} from '@chakra-ui/icons'



const Login = () => {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const toast = useToast();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState(false);

  const history = useHistory();
    useEffect(() => {
    const user =  JSON.parse(localStorage.getItem("userInfo"));
  
  if(user) history.push("/chats"); 
  }, [history]); 
  

  

  
  const baseURL = process.env.REACT_APP_SERVERURL;
if (typeof baseURL !== 'undefined') {
  axios.defaults.baseURL = baseURL;
}

  const submitHandler = async () => {
    if (!email || !password) {
      toast({
        title: "Please Fill all the Feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

   


    try{
      const info = new FormData()
      info.append('email',email)
      info.append('password', getencryption(password))
      const { data } = await axios.post("/api/user/login", info);
      
      if(data.name !== undefined){
      toast({
        title: "Login Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      await localStorage.setItem("userInfo", JSON.stringify(data));
      window.location.reload(false);

    } 
    
    if(data.name === undefined){
      toast({
        title: "Please Enter Valid Credentials!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false)
      console.log('in the toast')
    }
      
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  return (
    <Box className="login" >
      <Box className="loginbox">
      <Box className="loginlogo">
        <Text className="loginlogotext">.dotBox</Text>
      </Box> 
      <Box className="loginsubhead">Log in to your Account</Box>
     
      <Box
       className="loginformsection"
        >
  
    <VStack spacing="10px">
      <FormControl id="email-login" isRequired>
        <FormLabel className="emailinputlabel" >Email Address</FormLabel>
        <Input
          className="emailinput"
          type="email"
          placeholder="Enter Your Email Address"
          value={email ?? ""}
          variant='outline'
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl id="password-login" isRequired>
        <FormLabel className="passwordinputlabel">Password</FormLabel>
        <InputGroup size="md">
          <Input
            className="passwordinput"
            value={password ?? ""}
            variant='outline'
            onChange={(e) => setPassword(e.target.value)}
            type={show ? "text" : "password"}
            placeholder="Enter password"
            maxLength={15}
          />
          <InputRightElement width="4.3rem">
            <Button h="1.75rem" mr="10px" size="sm" onClick={handleClick}>
              {show ? <ViewOffIcon/> : <ViewIcon/>}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <Button
        className="submit"
        bg='#1d2445'
        color='white'
        width="100%"
        style={{ marginTop: 30 }}
        onClick={submitHandler}
        isLoading={loading}
        _hover={{
          bg:"#1d2445"
        }}
        _focus={{
          shadow:"none"
        }}
      >
        Login
      </Button>
      <Link className="signuplink" to="/signup">Don't have an accound.Sign Up</Link>

    </VStack>
    </Box>
    </Box>
    </Box>

  
  );
};

export default withRouter(Login);