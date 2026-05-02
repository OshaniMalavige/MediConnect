import React from 'react';
import {
    Brain,
    Venus,
    Heart,
    Baby,
    Stethoscope,
    HandHeart,
    HeartPulse, Eye, Activity
} from 'lucide-react';

const categories = [
    {
        title: "General Physician",
        desc: "Provides primary healthcare services, diagnoses common illnesses, and offers preventive medical advice.",
        icon: <Stethoscope className="w-6 h-6 text-teal-600" />,
    },
    {
        title: "Pediatrician",
        desc: "Specializes in the health and medical care of infants, children, and adolescents..",
        icon: <Baby className="w-6 h-6 text-teal-600" />,
    },
    {
        title: "Cardiologist",
        desc: "Diagnoses and treats heart-related conditions to ensure optimal cardiovascular health..",
        icon: <Heart className="w-6 h-6 text-teal-600" />,
    },
    {
        title: "Dermatologist",
        desc: "Focuses on skin, hair, and nail disorders while promoting healthy skin care.",
        icon: <HandHeart className="w-6 h-6 text-teal-600" />,
    },
    {
        title: "Oncologist",
        desc: "Provides expert care in the diagnosis and treatment of cancer patients.",
        icon: <HeartPulse className="w-6 h-6 text-teal-600" />,
    },
    {
        title: "Neurologist",
        desc: "Specializes in disorders of the brain, spinal cord, and nervous system.",
        icon: <Brain className="w-6 h-6 text-teal-600" />,
    },
    {
        title: "Gynecologist",
        desc: "Offers medical care for women’s reproductive health and wellness needs.",
        icon: <Venus className="w-6 h-6 text-teal-600" />,
    },
    {
        title: "Ophthalmologist",
        desc: "Specializes in eye care and surgeries.",
        icon: <Eye className="w-6 h-6 text-teal-600" />,
    },
    {
        title: "Radiologist",
        desc: "Uses advanced imaging techniques to diagnose and guide treatment for various conditions..",
        icon: <Activity className="w-6 h-6 text-teal-600" />,
    }
];

export default function CategoriesSection() {
    return (
        <section className="py-24 bg-slate-50">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-slate-800 relative inline-block pb-4">
                        Categories
                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-cyan-500"></span>
                    </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
                    {categories.map((cat, index) => (
                        <div key={index} className="flex flex-col items-center text-center group shadow-lg bg-white pt-6">
                            {/* Icon Circle */}
                            <div className="w-16 h-16 rounded-full bg-teal-50 flex items-center justify-center mb-6 transition-colors group-hover:bg-teal-100">
                                {cat.icon}
                            </div>

                            {/* Text Content */}
                            <h3 className="text-2xl font-bold text-slate-800 mb-4 tracking-tight">
                                {cat.title}
                            </h3>
                            <p className="text-slate-500 text-sm leading-relaxed mb-8 px-4">
                                {cat.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}