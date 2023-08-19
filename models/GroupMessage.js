const mongoose = require('mongoose');
const {Schema} = mongoose;
const GroupMessageSchema = new Schema({
    messager : {
        type : mongoose.Schema.Types.ObjectId, //it is like foreign key
        ref : 'user' //name of models
    },
    groupId : {
        type : mongoose.Schema.Types.ObjectId, //it is like foreign key
        ref : 'group' //name of models
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
module.exports = mongoose.model('groupMessage', GroupMessageSchema) // (ModelNAme, nameofschema)