const express = require("express");
const Appointments = require("../models/appointments");
const Doctor = require("../models/doctors");
const User = require("../models/users");
const router = express.Router();

//API to get all the appointments
router.get("/", async (req, res) => {
    try {
        const appointments = await Appointments.find();
        res.status(200).json(appointments);
    } catch (error) {
        res.status(400).json({ message: "No Appointments available" })
    }

})

//API to get the appointment by ID
router.get("/:id", async (req, res) => {

    try {
        const appointment = await Appointments.findById(req.params._id)
        res.status(200).json(appointment)
    } catch (error) {
        res.status(400).json({ message: "No Appointments available" })
    }
})

//API to book an appointment
router.post("/", async (req, res) => {
    try {
        const { patientId, doctorId, appointmentTime, appointmentNote } = req.body;
        const existingAppointment = await Appointments.findOne({ doctorId, appointmentTime });

        if (existingAppointment) {
            return res.status(400).json({ message: "This time slot is already booked. Please choose another slot." });
        }

        const newAppointment = new Appointments({ patientId, doctorId, appointmentTime, appointmentNote, appointmentStatus: true });
        const appointment = await newAppointment.save();

        res.status(201).json({ message: "Appointment Created", appointment: appointment });
        updateUserAndDoctor(appointment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//function to update the user and doctor while creating the appointment
async function updateUserAndDoctor(appointment) {
    try {
        const updatedPatient = await User.findByIdAndUpdate(
            appointment.patientId,
            { $push: { appointments: { doctorId: appointment.doctorId, appointmentId: appointment._id, appointmentTime: appointment.appointmentTime } } },
            { new: true }
        ).exec();

        const updatedDoctor = await Doctor.findByIdAndUpdate(
            appointment.doctorId,
            { $push: { appointments: { patientId: appointment.patientId, appointmentId: appointment._id, appointmentTime: appointment.appointmentTime } } },
            { new: true }
        ).exec();

        console.log(updatedPatient, updatedDoctor);
    } catch (error) {
        console.log(error);
    }
}
//API to close the appointment
router.put("/", async (req, res) => {
    const appointmentId = req.body.appointmentId;

    Appointments.findById(appointmentId, (err, appointment) => {
        if (err) {
            return res.status(500).send({ message: 'Error retrieving appointment' });
        }
        if (!appointment) {
            return res.status(404).send({ message: 'Appointment not found' });
        }

        const doctorId = appointment.doctorId

        Appointments.findByIdAndUpdate({ _id: appointmentId }, { $set: { appointmentStatus: false } }, { new: true }, (err, updatedAppointment) => {
            if (err) {
                console.log(err);
            } else {
                console.log(updatedAppointment);
                Doctor.findByIdAndUpdate(doctorId, { $pull: { appointments: { appointmentId: appointmentId } } }, { new: true }, (err, updatedDoctor) => {
                    if (err) {
                        return res.status(500).send({ message: 'Error updating doctor' });
                    }
                    if (!updatedDoctor) {
                        return res.status(404).send({ message: 'Doctor not found' });
                    }
                    res.send({ message: 'Appointment closed successfully' });
                });
            }
        })

    })
})
module.exports = router;