const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");
const formidable = require('formidable')
const { ObjectId } = require('mongodb');
const fs = require('fs');
const mv = require('mv');
const { dirname, join } = require('path');


function checkFileType(file) {
  console.log(file.mimetype)
  const type = file.mimetype
  const ValidTypes = ['image/png', 'image/jpeg', 'image/jpg']
  if(ValidTypes.indexOf(type) == -1) {
    console.log('the file type is invalid');
    return false;
  }
  return true;
}


//@description     Create or fetch One to One Chat
//@route           POST /api/chat/
//@access          Protected
const accessChat = asyncHandler(async (req, res) => {
  const form = new formidable.IncomingForm();
  form.parse(req, async(err, fields, files) => {

    const userId = fields.userId;

  if (!userId) {
    console.log("UserId param not sent with request");
    return res.sendStatus(400);
  }

  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    try {
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).json(FullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
})
});

//@description     Fetch all chats for a user
//@route           GET /api/chat/
//@access          Protected
const fetchChats = asyncHandler(async (req, res) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "name pic email",
        });
        res.status(200).send(results);
      });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

//@description     Create New Group Chat
//@route           POST /api/chat/group
//@access          Protected
const createGroupChat = asyncHandler(async (req, res) => {

  var form = new formidable.IncomingForm();
      const uploadFolder = join(__dirname,'../','../', 'backend/uploads/groupProfileImages')
      form.maxFileSize = 50 * 1024 * 1024
      form.UploadDir = uploadFolder
    form.parse(req, async(err, fields, files) => {
 
      const file = files.grouppic
      console.log(file)
      const isValid = await checkFileType(file)
      if(!isValid){
        return res.status(500).send("invalid file type");
      }
      
      const fileName = (`${Date.now()}-${file.originalFilename}`)
      console.log(fileName)
     await mv(file.filepath, join(uploadFolder, fileName), function (err){
        if (err) {
          console.log('> FileServer.jsx | route: "/files/upload" | err:', err);
          throw err;
      }
      });
      
      const pic = ('http://localhost:5000/'+fileName)
      console.log(pic)
      const picName = fileName;
      console.log(picName)


  var users = JSON.parse(fields.users); 

  if (users.length < 2) {
    return res
      .status(400)
      .send("More than 2 users are required to form a group chat");
  }

  const name = fields.name;
  users.push(req.user);

  try {
    const groupChat = await Chat.create({
      chatName: name,
      users: users,
      isGroupChat: true,
      groupAdmin: ObjectId(req.user),
      grouppic: pic,
      picname: picName,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password");


    res.status(200).json(fullGroupChat);

  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
})
});

// @desc    Rename Group
// @route   PUT /api/chat/rename
// @access  Protected
const renameGroup = asyncHandler(async (req, res) => {
  const form = new formidable.IncomingForm();
  form.parse(req, async(err, fields, files) => {

    const chatId = fields.chatId;
    const chatName = fields.chatName;

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName: chatName,
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")

  if (!updatedChat) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(updatedChat);
  }
})
});

// @desc    Remove user from Group
// @route   PUT /api/chat/groupremove
// @access  Protected
const removeFromGroup = asyncHandler(async (req, res) => {
  const form = new formidable.IncomingForm();
  form.parse(req, async(err, fields, files) => {

    const chatId = fields.chatId;
    const userId = fields.userId;

  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")

  if (!removed) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(removed);
  }
})
});


const removeFromAdmin = asyncHandler(async (req, res) => {
  const form = new formidable.IncomingForm();
  form.parse(req, async(err, fields, files) => {

    const chatId = fields.chatId;
    console.log(chatId);
    const userId = ObjectId(fields.userId);
    console.log(userId);

  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { groupAdmin: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")

  if (!removed) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(removed);
  }
})
});

// @desc    Add user to Group / Leave
// @route   PUT /api/chat/groupadd
// @access  Protected
const addToGroup = asyncHandler(async (req, res) => {
  const form = new formidable.IncomingForm();
  form.parse(req, async(err, fields, files) => {

    const chatId = fields.chatId;
    const userId = fields.userId;

  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")

  if (!added) {
    res.status(404); 
    throw new Error("Chat Not Found");
  } else {
    res.json(added);
  }
})
});

const addToAdmin = asyncHandler(async (req, res) => {
  const form = new formidable.IncomingForm();
  form.parse(req, async(err, fields, files) => {

    const chatId = fields.chatId;
    console.log(chatId);
    const userId = ObjectId(fields.userId);
    console.log(userId);

  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { groupAdmin: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")

  if (!added) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(added);
  }
})
});


const updategrouppic = asyncHandler ( async(req, res) => {
  var form = new formidable.IncomingForm();
  const uploadFolder = join(__dirname,'../','../', 'backend/uploads/groupProfileImages')
      form.maxFileSize = 50 * 1024 * 1024
      form.UploadDir = uploadFolder
    form.parse(req, async(err, fields, files) => {

      const chatId = fields.chatId;
      console.log(chatId)
      const group = await Chat.findById( chatId )
      console.log(group)

      const path = join(uploadFolder , group.picname)

        try {
          fs.unlinkSync(path)
          //file removed
        } catch(err) {
          console.error(err)
        }
      
      
      const file = files.pic
      console.log(file)
      const isValid = await checkFileType(file)
      if(!isValid){
        return res.status(500).send("invalid file type");
      }
      
      const fileName = (`${Date.now()}-${file.originalFilename}`)
      console.log(fileName)
     await mv(file.filepath, join(uploadFolder, fileName), function (err){
        if (err) {
          console.log('> FileServer.jsx | route: "/files/upload" | err:', err);
          throw err;
      }
      });
      
      const grouppic = ('http://localhost:5000/'+fileName)
      console.log(grouppic)
      const picname = fileName;
      console.log(picname)



  if( !chatId || !grouppic || !picname ){
    res.status(404);
    throw new Error("error occured");
  }


  const updatedGroupPic = await Chat.findByIdAndUpdate(
    chatId,
    {
      grouppic: grouppic,
      picname: picname,
    },
    {
      new: true,
    }
  )
  if(!updatedGroupPic) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.status(200).json({
      updatedGroupPic
     })
  }

    })
})




const deleteGroup = asyncHandler(async (req, res) => {
  const form = new formidable.IncomingForm();
  const uploadFolder = join(__dirname,'../','../', 'backend/uploads/groupProfileImages')
  form.maxFileSize = 50 * 1024 * 1024
  form.UploadDir = uploadFolder
  form.parse(req, async(err, fields, files) => {



    try {
      const chatId = fields.chatId;
      console.log(chatId);
      const group = await Chat.findById( chatId )
      console.log(group) 

      const path = join(uploadFolder , group.picname) 

        try {
          fs.unlinkSync(path)
          //file removed
        } catch(err) {
          console.error(err)
        }
      
      const deleted = await Chat.findByIdAndDelete(chatId).populate("users", "-password")
      
      res.status(200).json(deleted);

    } catch (error) {
      res.status(400).send("can't delete this Chat")
    }

      
    
})
});


module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
  addToAdmin,
  removeFromAdmin,
  updategrouppic,
  deleteGroup
};