const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");
const formidable = require('formidable')
const fs = require('fs');
const mv = require('mv');
const { dirname, join } = require('path');

//@description     Get all Messages
//@route           GET /api/Message/:chatId
//@access          Protected



const allMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("_id")
      .populate("sender", "name pic email")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});



//@description     Create New Message
//@route           POST /api/Message/
//@access          Protected
const sendMessage = asyncHandler(async (req, res) => {
  const form = new formidable.IncomingForm();
  form.parse(req, async(err, fields, files) => {
    const content = fields.content;
    const chatId = fields.chatId;
    const messageType = fields.messageType;

  if ( !chatId || !messageType) {
    console.log("Invalid data passed into request"); 
    return res.sendStatus(400);
  }

  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
    messageType: messageType,
  };

  try {
    var message = await Message.create(newMessage);

    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    await Chat.findByIdAndUpdate(chatId, { latestMessage: message });

    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message); 
  }
})
});



const sendFileMessage = asyncHandler(async (req, res) => {
  var form = new formidable.IncomingForm();
      const uploadFolder = join(__dirname,'../','../', 'backend/uploads/sentfiles')
      form.maxFileSize = 50 * 1024 * 1024
      form.UploadDir = uploadFolder
    form.parse(req, async(err, fields, files) => {
 
      const file = files.file
      fname = file.originalFilename
      const fileName = (`${Date.now()}-${fname.replaceAll('-', '')}`)
      console.log(fileName)
     await mv(file.filepath, join(uploadFolder, fileName), function (err){
        if (err) {
          console.log('> FileServer.jsx | route: "/files/upload" | err:', err);
          throw err;
      }
      });
      
      const File = btoa(btoa(btoa(encodeURIComponent('http://localhost:5000/'+fileName))))
      console.log(File)
      const FileName = fileName;

      const content = fields.content;
      const chatId = fields.chatId;
      const messageType = fields.messageType;

  if ( !chatId || !messageType) {
    console.log("Invalid data passed into request"); 
    return res.sendStatus(400);
  }
  
  try {
  var newMessage = {
    sender: fields.userId,
    content: content,
    chat: chatId,
    messageType: messageType,
    File: File,
    FileName: FileName,
  };

    var message = await Message.create(newMessage);

    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    await Chat.findByIdAndUpdate(chatId, { latestMessage: message });

    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message); 
  }
})
});



const sendImageMessage = asyncHandler(async (req, res) => {
  var form = new formidable.IncomingForm();
      const uploadFolder = join(__dirname,'../','../', 'backend/uploads/sentImages')
      form.maxFileSize = 50 * 1024 * 1024
      form.UploadDir = uploadFolder
    form.parse(req, async(err, fields, files) => {
 
      const file = files.file
      fname = file.originalFilename
      const fileName = (`${Date.now()}-${fname.replaceAll('-', '')}`)
      console.log(fileName)
     await mv(file.filepath, join(uploadFolder, fileName), function (err){
        if (err) {
          console.log('> FileServer.jsx | route: "/files/upload" | err:', err);
          throw err;
      }
      });
      
      const File = btoa(btoa(btoa(encodeURIComponent('http://localhost:5000/'+fileName))))
      console.log(File)
      const FileName = fileName;

      const content = fields.content;
      const chatId = fields.chatId;
      const messageType = fields.messageType;

  if ( !chatId || !messageType) {
    console.log("Invalid data passed into request"); 
    return res.sendStatus(400);
  }
  
  try {
  var newMessage = {
    sender: fields.userId,
    content: content,
    chat: chatId,
    messageType: messageType,
    File: File,
    FileName: FileName,
  };

    var message = await Message.create(newMessage);

    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    await Chat.findByIdAndUpdate(chatId,{ latestMessage: message });

    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message); 
  }
})
});


const sendVideoMessage = asyncHandler(async (req, res) => {
  var form = new formidable.IncomingForm();
      const uploadFolder = join(__dirname,'../','../', 'backend/uploads/sentVideos')
      form.maxFileSize = 50 * 1024 * 1024
      form.UploadDir = uploadFolder
    form.parse(req, async(err, fields, files) => {
 
      const file = files.file
      fname = file.originalFilename
      const fileName = (`${Date.now()}-${fname.replaceAll('-', '')}`)
      console.log(fileName)
     await mv(file.filepath, join(uploadFolder, fileName), function (err){
        if (err) {
          console.log('> FileServer.jsx | route: "/files/upload" | err:', err);
          throw err;
      }
      });
      
      const File = btoa(btoa(btoa(encodeURIComponent('http://localhost:5000/'+fileName))))
      console.log(File)
      const FileName = fileName;

      const content = fields.content;
      const chatId = fields.chatId;
      const messageType = fields.messageType;

  if ( !chatId || !messageType) {
    console.log("Invalid data passed into request"); 
    return res.sendStatus(400);
  }
  
  try {
  var newMessage = {
    sender: fields.userId,
    content: content,
    chat: chatId,
    messageType: messageType,
    File: File,
    FileName: FileName,
  };

    var message = await Message.create(newMessage);

    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    await Chat.findByIdAndUpdate(chatId, { latestMessage: message });

    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message); 
  }
})
});


const sendAudioMessage = asyncHandler(async (req, res) => {
  var form = new formidable.IncomingForm();
      const uploadFolder = join(__dirname,'../','../', 'backend/uploads/sentAudios')
      form.maxFileSize = 50 * 1024 * 1024
      form.UploadDir = uploadFolder
    form.parse(req, async(err, fields, files) => {
 
      const file = files.file
      fname = file.originalFilename
      const fileName = (`${Date.now()}-${fname.replaceAll('-', '')}`)
      console.log(fileName)
     await mv(file.filepath, join(uploadFolder, fileName), function (err){
        if (err) {
          console.log('> FileServer.jsx | route: "/files/upload" | err:', err);
          throw err;
      }
      });
      
      const File = btoa(btoa(btoa(encodeURIComponent('http://localhost:5000/'+fileName))))
      console.log(File)
      const FileName = fileName;

      const content = fields.content;
      const chatId = fields.chatId;
      const messageType = fields.messageType;

  if ( !chatId || !messageType) {
    console.log("Invalid data passed into request"); 
    return res.sendStatus(400);
  }
  
  try {
  var newMessage = {
    sender: fields.userId,
    content: content,
    chat: chatId,
    messageType: messageType,
    File: File,
    FileName: FileName,
  };

    var message = await Message.create(newMessage);

    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    await Chat.findByIdAndUpdate(chatId, { latestMessage: message });

    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message); 
  }
})
});


const forwardMessage = asyncHandler(async (req, res) => {
  const form = new formidable.IncomingForm();
  form.parse(req, async(err, fields, files) => {

    const Content = fields.content;
    if(fields.messageType === "1"){

      console.log("-----------------------------------------")
      console.log("-----------------------------------------" + Content)
      console.log("-----------------------------------------")

      try {
        var newMessage = {
          sender: fields.sender,
          content: Content,
          chat: fields.chat,
          messageType: fields.messageType,
        };
      
          var message = await Message.create(newMessage);
      
          message = await message.populate("sender", "name pic");
          message = await message.populate("chat");
          message = await User.populate(message, {
            path: "chat.users",
            select: "name pic email",
          });
      
          await Chat.findByIdAndUpdate(fields.chat, { latestMessage: message });
      
          res.json(message);
        } catch (error) {
          res.status(400);
          throw new Error(error.message); 
        }



    } else if(fields.messageType) {
     const cont = "";

     
     console.log("********************************************")
     console.log("********************************************" + fields.File)
     console.log("***********************************************")


      try {
        var newMessage = {
          sender: fields.sender,
          content: cont,
          chat: fields.chat,
          messageType: fields.messageType,
          File: fields.File,
          FileName: fields.FileName
        };
      
          var message = await Message.create(newMessage);
      
          message = await message.populate("sender", "name pic");
          message = await message.populate("chat");
          message = await User.populate(message, {
            path: "chat.users",
            select: "name pic email",
          });
      
          await Chat.findByIdAndUpdate(fields.chat, { latestMessage: message });
      
          res.json(message);
        } catch (error) {
          res.status(400);
          throw new Error(error.message); 
        }

    }
  })
})


const deleteMessage = asyncHandler(async (req, res) => {
  const form = new formidable.IncomingForm();
  const uploadFolderAudio = join(__dirname,'../','../', 'backend/uploads/sentAudios')
  const uploadFolderfiles = join(__dirname,'../','../', 'backend/uploads/sentfiles')
  const uploadFolderImages = join(__dirname,'../','../', 'backend/uploads/sentImages')
  const uploadFolderVideos = join(__dirname,'../','../', 'backend/uploads/sentVideos')
  form.parse(req, async(err, fields, files) => {
  const deletedmessage = "WkVkb2NHTjVRblJhV0U1NldWZGtiRWxIYkhwSlIxSnNZa2RXTUZwWFVUMD0=";
  const _id = fields._id;
  
try{
  const fullmessage = await Message.findById(_id)

  if(fullmessage.messageType === "1"){
    const message = await Message.findByIdAndUpdate( _id, {content:deletedmessage, messageType: "6" } ).populate("chat")
    console.log(message)
    res.json(message);

  } else if(fullmessage.messageType === "2"){

      const message = await Message.findById( _id ) 

      const path = join(uploadFolderImages , message.FileName) 
      console.log(path)

        try {
          fs.unlinkSync(path)
          //file removed
        } catch(err) {
          console.error(err)
        }

    const message2 = await Message.findByIdAndUpdate( _id,
       {
         content:deletedmessage,
         messageType: "6",
         File: "",
         FileName: ""
        }).populate("chat")
    console.log(message2)
    res.json(message2);

  } else if(fullmessage.messageType === "3"){

    const message = await Message.findById( _id ) 

    const path = join(uploadFolderfiles , message.FileName) 

      try {
        fs.unlinkSync(path)
        //file removed
      } catch(err) {
        console.error(err)
      }

  const message2 = await Message.findByIdAndUpdate( _id,
     {
       content:deletedmessage,
       messageType: "6",
       File: "",
       FileName: ""
      }).populate("chat")
  console.log(message2)
  res.json(message2);

} else if(fullmessage.messageType === "4"){

  const message = await Message.findById( _id ) 

  const path = join(uploadFolderVideos , message.FileName) 

    try {
      fs.unlinkSync(path)
      //file removed
    } catch(err) {
      console.error(err)
    }

const message2 = await Message.findByIdAndUpdate( _id,
   {
     content:deletedmessage,
     messageType: "6",
     File: "",
     FileName: ""
    }).populate("chat")
console.log(message2)
res.json(message2);

} else if(fullmessage.messageType === "5"){

  const message = await Message.findById( _id ) 

  const path = join(uploadFolderAudio , message.FileName) 

    try {
      fs.unlinkSync(path)
      //file removed
    } catch(err) {
      console.error(err)
    }

const message2 = await Message.findByIdAndUpdate( _id,
   {
     content:deletedmessage,
     messageType: "6",
     File: "",
     FileName: ""
    }).populate("chat")
console.log(message2)
res.json(message2);

} 


} catch (error) {
  res.status(400);
  throw new Error(error.message);
}
  })
})




module.exports = { allMessages, sendMessage, sendFileMessage, sendAudioMessage, sendVideoMessage, sendImageMessage, forwardMessage, deleteMessage };