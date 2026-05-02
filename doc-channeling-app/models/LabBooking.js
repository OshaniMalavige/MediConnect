import mongoose from 'mongoose';

const LabBookingSchema = new mongoose.Schema({
    testIds: [{ type: String, required: true }],
    tests: [{
        name: String,
        price: Number
    }],
    totalPrice: { type: Number, required: true },
    patientName: { type: String },
    location: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    mobile: { type: String, required: true },
    status: { type: String, default: 'Lab' },
}, { timestamps: true });

export default mongoose.models.LabBooking || mongoose.model('LabBooking', LabBookingSchema);