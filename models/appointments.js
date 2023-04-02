const mongoose = require('mongoose');
const schema = mongoose.Schema;

const appointmentSchema = new schema({
    appointmentName: {
        type: String,
        required: true
    },
    appointmentEmail: {
        type: String,
        required: true,
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Doctor'
    },
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    appointmentStartTime: {
        type: String,
        required: true
    },
    appointmentEndTime: {
        type: String,
        required: true
    },
    appointmentDate: {
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