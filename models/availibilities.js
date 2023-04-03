const mongoose = require("mongoose");
const schema = mongoose.Schema;

const availabilities = new schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Doctor",
  },
  appointmentDate: {
    type: String,
    required: true,
  },
  timeSlots: [
    {
      startTime: {
        type: String,
      },
      endTime: {
        type: String,
      },
    },
  ],
});
const Availabilities = mongoose.model("Availabilities", availabilities);
module.exports = Availabilities;
