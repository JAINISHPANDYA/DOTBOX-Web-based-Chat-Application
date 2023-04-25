const mongoose = require('mongoose');
const mongoURI = 'mongodb+srv://mint:jainish@cluster0.g4qrc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'

const connectToMongo = ()=>{
    // Database Connection
    mongoose.connect(mongoURI,{
    useNewUrlParser: true,
    useUnifiedTopology: true
});
}
module.exports = connectToMongo;