import React from "react";
import { Box, Button, Divider, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Text, useDisclosure } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { HamburgerIcon } from '@chakra-ui/icons'
import "./HomeSiteheader.css"

const HomeSiteheader = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <Box className="header">
      <Box className="innerboxheader">
        <Box className="logo">
          <Link to="/" className="logotext">
            dotbox
          </Link>
        </Box>
        <Box className="linkbox">
          <Link
          className="linktoaboutus"
          to="/aboutUs"
          >About us</Link>
          <Link
          className="linktoprivacy"
          to="/privacy"
          >privacy</Link>
          <Link 
          className="linktologin"
          to="/login"
          >Log in</Link>
          <Link 
          className="linktosignup"
          to="/signup"
          >Join for Free</Link>
        </Box>
    
      <Link className="shutterbutton" onClick={onOpen}>
      <HamburgerIcon />
      </Link>
      <Drawer placement='top' onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerBody className="drawerbodysection">
            <Link
          className="drawerlinks"
          to="/aboutUs"
          >About us</Link>
          <Link
          className="drawerlinks"
          to="/privacy"
          >privacy</Link>
          <Link 
          className="drawerlinks"
          to="/login"
          >Log in</Link>
          <Link 
          className="drawerlinks"
          to="/signup"
          >Join for Free</Link>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
      </Box>
    </Box>

  );
};

export default HomeSiteheader;
