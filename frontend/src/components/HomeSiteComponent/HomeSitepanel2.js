import { Box, Button, Flex, Image, SimpleGrid, Text } from '@chakra-ui/react'
import React from 'react'
import panel2 from '../../assets/homesiteassets/panel2plus.png'
import "./HomeSitepanel2.css"

const HomeSitePanel2 = () => {
  return (
        <Box className='privacy' id="privacy">
          <Box className='privacybox'>
            
            <Box className='textbeside'>
              Your Conversations are just upto you.
              <Text className='smalltext'>
                New Multilayer encryption system keeps all your conversation Safe and secure. Learn more.
              </Text>
            </Box>
            <Box className='privacyimagebox'>
              <Image className='privacyimage' src={panel2} ></Image>
            </Box>
          </Box>
        </Box>
  )
}

export default HomeSitePanel2;