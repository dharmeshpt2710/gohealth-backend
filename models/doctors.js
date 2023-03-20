const mongoose = require('mongoose');
const schema = mongoose.Schema;

const doctorSchema = new schema({
    name: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: false
    },
    qualification: {
        type: String,
        required: true,
    },
    yearsOfExperience: {
        type: String,
        required: true,
    },
    specialty: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    profileImage: {
        type: String,
        require: false
    }

})
const Doctor = mongoose.model("Doctor", doctorSchema)
module.exports = Doctor;