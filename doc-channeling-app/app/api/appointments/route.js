import dbConnect from "@/lib/db";
import Appointment from "@/models/Appointment";
import { NextResponse } from "next/server";

export async function POST(request) {
    await dbConnect();
    try {
        const body = await request.json();

        // Basic validation
        if (!body.doctorId || !body.fullName || !body.appointmentDate) {
            return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
        }

        // ✅ FIX: Parse YYYY-MM-DD string safely at noon UTC to avoid timezone shifting
        const [year, month, day] = body.appointmentDate.split('-').map(Number);
        const normalizedDate = new Date(Date.UTC(year, month - 1, day, 12, 0, 0, 0));

        const newAppointment = await Appointment.create({
            doctorId: body.doctorId,
            patientName: body.fullName,
            patientEmail: body.email,
            patientPhone: body.phone,
            nicPassport: body.nicPassport,
            appointmentDate: normalizedDate,  // ✅ Stored as 2026-02-22T12:00:00.000Z
            appointmentTime: body.appointmentTime,
            appointmentLocation: body.appointmentLocation,
            patientNo: body.patientNo,
            status: "Confirmed"
        });

        return NextResponse.json({
            success: true,
            message: "Appointment booked successfully!",
            appointmentId: newAppointment._id
        }, { status: 201 });

    } catch (error) {
        console.error("Booking Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function GET() {
    await dbConnect();
    try {
        const appointments = await Appointment.find({}).sort({ appointmentDate: 1 });
        return NextResponse.json({ success: true, data: appointments });
    } catch (error) {
        return NextResponse.json({ success: false }, { status: 400 });
    }
}