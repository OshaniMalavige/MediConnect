'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const AuthContext = createContext(null)

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider')
    }
    return context
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        // Check for existing session
        const token = localStorage.getItem('token')
        const savedUser = localStorage.getItem('user')

        if (token && savedUser) {
            setUser(JSON.parse(savedUser))
        }
        setLoading(false)
    }, [])

    const signin = async (email, password) => {
        try {
            const response = await fetch('/api/auth/signin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Sign in failed')
            }

            localStorage.setItem('token', data.token)
            localStorage.setItem('user', JSON.stringify(data.user))
            setUser(data.user)

            return data.user
        } catch (error) {
            throw error
        }
    }

    const signup = async (userData) => {
        try {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Signup failed')
            }

            return data
        } catch (error) {
            throw error
        }
    }

    const signout = async () => {
        try {
            await fetch('/api/auth/signout', { method: 'POST' })
        } catch (error) {
            console.error('Signout error:', error)
        } finally {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            setUser(null)
            router.push('/signin')
        }
    }

    const value = {
        user,
        loading,
        signin,
        signup,
        signout
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}