var mongoose = require('mongoose');
mongoose.set('debug', true);
const bcrypt = require('bcrypt');


mongoose.set('debug', true);
const { Schema } = mongoose


var userSchema = new Schema({ 
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    pic: {
        type: String,
        required: true,
        default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
    picName: {
        type: String,
        required: true
    },
 },
 { timestamps:true }
 );



 userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
 };

userSchema.pre("save", async function (next) {
    if(!this.isModified){
        next();
    }


    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt)
})
const User = mongoose.model('User', userSchema);
module.exports = User; // this is what you want