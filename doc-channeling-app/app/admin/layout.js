'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/layout/Sidebar'
import Header from "@/components/layout/dashboard/Header"
import { Menu, X } from 'lucide-react'

export default function AdminLayout({ children }) {
    const router = useRouter()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const handleSignOut = async () => {
        try {
            await fetch('/api/auth/signout', { method: 'POST' })
        } catch (error) {
            console.error('Signout error:', error)
        } finally {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            router.push('/signin')
        }
    }

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen)
    }

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false)
    }

    return (
        <div className="bg-slate-50 font-sans flex min-h-screen">
            {/* Mobile Menu Button */}
            <button
                onClick={toggleMobileMenu}
                className="fixed top-4 left-4 z-50 xl:hidden bg-white p-2 rounded-lg shadow-lg border border-slate-200"
                aria-label="Toggle menu"
            >
                <Menu size={24} className="text-slate-700" />
            </button>

            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 xl:hidden transition-opacity duration-300"
                    onClick={closeMobileMenu}
                />
            )}

            {/* Sidebar - Desktop */}
            <aside className="fixed inset-y-0 left-0 w-64 hidden xl:block">
                <Sidebar onSignOut={handleSignOut} onMobileClose={closeMobileMenu} />
            </aside>

            {/* Sidebar - Mobile */}
            <aside
                className={`fixed inset-y-0 left-0 w-64 z-50 transform transition-transform duration-300 ease-in-out xl:hidden ${
                    isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <Sidebar onSignOut={handleSignOut} onMobileClose={closeMobileMenu} />
            </aside>

            <div className="flex-1 xl:ml-64 flex flex-col">
                <Header onMenuClick={toggleMobileMenu} />
                <main className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto w-full">
                    {children}
                </main>
            </div>
        </div>
    )
}