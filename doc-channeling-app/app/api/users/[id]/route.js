import dbConnect from "@/lib/db";
import User from "@/models/User";
import {NextResponse} from "next/server";

export async function DELETE(req, { params }) {
    const { id } = await params;

    await dbConnect();

    try {
        const deleted = await User.findByIdAndDelete(id);

        if (!deleted) {
            return NextResponse.json(
                { success: false, error: "User not found" },
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
