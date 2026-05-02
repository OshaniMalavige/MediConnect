import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Laboratory from "@/models/Laboratory";

export async function PUT(req, { params }) {
    try {
        await dbConnect();

        // ✅ Unwrapping the params promise
        const resolvedParams = await params;
        const id = resolvedParams.id;

        const body = await req.json();

        const updatedService = await Laboratory.findByIdAndUpdate(id, body, { new: true });

        if (!updatedService) {
            return NextResponse.json({ success: false, error: "Service not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: updatedService });
    } catch (error) {
        console.error("PUT ERROR:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    try {
        await dbConnect();

        // ✅ Unwrapping the params promise
        const resolvedParams = await params;
        const id = resolvedParams.id;

        const deletedService = await Laboratory.findByIdAndDelete(id);

        if (!deletedService) {
            return NextResponse.json({ success: false, error: "Service not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Deleted successfully" });
    } catch (error) {
        console.error("DELETE ERROR:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}