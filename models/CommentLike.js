const mongoose = require('mongoose');
const {Schema} = mongoose;
const PostSchema = new Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId, //it is like foreign key
        ref : 'user' //name of models
    },
    post : {
        type : mongoose.Schema.Types.ObjectId, //it is like foreign key
        ref : 'post' //name of models
    },
    date : {
        type : Date,
        default : Date.now // it will call when user will not enter date(default).
    },
});
module.exports = mongoose.model('commentLike',PostSchema) // (ModelNAme, nameofschema)