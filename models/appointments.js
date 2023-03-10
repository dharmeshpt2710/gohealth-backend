const mongoose = require('mongoose');
const schema = mongoose.Schema;

const appointmentSchema = new schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    appointmentTime: {
        type: String,
        required: true
    },
    appointmentNote: {
        type: String,
        require: false
    }
})
const Appointments = mongoose.model("Appointments", appointmentSchema)
module.exports = Appointments