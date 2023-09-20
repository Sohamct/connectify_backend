const mongoose = require('mongoose');
const {Schema} = mongoose;
const PostLikeSchema = new Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId, //it is like foreign key
        ref : 'user' //name of models
    },
    post : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'post'
    },
    status : {
        type : Boolean,
    },
});
module.exports = mongoose.model('LikePost', PostLikeSchema) // (ModelNAme, nameofschema)