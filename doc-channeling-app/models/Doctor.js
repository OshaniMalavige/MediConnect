import mongoose from "mongoose";

// models/Doctor.js
const DoctorSchema = new mongoose.Schema({
    doctorName: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    // Structured availability
    availability: [{
        day: { type: String, required: true }, // e.g., "Saturday"
        startTime: { type: String, required: true }, // e.g., "15:00"
        endTime: { type: String, required: true },  // e.g., "19:00"
        location: { type: String, required: true },  // e.g., "19:00"
    }],
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Doctor ||
mongoose.model("Doctor", DoctorSchema);
