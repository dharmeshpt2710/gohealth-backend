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
})
const User = mongoose.model("User", userScheme)
module.exports = User