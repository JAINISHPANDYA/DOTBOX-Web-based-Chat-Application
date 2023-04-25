import { Box, Button, Container, Flex, Text } from '@chakra-ui/react'
import React from 'react'
import { BsFileEarmarkCheck, BsCameraVideo } from "react-icons/bs";
import { SiSocketdotio } from "react-icons/si";
import { IoNotificationsOutline, IoImageOutline } from "react-icons/io5";
import { MdOutlineForwardToInbox, MdGroups } from "react-icons/md";
import { BiVolumeFull } from "react-icons/bi";
import "./HomeSitepanel3.css"

const HomeSitePanel3 = () => {
  return (
        <Box className="features" id="features"  >
          <Box className='featureContent'>

            <Text className='featureHeading' style={{fontFamily: "-apple-system, system-ui, BlinkMacSystemFont",}}>Features</Text>

          <Box className="featureslist">

        

            <Box className='featurecolumn'>

              <Box className='featureBox'>
                <Box className='featureBoxIcon'>
                <IoImageOutline />
                </Box>
                <Flex className='FeatureBoxTitle'>
                  <Text className='FeatureBoxTitleText'>
                    Images
                  </Text>
                  <Text className='FeatureBoxDescriptionText'>
                    Send or recieve any type of images with easy two step send image method
                  </Text>
                </Flex>
              </Box>

              
              <Box className='featureBox'>
                <Box className='featureBoxIcon'>
                <BsFileEarmarkCheck />
                </Box>
                <Box className='FeatureBoxTitle'>
                  <Text className='FeatureBoxTitleText'>
                    Multiple Files
                  </Text>
                  <Text className='FeatureBoxDescriptionText'>
                  Send or recieve multiple files with single click. you can send or recieve any type of documents.
                  </Text>
                </Box>
              </Box>

              <Box className='featureBox'>
                <Box className='featureBoxIcon'>
                <BsCameraVideo /> 
                </Box>
                <Box className='FeatureBoxTitle'>
                  <Text className='FeatureBoxTitleText'>
                  Videos
                  </Text>
                  <Text className='FeatureBoxDescriptionText'>
                  Send or recieve Videos with one click method and also watch videos Online or Download.
                  </Text>
                </Box>
              </Box>

            </Box>



            <Box className='featurecolumn'>

            <Box className='featureBox'>
                <Box className='featureBoxIcon'>
                <BiVolumeFull /> 
                </Box>
                <Box className='FeatureBoxTitle'>
                  <Text className='FeatureBoxTitleText'>
                  Audios
                  </Text>
                  <Text className='FeatureBoxDescriptionText'>
                  Send or recieve Audios with one click method and also play Audios Online or Download.
                  </Text>
                </Box>
              </Box>
              

              <Box className='featureBox'>
                <Box className='featureBoxIcon'>
                <SiSocketdotio /> 
                </Box>
                <Box className='FeatureBoxTitle'>
                  <Text className='FeatureBoxTitleText'>
                  Real time messaging
                  </Text>
                  <Text className='FeatureBoxDescriptionText'>
                  dotbox implements sockets and by sockets you can send messages and other actions in real time without any delays. 
                  </Text>
                </Box>
              </Box>

              <Box className='featureBox'>
                <Box className='featureBoxIcon'>
                <IoNotificationsOutline />
                </Box>
                <Box className='FeatureBoxTitle'>
                  <Text className='FeatureBoxTitleText'>
                  Notification
                  </Text>
                  <Text className='FeatureBoxDescriptionText'>
                  Real time notification for messages.So that you don't miss any important message.
                  </Text>
                </Box>
              </Box>

             
            </Box>


            <Box className='featurecolumn'>

            <Box className='featureBox'>
                <Box className='featureBoxIcon'>
                <MdOutlineForwardToInbox />
                 </Box>
                <Box className='FeatureBoxTitle'>
                  <Text className='FeatureBoxTitleText'>
                  Forward Messages
                  </Text>
                  <Text className='FeatureBoxDescriptionText'>
                  you can directly forward the message from one chat to another with just one click.
                  </Text>
                </Box>
              </Box>

              <Box className='featureBox'>
                <Box className='featureBoxIcon'>
                <MdGroups />
                 </Box>
                <Box className='FeatureBoxTitle'>
                  <Text className='FeatureBoxTitleText'>
                  Group chats
                  </Text>
                  <Text className='FeatureBoxDescriptionText'>
                  Create groups and chat together with your friends, family.
                  </Text>
                </Box>
              </Box>
              
            </Box>

          </Box>
          </Box>
        </Box>
  )
}

export default HomeSitePanel3;