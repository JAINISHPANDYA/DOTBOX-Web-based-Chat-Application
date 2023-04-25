var mongoose = require('mongoose');
mongoose.set('debug', true);
const { Schema } = mongoose


var chatModel = new Schema({ 
    chatName:{
        type: String,
        trim: true,
        ref: 'User'
    },
    isGroupChat: {
        type: Boolean,
        default: false
    },
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    latestMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
    },
    groupAdmin: {
        type: Array,
        ref: "User"
    },
    grouppic: {
        type: String,
    },
    picname: {
        type: String,
    }
 },
 {
     timestamps:true,
 }
 );


const Chat = mongoose.model('Chat', chatModel);
module.exports = Chat // this is what you want