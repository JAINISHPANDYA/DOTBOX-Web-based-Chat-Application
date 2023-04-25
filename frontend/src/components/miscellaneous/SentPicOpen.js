import {
  Avatar,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  Image,
  Link,
  Box,
} from "@chakra-ui/react";
import axios from "axios";

import React from "react";
import { BsDownload } from "react-icons/bs";
import { getdecryption } from "../config/ChatLogics";

const SentPicOpen = ({ children, message }) => {
  const OverlayOne = () => (
    <ModalOverlay
      bg="blackAlpha.300"
      backdropFilter="blur(10px) hue-rotate(0deg)"
    />
  );

  const OverlayTwo = () => (
    <ModalOverlay
      bg="none"
      backdropFilter="auto"
      backdropInvert="80%"
      backdropBlur="2px"
    />
  );
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [overlay, setOverlay] = React.useState(<OverlayOne />);




  return (
    <>
      <span onClick={onOpen}>{children}</span>
      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        {overlay}
        <ModalContent bg="transparent">
          <Image
            cursor="pointer"
            alt="image"
            w="auto"
            h="auto"
            m="auto"
            maxW="600px"
            maxH="600px"
            src={getdecryption(message.File)}
            />
        </ModalContent>
      </Modal>
    </>
  );
};

export default SentPicOpen;
