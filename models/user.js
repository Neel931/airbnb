const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const passportLocalMongoose=require('passport-local-mongoose');

const userSchema=new Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },

})

// add username ,hasing and salting password automatically
User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);