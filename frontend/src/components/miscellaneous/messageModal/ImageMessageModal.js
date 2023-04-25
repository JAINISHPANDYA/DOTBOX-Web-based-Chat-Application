import {
  Avatar,
  Box,
  Button,
  Icon,
  Image,
  Input,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import io from "socket.io-client";
import { ChatState } from "../../../context/ChatProvider";
import { getencryption } from "../../config/ChatLogics";
import uploadImg from "../../../assets/cloud-upload-regular-240.png";
import "./FileMessageModal.css";
import Send from "../../../assets/send.png";
import { SmallCloseIcon } from '@chakra-ui/icons'


const ENDPOINT = process.env.REACT_APP_SERVERURL;

var socket;

const ImageMessageModal = ({ children, setFetchAgain, fetchAgain}) => {
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
  const {
    user,
    selectedChat,
    messages,
    setMessages,
    updateMessages,
    setUpdateMessages,
  } = ChatState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [overlay, setOverlay] = React.useState(<OverlayOne />);
  const [socketConnected, setSocketConnected] = useState(false);
  const [messageContent, setMessageContent] = useState("");
  const toast = useToast();

  

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));

    // eslint-disable-next-line
  }, []);


  const typingHandler = async (e) => {
    setMessageContent(e.target.value);
  };
  const wrapperRef = useRef(null);

  const [file, setFile] = useState();
  const [url, setUrl] = useState();

  const onDragEnter = () => wrapperRef.current.classList.add("dragover");

  const onDragLeave = () => wrapperRef.current.classList.remove("dragover");

  const onDrop = () => wrapperRef.current.classList.remove("dragover");

  const onFileDrop = (e) => {
    setFile(e.target.files[0]);
    setUrl(URL.createObjectURL(e.target.files[0]))
  };

  const fileRemove = () => {
    setFile(undefined)
    setUrl("")
  };




  const handlechanges = async () => {
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };

        const info = new FormData;
        info.append('userId', user._id)
        info.append('messageType', "2")
        info.append('chatId', selectedChat._id)
        info.append('content', getencryption(messageContent));
        info.append('file',file)
          
        const { data } = await axios.post("/api/messages/sendImage", info, config);
          
        socket.emit("new message", data);
        setMessages([...messages, data]);
        setFetchAgain(!fetchAgain)
        setUpdateMessages(true);
        document.getElementById("closebutton").click();
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }

    // document.getElementById("closebutton").click();
  };

  const click = () => {
    onOpen();
  };

  return (
    <div>
      <>
        <span onClick={click}>{children}</span>

        <Modal isCentered isOpen={isOpen} onClose={onClose}>
          {overlay}

          <ModalContent
            h="700px"
            maxW="4000px"
            my="0"
            w="430px"
            bg="#171829"
            overflow="hidden"
          >
            <ModalCloseButton
              color="white"
              id="closebutton"
              _focus={{
                boxShadow: "none",
              }}
            />
            <ModalHeader color="white">upload Image</ModalHeader>
            <>
              <Box
                ref={wrapperRef}
                className="drop-file-input"
                onDragEnter={onDragEnter}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                w="380px"
                mx="auto"
              >
                <Box className="drop-file-input__label">
                  <Image mx="auto" src={uploadImg} alt="" />
                  <Text color="white">Drag & Drop your files here</Text>
                </Box>
                <input type="file" accept="image/*" value="" onChange={onFileDrop} />
              </Box>
              <Box w="90%" mx="auto">
                  <div className="drop-file-preview">
                    <Box w="100%" display="flex" flexDirection="row">
                    <Text color="white" w="90%" className="drop-file-preview__title">
                      Ready to upload
                    </Text>
                    <Icon as={SmallCloseIcon} w="30px" h="30px" color="white" onClick={() => fileRemove()} />
                    </Box>
                    <Box h="320px" overflow="scroll">
                      <Image src={url} maxH="300px" maxW="300px" h="auto" w="auto" mx="auto" />
                    </Box>
                  <Box
                  display="flex"
                  flexDirection="row"
                  w="100%"
                  mx="auto"
                  my="20px"
                  >
                  <Input
                    variant="flushed"
                    w="90%"
                    placeholder="type a message"
                    color="blue.200"
                    value={messageContent}
                    onChange={typingHandler}
                    ></Input>
                  <Button mx="10px" borderRadius="full" bg="blue.100" p="0px" onClick={handlechanges} ><Avatar src={Send} h="25px" w="25px" m="0px" mr="3px" mt="3px" borderRadius={0} bg="transparent" /></Button>
                </Box>
              </div>
              </Box>
              
            </>
          </ModalContent>
        </Modal>
      </>
    </div>
  );
};

export default ImageMessageModal;
