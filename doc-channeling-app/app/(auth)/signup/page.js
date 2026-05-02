'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import TextField from '@/components/ui/TextField'
import Button from '@/components/ui/Button'
import {ArrowRightCircle} from "lucide-react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import notifications from "@/components/alerts/alerts";

export default function SignUpPage() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: ''
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async () => {
        setLoading(true)
        setError('')

        try {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, role: 'user' })
            })

            const data = await response.json()
            if (!response.ok) throw new Error(data.error || 'Signup failed')
            notifications.success("Account Created Successfully")
            router.push('/signin')
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
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
                            Create your account to easily book doctor appointments and access laboratory services online. Sign up with your details to manage consultations, view test results, and stay connected with your healthcare needs. Our secure platform protects your information while providing a smooth and convenient experience.
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
                        <h2 className="text-3xl font-bold text-slate-600">Create Account</h2>
                        <p className="text-teal-600">Sign up to get started</p>
                    </div>

                    <div className="space-y-6">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault()
                                handleSubmit()
                            }}
                            className="space-y-4"
                        >
                            <TextField
                                label="Full Name"
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                placeholder="John Doe"
                                required
                            />

                            <TextField
                                label="Email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="john@email.com"
                                required
                            />

                            <TextField
                                label="Phone"
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="+94XXXXXXXXX"
                                required
                            />

                            <TextField
                                label="Password"
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                placeholder="Minimum 8 characters"
                                required
                            />

                            {error && (
                                <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">
                                    {error}
                                </div>
                            )}

                            <Button type="submit" loading={loading} className="w-full">
                                Create Account
                            </Button>

                            {/* Footer */}
                            <p className="text-center text-sm text-gray-400">
                                Already have an account?  <Link href="/signin" className="text-teal-500 font-bold ml-1">Sign In</Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}