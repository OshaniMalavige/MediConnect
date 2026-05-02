import dbConnect from "@/lib/db";
import LabBooking from "@/models/LabBooking";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        await dbConnect();
        const body = await req.json();

        const newBooking = await LabBooking.create(body);

        return NextResponse.json({ success: true, data: newBooking }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}