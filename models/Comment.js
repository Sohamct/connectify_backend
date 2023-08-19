const mongoose = require('mongoose');
const {Schema} = mongoose;
const CommentSchema = new Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId, //it is like foreign key
        ref : 'user' //name of models
    },
    post : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'post' 
    },
    description : {
        type : String,
        required : true,
    },
    date : {
        type : Date,
        default : Date.now // it will call when user will not enter date(default).
    },
    likes : {
        type : Number,
        default : 0,
    },
    dislikes : {
        type : Number,
        default : 0,
    },
});
module.exports = mongoose.model('comment', CommentSchema) // (ModelNAme, nameofschema)