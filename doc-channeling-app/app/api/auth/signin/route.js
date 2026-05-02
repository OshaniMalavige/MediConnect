import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import User from '@/models/User';
import { generateToken } from '@/lib/jwt'
import dbConnect from "@/lib/db";

export async function POST(request) {
    try {

        await dbConnect();

        const { email, password } = await request.json()

        // Validation
        if (!email || !password) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        // Find user
        const user = await User.findOne({ email })
        if (!user) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            )
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password)
        if (!isValidPassword) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            )
        }

        // Generate JWT token
        const token = generateToken({
            userId: user._id,
            email: user.email,
            role: user.role,
        })

        // Create response with user data (excluding password)
        const userData = {
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
        }

        const response = NextResponse.json(
            {
                message: 'Login successful',
                user: userData,
                token
            },
            { status: 200 }
        )

        // Set HTTP-only cookie
        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60, // 7 days
        })

        return response
    } catch (error) {
        console.error('Signin error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}