import dbConnect from "@/lib/db";
import Doctor from "@/models/Doctor";
import { NextResponse } from "next/server";

// GET one doctor
export async function GET(req, context) {
    const { params } = await context;
    const id = params.id;

    await dbConnect();

    try {
        const doctor = await Doctor.findById(id);

        if (!doctor) {
            return NextResponse.json(
                { success: false, error: "Doctor not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: doctor });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 400 }
        );
    }
}

// UPDATE doctor
export async function PUT(req, { params }) {
    const { id } = await params;

    await dbConnect();

    try {
        const body = await req.json();

        const updatedDoctor = await Doctor.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
        });

        if (!updatedDoctor) {
            return NextResponse.json(
                { success: false, error: "Doctor not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: updatedDoctor });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 400 }
        );
    }
}

// DELETE doctor
export async function DELETE(req, { params }) {
    const { id } = await params;

    await dbConnect();

    try {
        const deleted = await Doctor.findByIdAndDelete(id);

        if (!deleted) {
            return NextResponse.json(
                { success: false, error: "Doctor not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 400 }
        );
    }
}
