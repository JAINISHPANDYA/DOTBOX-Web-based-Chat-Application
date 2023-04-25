import { CloseIcon } from '@chakra-ui/icons'
import { Avatar, Box } from '@chakra-ui/react'
import React,{useState} from 'react'

function UserBadgeItem({ user, handleFunction }) {
 const [isVisible, setIsVisible] = useState(false)


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
          <CloseIcon pl={1} display="flex" onClick={handleFunction} />
        <Avatar
      mr={2}
      w="60px"
      h="60px"
      display="flex"
      m="auto"
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

export default UserBadgeItem;
