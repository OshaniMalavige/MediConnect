import dbConnect from "@/lib/db";
import Doctor from "@/models/Doctor";
import { NextResponse } from "next/server";

// GET all doctors
export async function GET() {
    await dbConnect();
    try {
        const doctors = await Doctor.find({}).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: doctors });
    } catch (error) {
        console.error("GET ERROR:", error);
        return NextResponse.json({ success: false }, { status: 400 });
    }
}

// api/doctors/route.js
export async function POST(request) {
    await dbConnect();
    try {
        const body = await request.json();

        // body should now contain: { ..., availability: [{ day: "Saturday", startTime: "15:00", endTime: "19:00" }] }
        const doctor = await Doctor.create(body);

        return NextResponse.json({ success: true, data: doctor }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
