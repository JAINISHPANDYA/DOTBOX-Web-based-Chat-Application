const { text } = require('express');
var mongoose = require('mongoose');
mongoose.set('debug', true);
const { Schema } = mongoose


var messageModel = new Schema({ 
    sender:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    content: {
        type: String,
        trim: true
    },
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat"
    },
    messageType: {
        type: String,
        default: "1",
    },
    File: {
        type: String
    },
    FileName: {
        type: String,
    },
 },
 {
     timestamps:true,
 }
 );


const Message = mongoose.model('Message', messageModel);
module.exports = Message; // this is what you want