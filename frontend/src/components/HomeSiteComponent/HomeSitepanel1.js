import { Box, Button, Image, Text, SimpleGrid } from '@chakra-ui/react';
import React from 'react';
import panel1 from '../../assets/homesiteassets/panel1pro.png';
import "./HomeSitepanel1.css";

const HomeSitePanel1 = () => {
  return (
          <SimpleGrid className='panelbox'>
            <Text className='textbox1'>
              Stay in touch
            </Text>
            <Text className='textbox2'>
              with your Family and Friends with
            </Text>
            <Text className='textbox3'>
              Privacy
            </Text>
              <Image className='imagebox' src={panel1} ></Image>
          </SimpleGrid>
     
  )
}

export default HomeSitePanel1;