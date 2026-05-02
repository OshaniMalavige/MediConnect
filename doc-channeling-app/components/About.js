import React from 'react';
import { CheckCircle2, Heart, Phone } from 'lucide-react';
import Link from "next/link";

export default function AboutSection() {
    const features = [
        "Cutting-edge diagnostic equipment and medical imaging",
        "Certified doctors and experienced healthcare specialists",
        "Holistic rehabilitation and recovery programs",
        "24/7 emergency and intensive care support"
    ];

    return (
        <section className="py-20 px-4 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6">
                        Trusted Medical Excellence Through the Years
                    </h2>
                    <p className="max-w-3xl mx-auto text-slate-500 leading-relaxed italic">
                        We are committed to delivering world-class medical care through innovation, compassion, and unwavering dedication to every patient’s wellbeing. Our mission is to ensure accessible, reliable, and personalized healthcare solutions that support long-term recovery and healthier lives.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* Left: Image Mosaic */}
                    <div className="relative grid grid-cols-12 gap-4">
                        {/* Main Large Image */}
                        <div className="col-span-7 relative">
                            <img
                                src="/assesst/lab.png"
                                alt="Medical Laboratory"
                                className="rounded-3xl object-cover h-[450px] w-full shadow-lg"
                            />
                            <div className="absolute top-6 left-6 bg-white/90 backdrop-blur px-4 py-2 rounded-full flex items-center gap-2 shadow-sm border border-slate-100">
                                <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></div>
                                <span className="text-xs font-bold text-slate-700">Trusted HealthCare</span>
                            </div>
                        </div>

                        {/* Two Stacked Images */}
                        <div className="col-span-5 flex flex-col gap-4">
                            <img
                                src="https://media.istockphoto.com/id/184312691/photo/doctor-and-senior-patient-talking-in-hospital-room.jpg?s=612x612&w=0&k=20&c=ON0IPi-7i54z67g9YPZurbxnOfUcmZIaKMtb0gzsRRI="
                                alt="Consultation"
                                className="rounded-3xl object-cover h-[217px] w-full shadow-md"
                            />
                            <img
                                src="https://advinhealthcare.com/wp-content/uploads/2022/12/Modular-Operation-Theatre-1.jpg"
                                alt="Surgery Room"
                                className="rounded-3xl object-cover h-[217px] w-full shadow-md"
                            />
                        </div>
                    </div>

                    {/* Right: Content & Features */}
                    <div className="lg:pl-8">
                        {/* Patient Card Overlay Style */}
                        <div className="bg-white rounded-2xl p-6 shadow-xl border-l-4 border-teal-500 mb-8 relative">
                            <div className="flex gap-4">
                                <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center shrink-0">
                                    <Heart className="w-6 h-6 text-teal-600" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800 text-lg">Personalized Care Approach</h4>
                                    <p className="text-slate-500 text-sm mt-1">
                                        Each treatment strategy is thoughtfully tailored to suit every patient’s unique health requirements and medical background.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Checklist */}
                        <ul className="space-y-4 mb-10">
                            {features.map((item, idx) => (
                                <li key={idx} className="flex items-center gap-3 text-slate-600 font-medium">
                                    <CheckCircle2 className="w-5 h-5 text-teal-500 shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>

                        {/* Stats Row */}
                        <div className="flex gap-12 mb-10 border-t border-slate-100 pt-8">
                            <div>
                                <div className="text-3xl font-bold text-teal-600">98%</div>
                                <div className="text-slate-400 text-xs uppercase tracking-wider mt-1">Patient Satisfaction</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-teal-600">35K+</div>
                                <div className="text-slate-400 text-xs uppercase tracking-wider mt-1">Lives Improved</div>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-wrap gap-4">
                            <Link href="/user/appointmentSelection">
                                <button className="bg-teal-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-teal-700 transition-all flex items-center gap-2 cursor-pointer">
                                    Explore Our Services
                                </button>
                            </Link>
                            <Link href="/user/appointment">
                                <button className="border border-teal-200 text-slate-700 px-6 py-3 rounded-lg font-bold hover:bg-slate-50 transition-all flex items-center gap-2 cursor-pointer">
                                    <Phone className="w-4 h-4 text-teal-500" />
                                    Schedule Consultation
                                </button>
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}