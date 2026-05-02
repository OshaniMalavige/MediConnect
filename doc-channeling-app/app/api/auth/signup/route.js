import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import dbConnect from "@/lib/db";
import User from "@/models/User";

export async function POST(request) {
    try {

        await dbConnect();

        const { fullName, email, phone, password, role = 'user' } = await request.json()

        // Validation
        if (!fullName || !email || !phone || !password) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        // Check if user exists
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return NextResponse.json(
                { error: 'User already exists' },
                { status: 409 }
            )
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        // Create user
        const result = await User.insertOne({
            fullName,
            email,
            phone,
            password: hashedPassword,
            role,
            createdAt: new Date(),
            updatedAt: new Date(),
        })

        return NextResponse.json(
            {
                message: 'User created successfully',
                userId: result.insertedId
            },
            { status: 201 }
        )
    } catch (error) {
        console.error('Signup error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
