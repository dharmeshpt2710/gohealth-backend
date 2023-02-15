const mongoose = require('mongoose');
const schema = mongoose.Schema;

const userScheme = new schema({
    name: String,
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: false
    },
    number: {
        type: String,
        required: false
    },
    userType: {
        type: String,
        required: false
    }
})
const User = mongoose.model("User", userScheme)
module.exports = User