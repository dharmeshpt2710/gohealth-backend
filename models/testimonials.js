const mongoose = require("mongoose");
const schema = mongoose.Schema;
const testimonialSchema = new schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Doctor",
    },
    ratings: {
        type: Number,
        required: true,
    },
    comment: {
        type: String,
        required: true
    }
})
const Testimonial = mongoose.model("Testimonial", testimonialSchema)
module.exports = Testimonial