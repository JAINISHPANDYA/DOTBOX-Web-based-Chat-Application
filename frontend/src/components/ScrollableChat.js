import { Avatar } from "@chakra-ui/avatar";
import { Tooltip } from "@chakra-ui/tooltip";
import ScrollableFeed from "react-scrollable-feed";
import { useEffect, useRef, useState } from "react";
import "../components/ScrollableChat.css";
import { IoMdDownload } from "react-icons/io";
import {
  getdecryption,
  getencryption,
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
  isSenderLastMessage,
  getmessagetype,
} from "./config/ChatLogics";
import { ChatState } from "../context/ChatProvider";
import {
  Box,
  Button,
  Image,
  Text,
} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { BiDotsVerticalRounded } from "react-icons/bi";
import CryptoJS from "crypto-js";
import SentPicOpen from "./miscellaneous/SentPicOpen";
import DeleteMessage from "./miscellaneous/DeleteMessage";

const manageDateTime2 = (datetime) => {
  return datetime.toUTCString();
};

const managetime = (hour, min) => {
  let hours = parseInt(hour);
  hours = hours + 5;

  let mins = parseInt(min);
  mins = mins + 30;
  if (mins > 59) {
    mins = mins - 60;
    hours = hours + 1;
  }

  if (hours > 12) {
    hours = hours - 12;
  }

  let space = " ";
  let colon = ":";

  return `${space}${hours}${colon}${mins}`;
};

const manageDateTime = (datetime) => {
  var messagedate = datetime.slice(8, 10);
  var messagemonth = datetime.slice(5, 7);
  var messageyear = datetime.slice(0, 4);
  var hyphen = datetime.slice(4, 5);

  var messagehour = datetime.slice(11, 13);
  var messagemin = datetime.slice(14, 16);

  let space = " ";
  let colon = ":";

  datetime = `${messagedate}${hyphen}${messagemonth}${hyphen}${messageyear}`;

  let time = managetime(messagehour, messagemin);

  let timetime = `${space}${messagehour}${colon}${messagemin}`;

  let newDate = new Date();
  let date = newDate.getDate();
  let month = newDate.getMonth() + 1;
  let year = newDate.getFullYear();

  let datetime2 = `${date}${hyphen}${
    month < 10 ? `0${month}` : `${month}`
  }${hyphen}${year}`;

  if (datetime === datetime2) {
    return `today${time}`;
  } else {
    return `${datetime}${timetime}`;
  }
};

const ScrollableChat = ({ messages, setFetchAgain, fetchAgain }) => {
  const { user} = ChatState();

 
  const downloadFile = (message) => {
    console.log(message.File);
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
    <ScrollableFeed className="wholescrollable">
      {messages &&
        messages.map((m, i) => (
          <div style={{ display: "flex" }} key={m._id}>
            <span
              className="messagesspan"
              style={{
                borderRadius: "10px",
                background: `${
                  m.sender._id === user._id
                    ? "linear-gradient(225deg, #e6e6e6, #ffffff)"
                    : "linear-gradient(145deg, #6793da, #7aaeff)"
                }`,
                color: `${m.sender._id === user._id ? "#000000" : "#ffffff"}`,
                borderBottomLeftRadius: `${
                  m.sender._id === user._id ? "10px" : "0px"
                }`,
                borderBottomRightRadius: `${
                  m.sender._id === user._id ? "0px" : "10px"
                }`,
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i, user._id) ? 8 : 20,
                padding: "2px 5px 2px 5px",
                maxWidth: "80%",
                fontSize: "18px",
                boxShadow: " 5px 5px 10px #090a15,-5px -5px 10px #252653",
              }}
            >
              {m.sender._id === user._id ? (
                <Box overflow="hidden" display="flex" flexDirection="column" >
                       
                    <Box float="right" w="100%">
                        {m.messageType === "1" ? (
                          <Box>{getdecryption(m.content)}</Box>
                        ) : (
                          <></>
                        )}
                        {m.messageType === "2" ? (
                          <>
                            <Box display="flex" flexDirection="column">
                              <SentPicOpen message={m}>
                                <Image
                                  w="auto"
                                  h="auto"
                                  m="0px"
                                  maxW="400px"
                                  maxH="400px"
                                  borderRadius="10px"
                                  src={getdecryption(m.File)}
                                />
                              </SentPicOpen>
                              <Text w="100%">{getdecryption(m.content)}</Text>
                            </Box>
                          </>
                        ) : (
                          <></>
                        )}

                        {m.messageType === "3" ? (
                          <>
                            <Box>
                              <Text
                                m="0px"
                                maxW="350px"
                                minW="350px"
                                borderWidth="2px"
                                p="5px 10px 5px 10px"
                                borderRadius="10px"
                                color="black"
                                display="flex"
                                flexDirection="row"
                              >
                                <Box w="90%">{m.FileName.split("-").pop()}</Box>
                                <Button
                                  h="30px"
                                  minW="0px"
                                  w="10%"
                                  float="right"
                                  p={0}
                                  borderRadius="full"
                                  m="0"
                                  _focus={{
                                    shadow: "none",
                                  }}
                                  onClick={() => downloadFile(m)}
                                >
                                  <IoMdDownload />
                                </Button>
                              </Text>
                            </Box>
                            <Text w="100%">{getdecryption(m.content)}</Text>
                          </>
                        ) : null}

                        {m.messageType === "4" ? (
                          <>
                            <Box display="flex" flexDirection="column">
                              <video
                              controlsList="nodownload"
                            style={{
                              maxWidth: "400px",
                              maxHeight: "400px",
                              position: "relative",
                              borderRadius: "10px",
                            }}
                            controls
                            src={getdecryption(m.File)}
                          />
                       
                              <Text w="100%">{getdecryption(m.content)}</Text>
                            </Box>
                          </>
                        ) : (
                          <></>
                        )}
                        {m.messageType === "5" ? (
                          <Box display="flex" flexDirection="column">
                            <Box>
                              <Box
                                m="0px"
                                w="400px"
                                h="auto"
                                borderWidth="2px"
                                p="5px 10px 5px 10px"
                                borderRadius="10px"
                                color="black"
                                display="flex"
                                flexDirection="column"
                              >
                                <audio 
                                style={{
                                  width:"100%",
                                  height: "50px",
                                }}
                                controls
                                src={getdecryption(m.File)}
                                />
                                <Box display="flex" flexDirection="row" p="5px">

                                <Box w="100%">{m.FileName.split("-").pop()}</Box>

                                <Button
                                  h="30px"
                                  minW="0px"
                                  w="10%"
                                  float="right"
                                  p={0}
                                  borderRadius="full"
                                  m="0"
                                  _focus={{
                                    shadow: "none",
                                  }}
                                  onClick={() => downloadFile(m)}
                                  >
                                  <IoMdDownload />
                                </Button>
                                  </Box>
                              </Box>
                            </Box>
                            <Text w="100%">{getdecryption(m.content)}</Text>
                          </Box>
                        ) : null}
                        {m.messageType === "6" ? (
                          <Text w="100%">{getdecryption(m.content)}</Text>
                        ) : (
                          <></>
                        )}


                        <Box display="flex" flexDirection="row">
                    <DeleteMessage message={m} fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} >
                    <Box
                      as={Button}
                      position="relative"
                      h="15px"
                      w="20px"
                      p="0px"
                      minW="0px"
                      bg="transparent"
                      color="transparent"
                      float="right"
                      _hover={{
                        color: "black",
                      }}
                      _active={{
                        backgroundColor: "transperent",
                      }}
                      _focus={{
                        boxShadow: "none",
                      }}
                      >
                      <BiDotsVerticalRounded
                        fontSize="20px"
                        margin="auto"
                        style={{
                          float: "left",
                        }}
                        />
                        </Box>
                        </DeleteMessage>


                        <Text
                          position="relative"
                          color="#a2a1a1"
                          fontSize="9.5px"
                          h="10px"
                          w="100%"
                        >
                          {manageDateTime(m.createdAt)}
                        </Text>
                        </Box>
                      </Box>
                    </Box>
              ) : (

                <Box overflow="hidden" display="flex" flexDirection="column">
                {m.chat.isGroupChat ? (<Box w="100%" fontSize="15px">{m.sender.name}</Box>) : null}
                <Box overflow="hidden" display="flex" flexDirection="row">
                    {m.messageType === "1" ? (
                      <Box w="auto" h="auto">
                      <Box>{getdecryption(m.content)}</Box>
                      </Box>
                    ) : (
                      <></>
                    )}
                    {m.messageType === "2" ? (
                      <Box display="flex" flexDirection="column">
                        <SentPicOpen message={m}>
                          <Image
                            h="auto"
                            w="auto"
                            position="relative"
                            maxW="400px"
                            maxH="400px"
                            borderRadius="10px"
                            src={getdecryption(m.File)}
                          />
                        </SentPicOpen>
                        <Box w="100%" pr="20px">
                          <Text position="relative" float="right">
                            {getdecryption(m.content)}
                          </Text>
                        </Box>
                      </Box>
                    ) : (
                      <></>
                    )}
                    {m.messageType === "3" ? (
                      <Box display="flex" flexDirection="column">
                        <Box>
                          <Box
                            maxW="350px"
                            minW="350px"
                            borderWidth="2px"
                            borderRadius="10px"
                            color="black"
                            display="flex"
                            flexDirection="row"
                            w="100%"
                          >
                            <Box w="85%" p="3px" m="auto">{m.FileName.split("-").pop()}</Box>
                            <Box w="15%" float="right">
                              <Button
                                borderRadius="full"
                                w="15px"
                                h="38px"
                                p="0"
                                m="3px"
                                mr="5px"
                                onClick={() => downloadFile(m)}
                              >
                                <IoMdDownload />
                              </Button>
                            </Box>
                          </Box>
                        </Box>
                        <Text w="90%">{getdecryption(m.content)}</Text>
                      </Box>
                    ) : (
                      <></>
                    )}
                    {m.messageType === "4" ? (
                      <Box display="flex" flexDirection="column" >
                          <video
                            style={{
                              maxWidth: "400px",
                              maxHeight: "400px",
                              position: "relative",
                              borderRadius: "10px",
                            }}
                            controls
                            src={getdecryption(m.File)}
                          />
                        <Box w="100%">
                          <Text position="relative" float="right">
                            {getdecryption(m.content)}
                          </Text>
                        </Box>
                      </Box>
                    ) : (
                      <></>
                    )}
                       {m.messageType === "5" ? (
                          <Box display="flex" flexDirection="column">
                            <Box>
                              <Box
                                m="0px"
                                w="400px"
                                h="auto"
                                borderWidth="2px"
                                p="5px 10px 5px 10px"
                                borderRadius="10px"
                                color="black"
                                display="flex"
                                flexDirection="column"
                              >
                                <audio 
                                style={{
                                  width:"100%",
                                  height: "50px",
                                }}
                                controls
                                src={getdecryption(m.File)}
                                />
                                <Box display="flex" flexDirection="row" p="5px">

                                <Box w="100%">{m.FileName.split("-").pop()}</Box>
                                <Button
                                  h="30px"
                                  minW="0px"
                                  w="10%"
                                  float="right"
                                  p={0}
                                  borderRadius="full"
                                  m="0"
                                  _focus={{
                                    shadow: "none",
                                  }}
                                  onClick={() => downloadFile(m)}
                                  >
                                  <IoMdDownload />
                                </Button>
                                  </Box>
                              </Box>
                            </Box>
                            <Text w="100%">{getdecryption(m.content)}</Text>
                          </Box>
                        ) : null}
                        {m.messageType === "6" ? (
                      <Box w="auto" h="auto">
                      <Box>{getdecryption(m.content)}</Box>
                      </Box>
                    ) : (
                      <></>
                    )}

                  </Box>
                  <Box h='20px' display="flex" flexDirection="row">
                  <Box
                    color="#4d66a7"
                    fontSize="9.5px"
                    float="right"
                    w="95%"
                    h="5px"
                    >
                    <Text float="right">{manageDateTime(m.createdAt)}</Text>
                  </Box>
                  <DeleteMessage message={m}>
                    <Box
                      as={Button}
                      position="relative"
                      h="15px"
                      w="20px"
                      minW="0px"
                      top="-4px"
                      bg="transperent"
                      opacity="0"
                      padding="0px"
                      margin="0px"
                      zIndex={1}
                      alignContent="space-around" 
                      _hover={{
                        color: "white",
                        opacity: "1",
                      }}
                      _active={{
                        opacity: "1",
                      }}
                      _focus={{
                        boxShadow: "none",
                      }}
                      >
                      <BiDotsVerticalRounded
                        fontSize="20px"
                        margin="auto"
                        style={{
                          float: "right",
                        }}
                        />
                    </Box>
                    </DeleteMessage>
                    </Box>
                </Box>
              )}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
