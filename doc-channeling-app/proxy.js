import { NextResponse } from 'next/server'
import { verifyToken } from './lib/jwt'

export async function proxy(request) {
    const { pathname } = request.nextUrl
    const token = request.cookies.get('token')?.value

    // 🔒 Protect admin dashboard routes
    if (pathname.startsWith('/admin')) {
        if (!token) {
            return NextResponse.redirect(new URL('/signin', request.url))
        }

        try {
            const decoded = await verifyToken(token)

            // 🚫 Non-admin trying to access admin routes
            if (decoded.role !== 'admin') {
                return NextResponse.redirect(new URL('/user/home', request.url))
            }

        } catch (error) {
            return NextResponse.redirect(new URL('/signin', request.url))
        }
    }

    // 🔁 Redirect users based on role when accessing root dashboard
    if (pathname === '/dashboard') {
        if (!token) {
            return NextResponse.redirect(new URL('/signin', request.url))
        }

        try {
            const decoded = await verifyToken(token)

            if (decoded.role === 'admin') {
                return NextResponse.redirect(new URL('/admin/dashboard', request.url))
            } else {
                return NextResponse.redirect(new URL('/user/home', request.url))
            }

        } catch (error) {
            return NextResponse.redirect(new URL('/signin', request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/admin/:path*', '/dashboard']
}
