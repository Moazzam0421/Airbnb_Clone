const { required } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passLocalMongoose = require("passport-local-mongoose");

const userSchema = new  Schema({
    email: {
        type: String,
        required: true,
    },
});

userSchema.plugin(passLocalMongoose);

module.exports = mongoose.model('User', userSchema);