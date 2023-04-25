const asyncHandler = require('express-async-handler');
const res = require('express/lib/response');
const User = require('../models/userModel');
const generateToken = require('../generateToken');
const bcrypt = require("bcrypt")
const formidable = require('formidable')
const { JsonWebTokenError } = require('jsonwebtoken');
const { dirname, join } = require('path');
const fs = require('fs');
const mv = require('mv');






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




const registerUser = asyncHandler(async (req, res) => {
  try {

      var form = new formidable.IncomingForm();
      const uploadFolder = join(__dirname,'../','../', 'backend/uploads/profileImages')
      form.maxFileSize = 50 * 1024 * 1024
      form.UploadDir = uploadFolder
    form.parse(req, async(err, fields, files) => {

      const file = files.file
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

      
      const name = fields.name;
      console.log(name);
      const email = fields.email;
      console.log(email);
      const password = fields.password;
      console.log(password)     
      
       if (!name || !email || !password ) { 
         res.status(400).send("enter all the fields")
        }

        const pic = ('http://localhost:5000/'+fileName)
        console.log(pic)
        const picName = fileName;
        console.log(picName)
        
        const userExists = await User.findOne({ email });
        
        if (userExists) {
          res.status(400);
          throw new Error('User already exists')
        }
        
        const user = await User.create({
          name,
          email,
          password,
          pic,
          picName
        });
        
        if (user) {
          res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            picName: user.picName,
            token: generateToken(user._id)
          })
        } else{
          res.status(400);
          throw new Error('Failed to create user');
        }
    })
      } catch (error) {
        res.status(400)
        console.log(error)
      }
  })



const authUser = asyncHandler(async (req, res) => {
  const form = new formidable.IncomingForm();
  form.parse(req, async(err, fields, files) => {
    
      const email = fields.email;
      console.log(email)
      const password = fields.password;
      console.log(password)

    if (!email || !password) {
        res.status(404);
        throw new Error("error occured"); 
     }

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.status(200).send({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            picName: user.picName,
            token: generateToken(user._id)
        })
    } else{
      res.status(200).send({message: "unauthorized"})
      console.log('unauthorized')
    }
 })
})


const allUsers = asyncHandler(async (req, res) => {
    const keyword = req.query.search ? {
      $or :[
          { name: { $regex: req.query.search, $options : "i" } },
          { email: { $regex: req.query.search, $options : "i" } },
      ]
    }
    :{};

    const users = await (await User.find(keyword));
    res.send(users)
});




const renameUser = asyncHandler(async (req, res) => {
  const form = new formidable.IncomingForm();
  form.parse(req, async(err, fields, files) => {

    const _id = fields._id;
    const name = fields.name;
    const email = fields.email;

    if (!_id || !name || !email ) {
        res.status(404);
        throw new Error("error occured"); 
      }

  
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      {
        name: name,
        email: email,
      },
      {
        new: true, 
      }
    )
    if (!updatedUser) {
      res.status(404);
      throw new Error("User Not Found");
    } else {
        res.status(200).json({
          _id: updatedUser._id,
          AU_ID: updatedUser.AU_ID,
          name: updatedUser.name,
          email: updatedUser.email,
          pic: updatedUser.pic,
          picName: updatedUser.picName,
          token: generateToken(updatedUser._id)
         })
    }
  })
  });
  

  const picUpdate = asyncHandler(async (req, res) => {



    var form = new formidable.IncomingForm();
    const uploadFolder = join(__dirname,'../','../', 'backend/uploads/profileImages')
    form.maxFileSize = 50 * 1024 * 1024
    form.UploadDir = uploadFolder
  form.parse(req, async(err, fields, files) => {
    
        const _id = fields._id;
        const delpiccloud = await User.findOne({ _id })

        const path = join(uploadFolder , delpiccloud.picName )

        try {
          fs.unlinkSync(path)
          //file removed
        } catch(err) {
          console.error(err)
        }

        const file = files.file
        console.log(file)
        const isValid = await checkFileType(file)
        if(!isValid){
          return res.status(500).send("invalid file type");
        }
        
        const fileName = (`${Date.now()}-${file.originalFilename}`)
        console.log(fileName)
        await fs.rename(file.filepath, join(uploadFolder, fileName), function (err){
          if (err) {
            console.log('> FileServer.jsx | route: "/files/upload" | err:', err);
            throw err;
        }
        });

        const pic = ('http://localhost:5000/'+fileName)
        console.log(pic)
        const picName = fileName;
        console.log(picName)



      if (!_id || !pic || !picName ) {
        res.status(404);
        throw new Error("error occured"); 
      }

      
   
      const updatedPic = await User.findByIdAndUpdate(
          _id,
          {
              pic: pic,
              picName: picName
          },
          {
              new: true,
          }
      )
      if(!updatedPic) {
        res.status(404);
        throw new Error("User Not Found");
      } else {
        res.status(200).json({
            _id: updatedPic._id,
            name: updatedPic.name,
            email: updatedPic.email,
            pic: updatedPic.pic,
            picName: updatedPic.picName,
            token: generateToken(updatedPic._id)
           })
      }
  })
})


  const resetpassword = asyncHandler(async (req, res) => {
    const form = new formidable.IncomingForm();
    form.parse(req, async(err, fields, files) => {
      const _id = fields._id;
      const password = fields.password;
      const newpassword = fields.newpassword;


      if (!_id || !password || !newpassword ) {
        res.status(404);
        throw new Error("error occured"); 
      }

      try {
        const user =  await User.findOne({ _id });
        const data = await user.matchPassword(password)
      if (data === true) {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(newpassword, salt)
        console.log(typeof(newpassword))
        const updatepass = await User.findByIdAndUpdate(
          _id,
          {
            password: hash
          },
          {
              new: true,
          }
        )
        res.status(200)
        res.send(updatepass)
      } else {
        res.status(401);
        throw new Error("enter the correct password");
      }
    } catch (error) {
      res.status(400)
      throw new Error(error)
    }
  })
    })
module.exports={ registerUser, authUser, allUsers, renameUser, picUpdate, resetpassword};