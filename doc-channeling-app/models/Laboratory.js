import mongoose from "mongoose";

const testSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
});

const laboratorySchema = new mongoose.Schema({
    tests: [testSchema],
    location: { type: String, required: true },
    time: { type: String, required: true },
}, { timestamps: true });

// Check if the model already exists, otherwise create it
const Laboratory = mongoose.models.Laboratory || mongoose.model("Laboratory", laboratorySchema);

export default Laboratory;