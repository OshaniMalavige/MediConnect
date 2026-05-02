'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'
import { User, ChevronDown, Menu, X, LogOut, Settings, Calendar } from 'lucide-react';

const Header = () => {
    const router = useRouter()
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Check for user in localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Error parsing user data", e);
            }
        }

        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'About', href: '/#about' },
        { name: 'Departments', href: '/#categories' },
        { name: 'Services', href: '/#services' },
        { name: 'Contact', href: '/#contact' },
    ];

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
            isScrolled ? 'bg-white shadow-md py-3' : 'bg-white/90 backdrop-blur-md py-5'
        }`}>
            <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">

                {/* Logo */}
                <Link href="/" className="flex items-center">
                  <span className="text-2xl font-bold bg-gradient-to-br from-teal-500 to-indigo-600 bg-clip-text text-transparent">
                    MediConnect
                  </span>
                </Link>

                {/* Desktop Navigation (Hidden on Mobile) */}
                <nav className="hidden lg:flex items-center space-x-8">
                    {navLinks.map((link) => (
                        <Link key={link.name} href={link.href} className="text-sm font-semibold text-slate-600 hover:text-teal-600 transition-colors">
                            {link.name}
                        </Link>
                    ))}
                </nav>

                {/* Desktop Actions (Hidden on Mobile) */}
                <div className="hidden lg:flex items-center space-x-5">
                    {user ? (
                        <div className="relative">
                            <button onClick={() => setUserDropdownOpen(!userDropdownOpen)} className="flex items-center gap-2 p-2 hover:bg-slate-50 rounded-lg">
                                <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center text-teal-700">
                                    <User className="w-5 h-5" />
                                </div>
                                <span className="text-sm font-bold text-slate-700">{user.fullName}</span>
                                <ChevronDown className="w-4 h-4 text-slate-400" />
                            </button>
                            {userDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-2">
                                    <Link href="/profile" className="flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50">
                                        <Settings className="w-4 h-4" /> Profile
                                    </Link>
                                    <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer">
                                        <LogOut className="w-4 h-4" /> Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link href="/signin" className="p-2 text-slate-600 hover:text-teal-600"><User className="w-6 h-6" /></Link>
                    )}
                    <Link href="/user/appointmentSelection" className="bg-teal-600 text-white px-6 py-2.5 rounded-lg font-bold text-sm">Appointment</Link>
                </div>

                {/* Mobile Toggle Button (Visible on Mobile) */}
                <button
                    className="lg:hidden p-2 text-slate-800 focus:outline-none"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
                </button>
            </div>

            {/* MOBILE MENU (Tabs Display Logic) */}
            <div className={`lg:hidden absolute top-full left-0 w-full bg-white border-t border-slate-100 transition-all duration-300 ease-in-out ${
                isMobileMenuOpen ? 'opacity-100 translate-y-0 visible shadow-2xl' : 'opacity-0 -translate-y-4 invisible'
            }`}>
                <div className="px-4 py-6 space-y-1">
                    {/* Main Tabs */}
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="block px-4 py-3 text-base font-semibold text-slate-700 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {link.name}
                        </Link>
                    ))}

                    {/* User Section in Mobile */}
                    <div className="pt-4 mt-4 border-t border-slate-100">
                        {user ? (
                            <div className="space-y-1">
                                <div className="px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                                    Logged in as {user.fullName}
                                </div>
                                <Link
                                    href="/profile"
                                    className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-50 rounded-lg"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <Settings className="w-5 h-5 text-teal-600" /> Profile Settings
                                </Link>
                                <button
                                    onClick={handleSignOut}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg"
                                >
                                    <LogOut className="w-5 h-5" /> Logout
                                </button>
                            </div>
                        ) : (
                            <Link
                                href="/signin"
                                className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-50 rounded-lg font-semibold"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <User className="w-5 h-5 text-teal-600" /> Sign In / Register
                            </Link>
                        )}

                        {/* Mobile Appointment CTA */}
                        <div className="px-4 mt-4">
                            <Link
                                href="/appointment"
                                className="flex items-center justify-center gap-2 w-full bg-teal-600 text-white py-4 rounded-xl font-bold shadow-lg"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <Calendar className="w-5 h-5" />
                                Book Appointment
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;