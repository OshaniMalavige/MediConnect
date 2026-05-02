// app/api/appointments/nextSlot/route.js
import dbConnect from "@/lib/db";
import Appointment from "@/models/Appointment";
import Doctor from "@/models/Doctor";
import { NextResponse } from "next/server";
import { addMinutes, parse, format } from "date-fns";

export async function GET(request) {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const doctorId = searchParams.get("doctorId");
    const dateStr = searchParams.get("date"); // YYYY-MM-DD

    try {
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) return NextResponse.json({ error: "Doctor not found" }, { status: 404 });

        const selectedDateObj = new Date(dateStr);
        const dayName = format(selectedDateObj, 'EEEE');
        const daySchedule = doctor.availability.find(a => a.day === dayName);
        const baseStartTime = daySchedule ? daySchedule.startTime : "09:00";

        const startOfDay = new Date(dateStr + "T00:00:00.000Z");
        const endOfDay   = new Date(dateStr + "T23:59:59.999Z");

        // ✅ DEBUG: Log exactly what we're querying
        console.log("=== nextSlot DEBUG ===");
        console.log("doctorId param:", doctorId);
        console.log("dateStr param:", dateStr);
        console.log("startOfDay:", startOfDay);
        console.log("endOfDay:", endOfDay);

        const appointments = await Appointment.find({
            doctorId,
            appointmentDate: { $gte: startOfDay, $lte: endOfDay }
        }).sort({ patientNo: 1 });

        let nextPatientNo = 1;
        let nextTimeStr = "";

        if (appointments.length > 0) {
            nextPatientNo = appointments.length + 1;
            const lastAppt = appointments[appointments.length - 1];
            const lastTime = parse(lastAppt.appointmentTime, 'hh:mm a', new Date());
            const nextTime = addMinutes(lastTime, 30);
            nextTimeStr = format(nextTime, 'hh:mm a');
        } else {
            const baseTime = parse(baseStartTime, 'HH:mm', new Date());
            nextTimeStr = format(baseTime, 'hh:mm a');
        }

        return NextResponse.json({
            success: true,
            patientNo: nextPatientNo,
            time: nextTimeStr
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}