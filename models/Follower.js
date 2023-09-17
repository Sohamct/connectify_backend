const mongoose = require('mongoose');
const {Schema} = mongoose;
const UserSchema = new Schema({
    follower : {
        type : mongoose.Schema.Types.ObjectId, //it is like foreign key
        ref : 'user' //name of models
    },
    following : {
        type : mongoose.Schema.Types.ObjectId, //it is like foreign key
        ref : 'user' //name of models
    },
    status: {
        type: Boolean,
        default: false
    }
});
module.exports = mongoose.model('follower', UserSchema) // (ModelNAme, nameofschema)