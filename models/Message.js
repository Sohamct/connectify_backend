const mongoose = require('mongoose');
const {Schema} = mongoose;
const MessageSchema = new Schema({
    messager : {
        type : mongoose.Schema.Types.ObjectId, //it is like foreign key
        ref : 'user' //name of models
    },
    receiver : {
        type : mongoose.Schema.Types.ObjectId, //it is like foreign key
        ref : 'user' //name of models
    },
    description : {
        type : String,
        required : true,
    },
    date : {
        type : Date,
        default : Date.now // it will call when user will not enter date(default).
    },
});
module.exports = mongoose.model('message', MessageSchema) // (ModelNAme, nameofschema)