const mongoose = require('mongoose');
const {Schema} = mongoose;
const PostSchema = new Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId, //it is like foreign key
        ref : 'user' //name of models
    },
    title : {
        type : String,
        required : true
    },
    description : {
        type : String,
    },
    image: {
      data: Buffer, // Binary data for the image/video
      contentType: String, // MIME type of the image/video
      fileName: String, // Original file name
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
module.exports = mongoose.model('post',PostSchema) // (ModelNAme, nameofschema)