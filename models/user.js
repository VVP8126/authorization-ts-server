const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const model = mongoose.model;

const userSchema = new Schema({
    email: {type:String, unique:true, required:true},
    password: {type:String, required:true},
    isActivated: {type:Boolean, default:false},
    activationLink: {type:String},
});
module.exports = model("User", userSchema);
