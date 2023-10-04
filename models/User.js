const mongoose = require('mongoose');
const {Schema} = mongoose;
const UserSchema = new Schema({
    firstName : {
        type : String,
        required : true
    },
    lastName : {
        type : String,
        required : true
    },
    userName : {
        type : String,
        required : true,
        unique : true
    },
    email : {
        type : String,
        required : true,
    },
    password : {
        type : String,
        required : true,
    },
    gender : {
        type : String,
        required : true
    },
    date : {
        type : Date,
        default : Date.now // it will call when user will not enter date(default).
    },
    dob : {
        type : Date,
        required : true
    },
    age : {
        type : Number,
    },
    image: {
        type : String
    },
});
module.exports = mongoose.model('user', UserSchema) // (ModelNAme, nameofschema)