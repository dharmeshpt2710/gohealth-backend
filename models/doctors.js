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
    // profileImage: {
    //     type: String,
    //     require: false
    // },
    registrationStatus: {
        type: Boolean,
        require: false
    },
    appointments: [{
        patientId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        appointmentId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Appointment'
        },
        // appointmentTime: {
        //     type: String,
        //     required: true
        // },

    }]

})
const Doctor = mongoose.model("Doctor", doctorSchema)
module.exports = Doctor;