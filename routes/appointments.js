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

//API to get the appointment by I
router.get("/doctors/:doctorId", async (req, res) => {

    try {
        const appointment = await Appointments.find({ doctorId: req.params.doctorId })
        res.status(200).json({ appointments: appointment })
    } catch (error) {
        res.status(400).json({ message: "No Appointments available" })
    }
})
router.get("/patients/:patientId", async (req, res) => {

    try {
        const appointment = await Appointments.find({ patientId: req.params.patientId })
        res.status(200).json({ appointments: appointment })
    } catch (error) {
        res.status(400).json({ message: "No Appointments available" })
    }
})
//api to get the timeSlots
router.post('/bookedTimeSlots', async (req, res) => {
    const { doctorId, appointmentDate } = req.body;
    try {
        const existingAppointments = await Appointments.find({ doctorId: doctorId, appointmentDate: appointmentDate });
        res.status(200).json({ appointments: existingAppointments })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})
// router.get('/availableTimeSlots', async (req, res) => {
//     try {
//         const doctorId = req.query.doctorId;
//         const date = new Date(req.query.date);
//         const appointments = await Appointment.find({
//             doctor: doctorId,
//             date: date
//         });
//         const startTime = new Date(date);
//         startTime.setHours(9, 0, 0, 0); // clinic opening time
//         const endTime = new Date(date);
//         endTime.setHours(17, 0, 0, 0); // clinic closing time
//         const timeSlots = [];
//         while (startTime < endTime) {
//             timeSlots.push(new Date(startTime));
//             startTime.setMinutes(startTime.getMinutes() + 30);
//         }
//     } catch (error) {

//     }
// })

//API to book an appointment
router.post("/", async (req, res) => {
    try {
        const { patientId, doctorId, appointmentName, appointmentEmail, appointmentStartTime, appointmentEndTime, appointmentDate, appointmentNote } = req.body;
        const existingAppointment = await Appointments.findOne({ doctorId, appointmentStartTime });

        if (existingAppointment) {
            return res.status(400).json({ message: "This time slot is already booked. Please choose another slot." });
        }

        const newAppointment = new Appointments({
            patientId: patientId,
            doctorId: doctorId,
            appointmentName,
            appointmentEmail,
            appointmentStartTime,
            appointmentEndTime,
            appointmentDate,
            appointmentNote,
            appointmentStatus: true
        });
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
            { $push: { appointments: { appointmentId: appointment._id } } },
            { new: true }
        ).exec();

        const updatedDoctor = await Doctor.findByIdAndUpdate(
            appointment.doctorId,
            { $push: { appointments: { appointmentId: appointment._id } } },
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