import CryptoJS from "crypto-js";
import { Box, Avatar } from "@chakra-ui/react";

export const isSameSenderMargin = (messages, m, i, userId) => {
  // console.log(i === messages.length - 1);

  if (
    i < messages.length - 1 &&
    messages[i + 1].sender._id === m.sender._id &&
    messages[i].sender._id !== userId
  )
    return 0;
  else if (
    (i < messages.length - 1 &&
      messages[i + 1].sender._id !== m.sender._id &&
      messages[i].sender._id !== userId) ||
    (i === messages.length - 1 && messages[i].sender._id !== userId)
  )
    return 0;
  else return "auto";
};

export const isSameSender = (messages, m, i, userId) => {
  return (
    i < messages.length - 1 &&
    (messages[i + 1].sender._id !== m.sender._id ||
      messages[i + 1].sender._id === undefined) &&
    messages[i].sender._id !== userId
  );
};

export const isSenderLastMessage = (messages, m, i, userId) => {
  return (
    i < messages.length - 1 &&
    (messages[i + 1].sender._id !== m.sender._id ||
      messages[i + 1].sender._id === undefined)
  );
};

export const isLastMessage = (messages, i, userId) => {
  return (
    i === messages.length - 1 &&
    messages[messages.length - 1].sender._id !== userId &&
    messages[messages.length - 1].sender._id
  );
};

export const isSameUser = (messages, m, i) => {
  return i > 0 && messages[i - 1].sender._id === m.sender._id;
};

export const getSender = (loggedUser, users) => {
  if(users[1] === undefined){
    return users[0].name;
  }
  else {
  return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
  }
};

export const getSenderFull = (loggedUser, users) => {
  return users[0]._id === loggedUser._id ? users[1] : users[0];
};


export const getSenderPic = (loggedUser,users) => {
  if(users[1] === undefined){
    return users[0].pic
  }
  else {
  return users[0].pic === loggedUser.pic ? users[1].pic : users[0].pic;
  }
}


export const getgroupfirstpic = (u) => {
  return u[0].pic;
}
// export const getmessageid = (messages) => {
//   messages = JSON.stringify(messages.map((message) => message._id))
//   messages = messages.slice(2,26)
//   return messages;
// }








// -------------------------------------ENCRYPTION---DECTRYPTION-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------



export const getencryption = (message) => {
  return btoa(btoa(btoa(encodeURIComponent(message))));
}
 
export const getdecryption = (hash) => {
  return decodeURIComponent(atob(atob(atob(hash))));
}


// ----------------------------------------------------------------------------------------------------------------------------------------------------------