"use client";
import {
    LayoutDashboard,
    Users,
    FileText,
    Settings,
    LogOut,
    Activity,
    Stethoscope,
    FlaskConicalIcon,
    X
} from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import React from "react";

const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/" },
    { icon: Stethoscope, label: "Doctors", href: "/admin/doctors" },
    { icon: Users, label: "Patients", href: "/admin/patients" },
    { icon: FlaskConicalIcon, label: "Laboratory", href: "/admin/laboratory" },
    { icon: FileText, label: "Reports", href: "/reports" },
    { icon: Settings, label: "Settings", href: "/settings" },
];

export default function Sidebar({ onSignOut, onMobileClose }) {
    const pathname = usePathname();
    const router = useRouter();

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

    const handleLinkClick = () => {
        if (onMobileClose) {
            onMobileClose();
        }
    }

    return (
        <div className="flex flex-col h-full bg-[#0F172A] text-slate-300 shadow-xl">
            {/* Mobile Close Button */}
            <div className="flex justify-between items-center p-4 xl:hidden border-b border-slate-800">
                <div className="flex items-center gap-3">
                    <div className="bg-teal-600 p-1.5 rounded-lg text-white">
                        <Activity size={24} />
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-br from-teal-500 to-indigo-600 bg-clip-text text-transparent">
                        MediConnect
                    </span>
                </div>
                <button
                    onClick={onMobileClose}
                    className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                    aria-label="Close menu"
                >
                    <X size={24} />
                </button>
            </div>

            {/* Desktop Logo */}
            <div className="hidden xl:flex items-center gap-3 px-4 py-6 mb-4">
                <div className="bg-teal-600 p-1.5 rounded-lg text-white">
                    <Activity size={24} />
                </div>
                <span className="text-xl font-bold bg-gradient-to-br from-teal-500 to-indigo-600 bg-clip-text text-transparent">
                    MediConnect
                </span>
            </div>

            <nav className="flex-1 space-y-2 px-3 overflow-y-auto">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            onClick={handleLinkClick}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                                isActive
                                    ? "bg-teal-600 text-white shadow-lg shadow-blue-900/20"
                                    : "hover:bg-slate-800 hover:text-white"
                            }`}
                        >
                            <item.icon size={20} />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="pt-4 pb-6 px-3 border-t border-slate-800">
                <button
                    className="flex items-center gap-3 px-4 py-3 w-full hover:text-red-400 transition-colors cursor-pointer rounded-xl hover:bg-slate-800"
                    onClick={onSignOut || handleSignOut}
                >
                    <LogOut size={20} />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </div>
    );
}