import {
  Button,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React from "react";
import { ChatState } from "../../context/ChatProvider";
import { getdecryption } from "../config/ChatLogics";
import ForwardMessageModel from "./messageModal/ForwardMessageModel";

const DeleteMessage = ({ children, message, fetchAgain, setFetchAgain }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, setUpdateMessages } = ChatState();
  const toast = useToast();

  const deletemessage = async (messageid, senderid) => {
    if (user._id !== senderid) {
      toast({
        title: "you can't delete this message",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    if (!messageid) {
      toast({
        title: "Can't find the message",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const info = new FormData();
      info.append("_id", messageid);
      const { data } = await axios.post(
        "/api/messages/deletemessage",
        info,
        config
      );
      setUpdateMessages(true);
      onClose();
      toast({
        title: "Message is deleted",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      toast({
        title: "some error occured",
        description: error,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const downloadFile = (message) => {
    axios({
      url: getdecryption(message.File), //your url
      method: "GET",
      responseType: "blob", // important
    }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", message.FileName.split("-").pop()); //or any other extension
      document.body.appendChild(link);
      link.click();
    });
  };

  return (
    <div>
      {message.messageType !== "6" ? (<span onClick={onOpen}>{children}</span>) : null}
      <Modal isOpen={isOpen} onClose={onClose} >
        <ModalOverlay />
        <ModalContent bg="transparent" boxShadow="none">
          <ModalBody display="flex" flexDirection="column" bg="transparent"
          boxShadow="none"
          ml="270px"
          mr="-100px"
          >
              <>
              <Button
              borderBottomRadius="0px"
              borderBottomWidth="4px"
              borderColor="blue.300"
              h="44px"
              _focus={{
                shadow: "none"
              }}
              onClick={function (e) {
                deletemessage(message._id, message.sender._id); //can pass arguments this.btnTapped(foo, bar);
              }}
              >
              Delete Message
            </Button>
              <ForwardMessageModel message={message} fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} >
              <Button
              borderRadius="0px"
              borderBottomWidth="4px"
              borderColor="blue.300"
              h="44px"
              w="100%"
              _focus={{
                shadow: "none"
              }}
              >
              Forward Message
            </Button>
                </ForwardMessageModel>
                </>

            {message.messageType === "2" || message.messageType === "4" ? (
              <Button borderTopRadius="0px" onClick={() => downloadFile(message)}>Download</Button>
            ) : null}
            
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default DeleteMessage;
