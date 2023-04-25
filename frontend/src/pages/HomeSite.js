import { Box } from '@chakra-ui/react'
import React from 'react'
import "./HomeSite.css"
import HomeSiteheader from '../components/HomeSiteComponent/HomeSiteheader'
import HomeSitePanel1 from '../components/HomeSiteComponent/HomeSitepanel1'
import HomeSitePanel2 from '../components/HomeSiteComponent/HomeSitepanel2'
import HomeSitePanel3 from '../components/HomeSiteComponent/HomeSitepanel3'
import HomeSitePanel4 from '../components/HomeSiteComponent/HomeSitepanel4'

const HomeSite = () => {
  return (
      <Box w="100%" h="100%" display="flex" flexDirection="column">
        <Box className='panel1'>
        <HomeSiteheader />
        </Box>
        <Box>
          <HomeSitePanel1 />
        </Box>
        <Box>
          <HomeSitePanel2 />
        </Box>
        <Box>
          <HomeSitePanel3 />
        </Box>
        <Box>
          <HomeSitePanel4 />
        </Box>
        <Box>
          <HomeSiteheader />
        </Box>


      </Box>
  )
}

export default HomeSite