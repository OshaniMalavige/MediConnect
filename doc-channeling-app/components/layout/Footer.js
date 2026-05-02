import React from 'react';
import Link from 'next/link';
import {
    Facebook,
    Twitter,
    Linkedin,
    Instagram,
    MapPin,
    Mail,
    Phone
} from 'lucide-react';

const Footer = () => {
    // Automatically updates the year
    const currentYear = new Date().getFullYear();

    return (
        <footer className="w-full bg-white border-t border-slate-100 pt-16 pb-8 px-6 shadow-md">
            <div className="max-w-7xl mx-auto">
                {/* Main Grid Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

                    {/* Column 1: Brand Info */}
                    <div className="flex flex-col gap-6">
                        <div className="flex items-center gap-2">
                            <span className="text-xl font-bold bg-gradient-to-br from-teal-500 to-indigo-600 bg-clip-text text-transparent tracking-tight">MediConnect</span>
                        </div>
                        <p className="text-slate-500 text-sm leading-relaxed max-w-[280px]">
                            We are committed to providing exceptional medical services with a focus on patient care, trust, and innovation.
                        </p>
                        <div className="flex items-center gap-5 text-slate-400">
                            <Link href="#" className="hover:text-teal-800 text-teal-600 transition-colors"><Facebook size={18} /></Link>
                            <Link href="#" className="hover:text-teal-800 text-teal-600 transition-colors"><Twitter size={18} /></Link>
                            <Link href="#" className="hover:text-teal-800 text-teal-600 transition-colors"><Linkedin size={18} /></Link>
                            <Link href="#" className="hover:text-teal-800 text-teal-600 transition-colors"><Instagram size={18} /></Link>
                        </div>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div>
                        <h4 className="font-bold text-slate-900 mb-6">Quick Links</h4>
                        <ul className="flex flex-col gap-4 text-sm text-slate-500">
                            <li><Link href="#" className="hover:text-teal-600 transition-colors">Home</Link></li>
                            <li><Link href="#" className="hover:text-teal-600 transition-colors">About</Link></li>
                            <li><Link href="#" className="hover:text-teal-600 transition-colors">Services</Link></li>
                            <li><Link href="#" className="hover:text-teal-600 transition-colors">Categories</Link></li>
                            <li><Link href="#" className="hover:text-teal-600 transition-colors">Call To Action</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Our Services */}
                    <div>
                        <h4 className="font-bold text-slate-900 mb-6">Our Services</h4>
                        <ul className="flex flex-col gap-4 text-sm text-slate-500">
                            <li><Link href="#" className="hover:text-teal-600 transition-colors">Emergency Care Services</Link></li>
                            <li><Link href="#" className="hover:text-teal-600 transition-colors">Specialist Consultations</Link></li>
                            <li><Link href="#" className="hover:text-teal-600 transition-colors">Diagnostic & Laboratory Services</Link></li>
                            <li><Link href="#" className="hover:text-teal-600 transition-colors">Surgical Procedures</Link></li>
                            <li><Link href="#" className="hover:text-teal-600 transition-colors">Laboratory Services</Link></li>
                            <li><Link href="#" className="hover:text-teal-600 transition-colors">Pharmacy Services</Link></li>
                        </ul>
                    </div>

                    {/* Column 4: Contact Us */}
                    <div>
                        <h4 className="font-bold text-slate-900 mb-6">Contact Us</h4>
                        <ul className="flex flex-col gap-5 text-sm text-slate-500">
                            <li className="flex items-start gap-3">
                                <MapPin size={18} className="text-teal-600 shrink-0 mt-0.5" />
                                <span>201 Albion Place<br />Baseline Road, Colombo 09</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail size={18} className="text-teal-600 shrink-0" />
                                <Link href="/" className="hover:text-teal-600 transition-colors">
                                    info@mediconnect.com
                                </Link>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone size={18} className="text-teal-600 shrink-0" />
                                <span>+94 777 289 336</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Copyright Section */}
                <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-[12px] text-slate-400">
                        © {currentYear} MediConnect. All rights reserved.
                    </p>
                    <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[12px] text-slate-400">
                        <Link href="#" className="hover:text-slate-900 transition-colors">Terms of Service</Link>
                        <Link href="#" className="hover:text-slate-900 transition-colors">Privacy Policy</Link>
                        <Link href="#" className="hover:text-slate-900 transition-colors">Cookie Policy</Link>
                        <Link href="#" className="hover:text-slate-900 transition-colors">Sitemap</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;