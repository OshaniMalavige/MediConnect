'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import TextField from '@/components/ui/TextField'
import Button from '@/components/ui/Button'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { ArrowRightCircle } from 'lucide-react';
import notifications from "@/components/alerts/alerts";

export default function SignInPage() {
    const router = useRouter()
    const [formData, setFormData] = useState({ email: '', password: '' })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async () => {
        setLoading(true)
        setError('')

        try {
            const response = await fetch('/api/auth/signin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            const data = await response.json()

            if (!response.ok) {
                notifications.error("Sign in Failed")
                throw new Error(data.error || 'Sign in failed')
            }

            // Store user data and token in localStorage
            localStorage.setItem('user', JSON.stringify(data.user))
            localStorage.setItem('token', data.token)

            // Redirect based on role
            if (data.user.role === 'admin') {
                notifications.success("Sign In Successfully");
                router.push('/admin/dashboard')
            } else {
                notifications.success("Sign In Successfully");
                router.push('/user/home')
            }
        } catch (err) {
            notifications.error(err.message);
            setLoading(false)
            setError(err.message)
        }
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#f0f4ff] p-4 md:p-0">
            <div className="flex flex-col md:flex-row w-full max-w-5xl bg-white rounded-[2.5rem] overflow-hidden shadow-2xl min-h-[650px]">

                {/* Left Side: Branding */}
                <div className="relative w-full md:w-1/2 bg-gradient-to-br from-teal-500 to-indigo-600 p-12 flex flex-col justify-center text-white overflow-hidden">
                    {/* Abstract Decorations */}
                    <div className="absolute top-12 left-12 w-3 h-3 bg-white/30 rounded-full" />
                    <div className="absolute top-24 right-24 w-16 h-16 border border-white/20 rounded-full" />

                    <div className="relative z-10">
                        <Link href="/">
                            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight tracking-tight">
                                MediConnect
                            </h1>
                        </Link>
                        <p className="text-blue-50 text-lg opacity-80 max-w-xs leading-relaxed">
                            Access your account to manage doctor appointments and view laboratory results in one convenient place. Log in securely using your credentials to book consultations, track reports, and stay updated on your healthcare services. Our platform ensures a safe and seamless experience while protecting your personal information.
                        </p>
                    </div>

                    {/* Bottom Geometric Shape */}
                    <div className="absolute -bottom-16 -right-16 w-64 h-64 border-[20px] border-white/5 rounded-full" />
                    <div className="absolute bottom-10 right-10">
                        <ArrowRightCircle className="w-12 h-12 text-white/20 rotate-45" />
                    </div>
                </div>

                {/* Right Side: Login Form */}
                <div className="w-full md:w-1/2 p-8 md:p-20 flex flex-col justify-center">
                    <div className="flex flex-col items-center mb-10">
                        <h2 className="text-3xl font-bold text-slate-600">Hello ! Welcome back</h2>
                        <p className="text-teal-600">Sign in to continue</p>
                    </div>

                    <div className="space-y-6">
                        {/* Email Field */}
                        <div className="space-y-1">
                            <TextField
                                label="Email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="your.email@example.com"
                            />
                        </div>

                        {/* Password Field */}
                        <div className="space-y-1">
                            <TextField
                                label="Password"
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                placeholder="Enter your password"
                                error={error}
                            />
                        </div>

                        {/* Login Button */}
                        <Button onClick={handleSubmit} disabled={loading} className="w-full">
                            {loading ? <LoadingSpinner size={20} /> : 'Sign In'}
                        </Button>

                        {/* Footer */}
                        <p className="text-center text-sm text-gray-400">
                            Dont Have an account?  <Link href="/signup" className="text-teal-500 font-bold ml-1">Create Account</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}