import {
  Avatar,
  Box,
  Button,
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
import ImageConfig from "../../config/ImageConfig";
import Send from "../../../assets/send.png";

const ENDPOINT = process.env.REACT_APP_SERVERURL;

var socket;

const FileMessageModal = ({ children, setFetchAgain, fetchAgain}) => {
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

  const [fileList, setFileList] = useState([]);

  const onDragEnter = () => wrapperRef.current.classList.add("dragover");

  const onDragLeave = () => wrapperRef.current.classList.remove("dragover");

  const onDrop = () => wrapperRef.current.classList.remove("dragover");

  const onFileDrop = (e) => {
    const newFiles = [];
    for (let i = 0; i < e.target.files.length; i++) {
      newFiles.push(e.target.files[i]);
    }
    setFileList(newFiles);
  };

  const fileRemove = (file) => {
    const updatedList = [...fileList];
    updatedList.splice(fileList.indexOf(file), 1);
    setFileList(updatedList);
  };




  const handlechanges = async () => {
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        console.log(fileList.length);

        const info = new FormData;
        info.append('userId', user._id)
        info.append('messageType', "3")
        info.append('chatId', selectedChat._id)
        for (let i = 0; i < fileList.length; i++) {
          if (i === 0) {
            info.append('content', getencryption(messageContent));
          }
          else {
            info.append('content', " ");
          }
          console.log(fileList[i])
          info.append('file',fileList[i])
          
              const { data } = await axios.post("/api/messages/sendfile", info, config);
          
              socket.emit("new message", data);
              setMessages([...messages, data]);
              setFetchAgain(!fetchAgain)
              setUpdateMessages(true);

              if(i === fileList.length - 1){
                document.getElementById("closebutton").click();
              }
        }
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
            <ModalHeader color="white">upload files</ModalHeader>
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
                <input type="file" value="" onChange={onFileDrop} multiple />
              </Box>
              <Box w="90%" mx="auto">
                {fileList.length > 0 ? (
                  <div className="drop-file-preview">
                    <Text color="white" className="drop-file-preview__title">
                      Ready to upload
                    </Text>
                    <Box h="320px" overflow="scroll">
                      {fileList.map((item, index) => (
                        <Box
                          key={index}
                          bg="white"
                          maxH="70px"
                          overflow="hidden"
                          className="drop-file-preview__item"
                        >
                          <img
                            src={
                              ImageConfig[item.name.split('.').pop()] ||
                              ImageConfig["default"]
                            }
                            alt=""
                          />
                          <Box className="drop-file-preview__item__info">
                            <Text overflow="hidden">{item.name}</Text>
                          </Box>
                          <span
                            className="drop-file-preview__item__del"
                            onClick={() => fileRemove(item)}
                          >
                            x
                          </span>
                        </Box>
                      ))}
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
                ) : null}
              </Box>
              
            </>
          </ModalContent>
        </Modal>
      </>
    </div>
  );
};

export default FileMessageModal;
