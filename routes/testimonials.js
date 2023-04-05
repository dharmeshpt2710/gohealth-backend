const express = require("express");
const Testimonial = require("../models/testimonials");
const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const testimonials = await Testimonial.find().populate("doctor").populate("patient");
        res.status(200).json({ testimonials: testimonials })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

router.post("/", async (req, res) => {
    try {
        const { patient, doctor, ratings, comment } = req.body;
        const setTestimonials = new Testimonial({
            patient: patient,
            doctor: doctor,
            ratings: ratings,
            comment: comment
        })
        const testimonial = await setTestimonials.save();
        res.status(201).json({
            message: "Testimonial Shared",
            testimonial: testimonial
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})
module.exports = router