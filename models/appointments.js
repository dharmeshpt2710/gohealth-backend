const mongoose = require('mongoose');
const schema = mongoose.Schema;

const appointmentSchema = new schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
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