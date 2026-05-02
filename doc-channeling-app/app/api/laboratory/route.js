import dbConnect from "@/lib/db";
import Laboratory from "@/models/Laboratory";
import { NextResponse } from "next/server";

export async function GET() {
    await dbConnect();
    try {
        const labs = await Laboratory.find({});
        return NextResponse.json({ success: true, data: labs });
    } catch (error) {
        return NextResponse.json({ success: false }, { status: 400 });
    }
}