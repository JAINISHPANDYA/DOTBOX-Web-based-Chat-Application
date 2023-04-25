//importing all the packages and files
const express = require('express');
const dotenv = require('dotenv')
const cors = require('cors')
const connectToMongo = require('./db');
const userRoutes = require("./Routes/userRoutes");
const chatRoutes = require("./Routes/chatRoutes");
const messageRoutes = require("./Routes/messageRoutes")
const { notFound } = require("./middleware/errorMiddleware")
const { errorHandler } = require("./middleware/errorMiddleware");
const  mongoose  = require('mongoose');
const path = require('path');
connectToMongo();

mongoose.connection.on('connected', () => console.log('Connected' + port));

const app = express()
dotenv.config();


app.use(cors());
app.use(express.json())
app.use(express.static('backend/uploads/sentImages'))
app.use(express.static('backend/uploads/sentfiles')) 
app.use(express.static('backend/uploads/sentVideos')) 
app.use(express.static('backend/uploads/sentAudios')) 
app.use(express.static('backend/uploads/profileImages'))
app.use(express.static('backend/uploads/groupProfileImages'))
// User model



app.use('/api/user', userRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/messages', messageRoutes)

// ---------------  Deployement ------------------------------------

const __dirname1 = path.resolve()
console.log('hello')
if(process.env.NODE_ENV === 'production'){
         console.log('hello2')
        app.use(express.static(path.join(__dirname1,'/frontend/build')))

        app.get("*", (req, res) => {
            res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"));
        });
     }else {
         app.get("/", (req, res) => {
             console.log('running')
             res.send("api is running successfully")
         })
     }

// ---------------  Deployement ------------------------------------

app.use(notFound)
app.use(errorHandler)


const port = process.env.PORT || 5000;


const server = app.listen(port, () =>{
    console.log(`http://localhost:${port}`)
})

const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:3000"
    },
});
io.on("connection", (socket) => {
    console.log("Connected to socket.io");
    socket.on("setup", (userData) => {
      socket.join(userData._id);
      socket.emit("connected");
    });
  
    socket.on("join chat", (room) => {
      socket.join(room);
      console.log("User Joined Room: " + room);
    });

    socket.on("typing", (room) => socket.in(room).emit("typing"));
    
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

    socket.on('new message', (newMessageRecieved) => {
        var chat = newMessageRecieved.chat;

        if(!chat.users) return console.log("chats.users is not defined");

        chat.users.forEach(user => {
            if(user._id == newMessageRecieved.sender._id) {
                return;
            }
            else {
                socket.in(user._id).emit("message recieved",newMessageRecieved)
            }            
        });
    });

    socket.on('useradded', (useradded) => {
        var group = useradded.data;
        var sender = useradded.sender

        if(!group.users) return console.log("chats.users is not defined");

        group.users.forEach(user => {
            console.log(user._id);
            if (user._id === sender._id) {
                return;
            } else {
                console.log(user.name)
                console.log(useradded)
                socket.in(user._id).emit("userupdate",useradded)
            }
        });
    });

    socket.on('userremove', (userremove) => {
        console.log(userremove.data._id)
        var group = userremove.data;
        var sender = userremove.sender;

        var deletedUser = userremove.deletedUser;

        if(!group.users) return console.log("chats.users is not defined");

        socket.in(deletedUser._id).emit("deleteduser",{data: userremove})
        group.users.forEach(user => {
            if(user._id === sender._id){
                return;
            } else {
                console.log(user._id)
                console.log(deletedUser._id)
                socket.in(user._id).emit("userremoved",{data: userremove, isdeletedUser: false})
            }
        });
    });

    socket.on('chatdelete', (useradded) => {
        var group = useradded.data.data;
        var sender = useradded.sender
        console.log(group)

        if(!group.users) return console.log("chats.users is not defined");

        group.users.forEach(user => {
            console.log(user._id);
            if (user._id === sender._id) {
                return;
            } else {
                console.log(user.name)
                console.log(useradded)
                socket.in(user._id).emit("deletedchat",useradded)
            }
        });
    });


    socket.on('chatcreate', (usercreated) => {
        var group = usercreated.data;
        var sender = usercreated.sender
        console.log(group)

        if(!group.users) return console.log("chats.users is not defined");

        group.users.forEach(user => {
            console.log(user._id);
            if (user._id === sender._id) {
                return;
            } else {
                console.log(user.name)
                console.log(usercreated)
                socket.in(user._id).emit("createdchat",usercreated)
            }
        });
    });


    
    socket.on('addedadmin', (adminadded) => {

        var group = adminadded.data;
        var sender = adminadded.sender

        if(!group.users) return console.log("chats.users is not defined");

        group.users.forEach(user => {
            console.log(user._id);
            if (user._id === sender._id) {
                return;
            } else {
                console.log(user.name)
                console.log(adminadded)
                socket.in(user._id).emit("adminadded",adminadded)
            }
        });
    });

    socket.on('removedadmin', (adminremoved) => {

        var group = adminremoved.data;
        var sender = adminremoved.sender

        if(!group.users) return console.log("chats.users is not defined");

        group.users.forEach(user => {
            console.log(user._id);
            if (user._id === sender._id) {
                return;
            } else {
                console.log(user.name)
                console.log(adminremoved)
                socket.in(user._id).emit("adminremoved",adminremoved)
            }
        });
    });
    
})
