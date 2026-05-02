import React from 'react';
import Link from 'next/link';
import { Phone, ArrowRight } from 'lucide-react';

export default function CallSection() {
    return (
        <div className="bg-white font-sans text-slate-800">

            {/* 1. Hero & About Section */}
            <section className="py-16 px-4 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6 text-slate-900">
                            Empowering Your Path to Better Health
                        </h1>
                        <p className="text-slate-500 text-lg mb-8 leading-relaxed">
                            Explore advanced healthcare services delivered with empathy and expertise.
                            Our dedicated team focuses on providing individualized medical care tailored to every patient.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link href="/user/appointment">
                                <button className="px-8 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors cursor-pointer">
                                    Schedule Consultation
                                </button>
                            </Link>
                            <Link href="/user/appointmentSelection">
                                <button className="px-8 py-3 text-teal-600 font-semibold flex items-center gap-2 hover:gap-3 transition-all cursor-pointer">
                                    Explore Services <ArrowRight className="w-4 h-4" />
                                </button>
                            </Link>
                        </div>
                    </div>
                    <div className="relative">
                        <img
                            src="/assesst/Medical.png"
                            alt="Medical Center"
                            className="rounded-2xl shadow-2xl w-full object-cover h-[400px]"
                        />
                    </div>
                </div>
            </section>

            {/* 2. Statistics Bar */}
            <section className="py-12 border-t border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div>
                            <div className="text-3xl font-bold text-teal-500">25+</div>
                            <div className="text-slate-400 text-sm mt-1">Years Experience</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-teal-500">15K+</div>
                            <div className="text-slate-400 text-sm mt-1">Happy Patients</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-teal-500">50+</div>
                            <div className="text-slate-400 text-sm mt-1">Medical Experts</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-teal-500">24/7</div>
                            <div className="text-slate-400 text-sm mt-1">Emergency Care</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. Emergency Call Action (The Teal Bar) */}
            <section className="pb-20 px-4">
                <div className="max-w-7xl mx-auto bg-teal-700 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                            <Phone className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-white">
                            <h4 className="text-xl font-bold">Need Immediate Assistance?</h4>
                            <p className="text-teal-100 text-sm opacity-90">Our medical team is available around the clock for urgent consultations.</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        <div className="bg-white px-6 py-3 rounded-lg flex items-center gap-3 shadow-lg">
                            <Phone className="w-5 h-5 text-teal-700" />
                            <span className="font-bold text-slate-800">+94 777 289 336</span>
                        </div>
                        <button className="text-white font-semibold border-b-2 border-white/30 hover:border-white transition-all">
                            Get Directions
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}