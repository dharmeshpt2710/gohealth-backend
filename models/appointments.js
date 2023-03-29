const mongoose = require('mongoose');
const schema = mongoose.Schema;

const appointmentSchema = new schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Doctor'
    },
    appointmentTime: {
        type: String,
        required: true
    },
    appointmentNote: {
        type: String,
        required: false
    },
    appointmentStatus: {
        type: Boolean,
        required: false
    }
})
const Appointments = mongoose.model("Appointments", appointmentSchema)
module.exports = Appointments