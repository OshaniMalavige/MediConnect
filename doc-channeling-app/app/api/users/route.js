import dbConnect from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET() {
    await dbConnect();
    try {
        const users = await User.find({}).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: users });
    } catch (error) {
        console.error("GET ERROR:", error);
        return NextResponse.json({ success: false }, { status: 400 });
    }
}