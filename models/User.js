const mongoose = require('mongoose');
const {Schema} = mongoose;
const UserSchema = new Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
    },
    password : {
        type : String,
        default : "General"
    },
    date : {
        type : Date,
        default : Date.now // it will call when user will not enter date(default).
    },
});
module.exports = mongoose.model('user', UserSchema) // (ModelNAme, nameofschema)