const express = require("express");
const { models } = require("mongoose");
const Appointments = require("../models/appointments");
const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const appointments = await Appointments.find();
        res.status(200).json(appointments);
    } catch (error) {
        res.status(400).json({ message: "No Appointments available" })
    }

})

router.get("/:id", async (req, res) => {

    try {
        const appointment = await Appointments.findById(req.params._id)
        res.status(200).json(appointment)
    } catch (error) {
        res.status(400).json({ message: "No Appointments available" })
    }
})


router.post("/", async (req, res) => {
    try {
        const { patientId, doctorId, appointmentTime, appointmentNote } = req.body;

        const existingAppointment = await Appointments.findOne({ doctorId, appointmentTime })
        if (existingAppointment) {
            res.status(400).json({ message: "This time slot is already booked. Please choose another slot." });
            return;
        }
        else {
            const newAppointment = new Appointments(patientId, doctorId, appointmentTime, appointmentNote)
            newAppointment.save((error, appointment) => {
                if (error) {
                    res.status(500).json({ error: error, message: error.message })
                    return
                } else {
                    res.status(201).json({ message: "Appointment Created", appointment: appointment })
                }
            })
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

module.exports = router;