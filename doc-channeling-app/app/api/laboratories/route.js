import dbConnect from "@/lib/db";
import { NextResponse } from "next/server";
import Laboratory from "@/models/Laboratory";
import Doctor from "@/models/Doctor";

export async function GET() {
    try {
        await dbConnect();
        const data = await Laboratory.find({}).sort({ createdAt: -1 });

        // Always return a JSON object, even if data is empty
        return NextResponse.json({ success: true, data: data || [] });
    } catch (error) {
        console.error("Database Error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch data" },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    await dbConnect();

    try {
        const body = await request.json();
        const { tests, location, time, description } = body;

        // ✅ Basic validation
        if (!tests || !Array.isArray(tests) || tests.length === 0) {
            return NextResponse.json(
                { success: false, error: "At least one test is required" },
                { status: 400 }
            );
        }

        for (const test of tests) {
            if (!test.name || !test.price) {
                return NextResponse.json(
                    { success: false, error: "Each test must have name and price" },
                    { status: 400 }
                );
            }
        }

        if (!location || !time) {
            return NextResponse.json(
                { success: false, error: "Location and time are required" },
                { status: 400 }
            );
        }

        // ✅ Create document
        const laboratory = await Laboratory.create({
            tests,
            location,
            time,
            description,
        });

        return NextResponse.json(
            { success: true, data: laboratory },
            { status: 201 }
        );

    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { success: false, error: "Server error" },
            { status: 500 }
        );
    }
}