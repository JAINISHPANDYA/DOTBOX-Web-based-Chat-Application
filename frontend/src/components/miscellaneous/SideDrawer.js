import { Button } from "@chakra-ui/button";
import { Box } from "@chakra-ui/layout";
import { Circle } from "@chakra-ui/react";
import {
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from "@chakra-ui/menu";
import { BellIcon } from "@chakra-ui/icons";
import { Avatar } from "@chakra-ui/avatar";
import { useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "@chakra-ui/toast";
import ProfileModel from "./ProfileModel";
import { ChatState } from "../../context/ChatProvider";
import { getSender } from "../config/ChatLogics";
import Settings from "./Settings";

function SideDrawer() {
  const baseURL = process.env.REACT_APP_SERVERURL;
  if (typeof baseURL !== "undefined") {
    axios.defaults.baseURL = baseURL;
  }

  const {
    selectedChat,
    setSelectedChat,
    user,
    notification,
    setNotification,
    chatBgOnNotification,
    setChatBgOnNotification,
  } = ChatState();
  useEffect(() => {
    console.log("matched");
    if (notification.chat === selectedChat) {
      console.log("mached again");
    }
  }, [selectedChat]);

  const refreshpage = () => {
    window.location.reload(false);
  };
  return (
    <>
      <Box
        d="flex"
        justifyContent="space-between"
        alignItems="center"
        w="26.65%"
        p="5px 10px 5px 10px"
        borderRight="1px solid #2c2c2c"
        bg="#0c0e2b"
        maxH="50px"
      >
        <Box
          fontSize="3xl"
          fontWeight="700"
          onClick={() => refreshpage()}
          cursor="pointer"
          style={{
            fontFamily: "-apple-system, system-ui, BlinkMacSystemFont",
          }}
        >
          dotBox
        </Box>
        <div>
          <Menu autoSelect={false}>
            <MenuButton p={1}>
              <BellIcon position="relative" fontSize="2xl" m={1} top="4px" />
              {notification.length > 0 ? (
                <Circle
                  position="relative"
                  size="12px"
                  fontSize="9px"
                  bg="blue.200"
                  color="black"
                  left="20px"
                  top="-20px"
                >
                  {notification.length}
                </Circle>
              ) : (
                <Circle
                  position="relative"
                  size="12px"
                  fontSize="12px"
                  bg="transperent"
                  color="transperent"
                  left="20px"
                  top="-20px"
                ></Circle>
              )}
            </MenuButton>
            <MenuList pl={2} bg="#17182a" border={0}>
              {!notification.length && "No New Messages"}
              {notification.map((notif) => (
                <MenuItem
                  _hover={{
                    bg: "#17182a",
                  }}
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n) => n !== notif));
                    setChatBgOnNotification(!chatBgOnNotification);
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New Message in ${notif.chat.chatName}`
                    : `New Message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu autoSelect={false}>
            <MenuButton
              as={Button}
              bg="transparent"
              _hover={{ background: "transperent" }}
              _active={{ background: "transperent" }}
              _focus={{ boxShadow: "none" }}
              mt="8px"
            >
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
            <MenuList bgColor="#0B0517" border="0px">
              <ProfileModel user={user}>
                <MenuItem
                  _hover={{ backgroundColor: "#17182a" }}
                  _active={{ backgroundColor: "#17182a" }}
                >
                  My Profile
                </MenuItem>{" "}
              </ProfileModel>
              <MenuDivider color="#67c0db" />
              <Settings user={user}>
                <MenuItem
                  _hover={{ backgroundColor: "#17182a" }}
                  _active={{ backgroundColor: "#17182a" }}
                >
                  Settings
                </MenuItem>
              </Settings>
            </MenuList>
          </Menu>
        </div>
      </Box>
    </>
  );
}

export default SideDrawer;
