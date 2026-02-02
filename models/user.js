const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// 👇 IMPORTANT CHANGE
const passportLocalMongoose = require("passport-local-mongoose").default;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  }
});

// plugin MUST receive a function
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
