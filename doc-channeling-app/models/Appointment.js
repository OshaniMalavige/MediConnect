// models/Appointment.js
import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema({
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    patientName: { type: String, required: true },
    patientEmail: { type: String, required: true },
    patientPhone: { type: String, required: true },
    nicPassport: { type: String, required: true },
    appointmentDate: { type: Date, required: true },
    appointmentTime: { type: String, required: true },
    appointmentLocation: { type: String, required: true },
    patientNo: { type: Number, required: true },
    status: { type: String, default: "Pending" },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Appointment || mongoose.model("Appointment", AppointmentSchema);