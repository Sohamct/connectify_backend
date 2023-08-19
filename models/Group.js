const mongoose = require('mongoose');
const {Schema} = mongoose;
const GroupSchema = new Schema({
    users : [{
       type :  mongoose.Schema.Types.ObjectId,
        ref : 'user'
    }],
    description : {
        type : String,
        required : true
    },
    users : [{
        type : String,
        required : true
    }],
    admin : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'user'
    }],
    messages : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'message'
    }],
    
    date : {
        type : Date,
        default : Date.now // it will call when user will not enter date(default).
    },
});
module.exports = mongoose.model('group', GroupSchema) // (ModelNAme, nameofschema)