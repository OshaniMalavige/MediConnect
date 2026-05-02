import React from 'react';
import Link from 'next/link';
import { ArrowRight, Globe, Hospital, FlaskRound } from 'lucide-react';

export default function AppointmentSelection() {
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-slate-100 p-4 md:p-10">
            {/* Main Card Container */}
            <div className="flex flex-col md:flex-row w-full max-w-6xl bg-white rounded-3xl overflow-hidden shadow-xl min-h-[600px]">

                {/* Left Side: Branding/Hero */}
                <div className="w-full md:w-[40%] bg-gradient-to-br from-teal-500 to-indigo-600 p-10 md:p-16 flex flex-col relative overflow-hidden">
                    {/* Logo Section */}
                    <Link href="/">
                        <div className="flex items-center space-x-2 text-white mb-20 relative z-10">
                            <span className="font-bold tracking-tight text-xl">MediConnect</span>
                        </div>
                    </Link>

                    <div className="relative z-10">
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
                            A few clicks away from scheduling your appointment.
                        </h1>
                        <p className="text-blue-100/80 text-lg">
                            Start scheduling your appointment in minutes. Save time and money.
                        </p>
                    </div>

                    {/* Abstract Signpost Graphic (Simulated with simple shapes) */}
                    <div className="absolute bottom-12 left-16 md:left-24">
                        <div className="relative">
                            <div className="w-12 h-12 bg-white rounded-sm shadow-lg transform -skew-x-12" />
                            <div className="w-1.5 h-16 bg-white mx-auto mt-[-4px]" />
                            {/* Shadow effect */}
                            <div className="absolute bottom-0 right-[-20px] w-12 h-2 bg-black/10 blur-sm rounded-full transform skew-x-45" />
                        </div>
                    </div>
                </div>

                {/* Right Side: Selection Form */}
                <div className="w-full md:w-[60%] p-8 md:p-20 flex flex-col justify-center bg-[#fcfdff]">
                    <div className="max-w-md mx-auto w-full">
                        <h2 className="text-2xl font-bold text-slate-800 mb-3">
                            Choose the type of Appointment
                        </h2>
                        <p className="text-slate-500 text-sm mb-10 leading-relaxed">
                            Scheduling your appointment in MediConnect is just a few steps away. <br />
                            Select the option to continue.
                        </p>

                        <div className="space-y-4">
                            <Link
                                href="/user/appointment"
                                className="group flex items-center justify-between p-5 bg-teal-50/50 border-2 border-teal-200 rounded-2xl hover:border-teal-500 transition-all duration-200 cursor-pointer"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="bg-teal-600 p-3 rounded-xl text-white">
                                        <Hospital className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800 text-sm">Schedule Consultation</h3>
                                    </div>
                                </div>
                                <ArrowRight className="w-5 h-5 text-teal-600 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all" />
                            </Link>

                            {/* Corporation Option */}
                            <Link
                                href="/user/laboratoryServices"
                                className="group flex items-center justify-between p-5 bg-teal-50/50 border-2 border-teal-200 rounded-2xl hover:border-teal-500 transition-all duration-200 cursor-pointer"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="bg-teal-600 p-3 rounded-xl text-white">
                                        <FlaskRound className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800 text-sm">Laboratory Services</h3>
                                    </div>
                                </div>
                                <ArrowRight className="w-5 h-5 text-teal-600 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}