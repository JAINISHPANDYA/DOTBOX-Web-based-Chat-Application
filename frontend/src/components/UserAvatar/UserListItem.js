import { Avatar, Box, Text } from '@chakra-ui/react';
import React from 'react'

const UserListItem = ({user,handleFunction}) => {
  return (
    <>
      <Box
      className="userlistitem"
    onClick={handleFunction}
    cursor="pointer"
    style={{
      background: "linear-gradient(145deg, #11143e, #14184a)"
    }}
    w="100%"
    d="flex"
    alignItems="center"
    color="white"
    px={3}
    py={2}
    mb={2}
    borderRadius="lg"
  >
    <Avatar
      w="50px"
      h="50px"
      mr={2}
      size="sm"
      cursor="pointer"
      name={user.name}
      src={user.pic}
    />
    <Box pl="5px">
      <Text fontSize="20px">{user.name}</Text>
      <Text fontSize="xs">
        <b>Email : </b>
        {user.email}
      </Text>
    </Box>
  </Box>

</>
  )
}

export default UserListItem