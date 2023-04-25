import { Box, Button, Divider, Image, Text } from '@chakra-ui/react'
import React from 'react'
import "./HomeSitepanel4.css";
import chat from '../../assets/homesiteassets/chat.png'

const HomeSitePanel4 = () => {
  return (
        <Box className='qoute'>
            <Box className='qoutebox' display="flex" flexDirection="row" >
              <Image className='privacyimage' src={chat} width="600px" height="500px" ></Image>
              <Box className='textbox'>
              <Box className='textpanel'>
                Share anything, anywhere, anytime just with a click
              </Box>
              <Box className='textdesc'>
                using the socket.io high speed communication technology.Send and recieve the messages in the fraction of seconds 
              </Box>
              </Box>
            </Box>
          </Box>
  )
}

export default HomeSitePanel4;