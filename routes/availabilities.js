const express = require("express")
const Availabilities = require("../models/availibilities")

const router = express.Router()
router.get("/availableSlots", async (req, res) => {
    try {
        const availabilities = await Availabilities.find()
        if (availabilities.length == 0) {
            res.status(200).json({ message: "Availabilities not found" });
        } else {
            res.status(200).json(availabilities);

        }
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

router.post("/set-availabilities", async (req, res) => {
    try {
        const { doctorId, appointmentDate, timeSlots } = req.body
        const setAvailabilities = new Availabilities({
            doctorId: doctorId,
            appointmentDate: appointmentDate,
            timeSlots: timeSlots
        })
        const saveAvailabilities = await setAvailabilities.save();
        res.status(201).json({ message: "Availabilities created", availabilities: saveAvailabilities })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})
module.exports = router