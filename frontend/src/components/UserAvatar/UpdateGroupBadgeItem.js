import { CloseIcon } from '@chakra-ui/icons'
import { Avatar, Box, Button, Image, Text } from '@chakra-ui/react'
import React,{useState} from 'react'
import crowngold from "../../assets/crown.png"
import crownblue from "../../assets/crownblue.png"
import GroupChatUsersOptions from '../miscellaneous/groupChat/GroupChatUsersOptions'


function UpdateGroupChatModal({loggedInUser, user, handleFunction, chat, setGroupChatName, fetchAgain, setFetchAgain}) {
 const [isVisible, setIsVisible] = useState(false)



 const renderCloseButton = () => {
    if(chat.groupAdmin.indexOf(loggedInUser._id) > -1){
      return <CloseIcon pl={1} display="flex" onClick={handleFunction} />
    } else {
      return <Box h="10px" w="100%"></Box>;
    }
 }

 const renderCrown = () => {
   if(chat.groupAdmin.indexOf(loggedInUser._id) > -1){
     if(chat.groupAdmin.indexOf(user._id) > -1){
      return <GroupChatUsersOptions user={user} isAdmin={true} setGroupChatName={setGroupChatName} loggedInUser={loggedInUser} chat={chat} fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}><Button float="right" m="0px" mr="14px" w="20px" h="20px" minW="0px" p="3px" borderRadius='40px' bg="white" _focus={{ shadow:"none"}} zIndex={1}> <Image src={crowngold} /></Button></GroupChatUsersOptions>
      } else {
      return <GroupChatUsersOptions user={user} isAdmin={false} setGroupChatName={setGroupChatName} loggedInUser={loggedInUser} chat={chat} fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}><Button float="right" m="0px" mr="14px" w="20px" h="20px" minW="0px" p="3px" borderRadius='40px' bg="white" _focus={{ shadow:"none"}} zIndex={1}> <Image src={crownblue} /></Button></GroupChatUsersOptions>
      }
    } else {
      if(chat.groupAdmin.indexOf(user._id) > -1){
        return <Button float="right" m="0px" mr="14px" w="20px" h="20px" minW="0px" p="3px" borderRadius='40px' bg="white" _focus={{ shadow:"none"}} zIndex={1}> <Image src={crowngold} /></Button>
       } else {
         return <Button float="right" m="0px" mr="14px" w="20px" h="20px" minW="0px" p="3px" borderRadius='40px' bg="white" _focus={{ shadow:"none"}} zIndex={1}> <Image src={crownblue} /></Button>
       }
    }
}
  return (
    <>
   
    <Box
        px={2}
        py={1}
        m={3}
        mb={2}
        h="130px"
        w="110px"
        display="inline-block"
        variant="solid"
        borderRadius="10px"
        color="black"
        fontSize={12}
        bg="#90cdf4"
        cursor="pointer"
        overflow="hidden"
        boxShadow="14px 14px 28px #090a10, -14px -14px 28px #252642"
        >
            {renderCloseButton()}
          
            <Box w="100%" h="20px"> {renderCrown()}</Box>

        <Avatar
      w="60px"
      h="60px"
      display="flex"
      m="auto"
      mt="-15px"
      ml="17px"
      size="sm"
      cursor="pointer"
      name={user.name}
      src={user.pic}
    />
    <Box textAlign="center" fontSize="15px">
      {user.name}
    </Box>
        </Box>
          </>
  )
}

export default UpdateGroupChatModal;
