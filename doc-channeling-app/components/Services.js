import React from 'react';
import { Heart, Brain, Bone, Baby, Ribbon, Beaker } from 'lucide-react';

const services = [
    {
        title: "Emergency Care Services",
        desc: "Immediate medical attention for critical and urgent health conditions, available around the clock. Our emergency unit is equipped with advanced facilities and skilled professionals to handle life-threatening situations efficiently.",
        image: "/assesst/Emergency.png",
        icon: <Heart className="w-5 h-5 text-white" />,
    },
    {
        title: "Specialist Consultations",
        desc: "Access to experienced doctors across multiple medical specialties for expert diagnosis and treatment. Patients receive personalized care plans tailored to their specific health needs.",
        image: "/assesst/Consultations.png",
        icon: <Brain className="w-5 h-5 text-white" />,
    },
    {
        title: "Diagnostic & Laboratory Services",
        desc: "Comprehensive testing services including blood work, imaging, and pathology for accurate diagnosis. Modern technology ensures reliable and timely results for better treatment decisions.",
        image: "/assesst/Diagnostic.png",
        icon: <Bone className="w-5 h-5 text-white" />,
    },
    {
        title: "Surgical Procedures",
        desc: "Advanced surgical care ranging from minor procedures to complex operations. Our surgical team uses state-of-the-art equipment to ensure patient safety and successful outcomes.",
        image: "/assesst/Surgical.png",
        icon: <Baby className="w-5 h-5 text-white" />,
    },
    {
        title: "Maternity & Women’s Health",
        desc: "Dedicated care for pregnancy, childbirth, and women’s reproductive health. We provide compassionate support throughout every stage of motherhood and wellness.",
        image: "/assesst/Maternity.png",
        icon: <Ribbon className="w-5 h-5 text-white" />,
    },
    {
        title: "Rehabilitation & Physiotherapy",
        desc: "Specialized programs designed to restore mobility and improve recovery after illness or injury. Our therapists create customized plans to help patients regain strength and independence.",
        image: "/assesst/Rehabilitation.png",
        icon: <Beaker className="w-5 h-5 text-white" />,
    },
];

export default function ServicesSection() {
    return (
        <section className="py-16 px-4 bg-white">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-slate-800 relative inline-block pb-4">
                        Featured Services
                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-cyan-500"></span>
                    </h2>
                    <p className="mt-4 text-slate-500 max-w-2xl mx-auto italic">
                        Excellence in Every Step of Your Health Journey
                    </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <div
                            key={index}
                            className="group bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-100 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                        >
                            {/* Image Container */}
                            <div className="relative h-56 overflow-hidden">
                                <img
                                    src={service.image}
                                    alt={service.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                {/* Floating Icon */}
                                <div className="absolute top-4 right-4 w-10 h-10 bg-cyan-600 rounded-full flex items-center justify-center shadow-md">
                                    {service.icon}
                                </div>
                                {/* Gradient Overlay for text readability */}
                                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-60"></div>
                            </div>

                            {/* Content */}
                            <div className="p-8">
                                <h3 className="text-xl font-bold text-slate-800 mb-3">
                                    {service.title}
                                </h3>
                                <p className="text-slate-500 text-sm leading-relaxed mb-6">
                                    {service.desc}
                                </p>
                                <a
                                    href="#"
                                    className="inline-flex items-center text-cyan-600 font-semibold text-sm hover:text-cyan-700 transition-colors"
                                >
                                    Learn More
                                    <span className="ml-2">→</span>
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}