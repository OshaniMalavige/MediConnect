import React from 'react';
import Link from 'next/link';
import { Phone, Award, Users, MapPin, Calendar, MessageCircle, FileText } from 'lucide-react';

export default function HeroSection() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8 mt-20">
            <div className="max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Side - Image Card */}
                    <div className="relative">
                        <div className="bg-gradient-to-br from-orange-100 via-orange-50 to-blue-50 rounded-3xl overflow-hidden shadow-2xl">
                            <img
                                src="/assesst/coverImage.png"
                                alt="Doctor"
                                className="w-full h-[500px] object-cover"
                            />

                            {/* Emergency Contact Card */}
                            <div className="absolute top-8 left-8 bg-white rounded-2xl shadow-lg p-4 flex items-center gap-3">
                                <div className="bg-teal-500 rounded-full p-3">
                                    <Phone className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">24/7 Emergency</p>
                                    <p className="text-lg font-semibold text-gray-900">+94 777 289 336</p>
                                </div>
                            </div>

                            {/* Stats Card */}
                            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-lg p-6 flex gap-8">
                                <div className="text-center">
                                    <p className="text-3xl font-bold text-teal-600">25K+</p>
                                    <p className="text-sm text-gray-600 mt-1">Patients Treated</p>
                                </div>
                                <div className="w-px bg-gray-200"></div>
                                <div className="text-center">
                                    <p className="text-3xl font-bold text-teal-600">98%</p>
                                    <p className="text-sm text-gray-600 mt-1">Satisfaction Rate</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Content */}
                    <div>
                        <div className="inline-block bg-gradient-to-br from-teal-500 to-indigo-600 text-white px-6 py-2 rounded-full text-sm font-semibold mb-6">
                            YOUR HEALTHCARE PARTNER
                        </div>

                        <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                            Leading the Future of Healthcare
                        </h1>

                        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                            We are committed to providing exceptional medical services with a focus on patient care, trust, and innovation. Our platform connects you with experienced healthcare professionals and reliable laboratory services for a seamless healthcare experience.
                        </p>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-3 gap-6 mb-8">
                            <div className="flex items-start gap-3">
                                <div className="bg-teal-100 rounded-full p-3 flex-shrink-0">
                                    <Award className="w-6 h-6 text-teal-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-900">30+</p>
                                    <p className="text-sm text-gray-600">Years Experience</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="bg-teal-100 rounded-full p-3 flex-shrink-0">
                                    <Users className="w-6 h-6 text-teal-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-900">150+</p>
                                    <p className="text-sm text-gray-600">Medical Specialists</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="bg-teal-100 rounded-full p-3 flex-shrink-0">
                                    <MapPin className="w-6 h-6 text-teal-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-900">12</p>
                                    <p className="text-sm text-gray-600">Clinic Locations</p>
                                </div>
                            </div>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-wrap gap-4 mb-8">
                            <Link href ="/user/appointment">
                                <button className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-4 rounded-xl font-semibold transition-colors shadow-lg shadow-teal-600/30 cursor-pointer">
                                    Schedule Consultation
                                </button>
                            </Link>
                            <button className="bg-white hover:bg-gray-50 text-gray-900 px-8 py-4 rounded-xl font-semibold border-2 border-gray-200 transition-colors flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full border-2 border-gray-400 flex items-center justify-center">
                                    <div className="w-0 h-0 border-l-8 border-l-gray-600 border-t-4 border-t-transparent border-b-4 border-b-transparent ml-0.5"></div>
                                </div>
                                Watch Our Story
                            </button>
                        </div>

                        {/* Quick Links */}
                        <div className="flex flex-wrap gap-6 text-sm">
                            <button className="flex items-center gap-2 text-gray-700 hover:text-teal-600 transition-colors">
                                <Calendar className="w-5 h-5" />
                                <span className="font-medium">Find Available Times</span>
                            </button>
                            <button className="flex items-center gap-2 text-gray-700 hover:text-teal-600 transition-colors">
                                <MessageCircle className="w-5 h-5" />
                                <span className="font-medium">Chat with Support</span>
                            </button>
                            <button className="flex items-center gap-2 text-gray-700 hover:text-teal-600 transition-colors">
                                <FileText className="w-5 h-5" />
                                <span className="font-medium">Patient Portal</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}