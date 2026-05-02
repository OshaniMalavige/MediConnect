"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronDown, House, MapPin, ArrowLeft, X, Download, Calendar, Clock, User, Phone, FileText, MapPin as MapPinIcon } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import { format, isBefore, startOfToday } from 'date-fns';
import 'react-day-picker/dist/style.css';
import notification from "@/components/alerts/alerts";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const AppointmentForm = () => {
    const router = useRouter();
    const [allDoctors, setAllDoctors] = useState([]);
    const [categories, setCategories] = useState([]);
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const [slotData, setSlotData] = useState({ patientNo: 1, time: "09:00 AM" });
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedDoctor, setSelectedDoctor] = useState("");
    const [selectedLocation, setSelectedLocation] = useState("");
    const [availableLocations, setAvailableLocations] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        nicPassport: "",
        email: ""
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    // Modal states
    const [showModal, setShowModal] = useState(false);
    const [appointmentDetails, setAppointmentDetails] = useState(null);

    // Validation Logic
    const validateForm = () => {
        let newErrors = {};

        const nic = formData.nicPassport.trim();

        const nicRegex = /^([0-9]{9}[vVxX]|[0-9]{12})$/;
        const passportRegex = /^[A-Za-z]{1,2}[0-9]{6,7}$/;

        if (!nicRegex.test(nic) && !passportRegex.test(nic)) {
            newErrors.nicPassport = "Invalid NIC or Passport format";
        }

        // Phone (10 digits)
        const phoneRegex = /^(?:0|94|\+94)?7(0|1|2|4|5|6|7|8)\d{7}$/;
        if (!phoneRegex.test(formData.phone)) {
            newErrors.phone = "Invalid phone number (e.g., 0771234567)";
        }

        // Email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (formData.email && !emailRegex.test(formData.email)) {
            newErrors.email = "Invalid email address";
        }

        if (!formData.fullName.trim()) newErrors.fullName = "Name is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await fetch('/api/doctors');
                const result = await response.json();
                if (result.success) {
                    setAllDoctors(result.data);
                    const uniqueCategories = [...new Set(result.data.map((doc) => doc.category))];
                    setCategories(uniqueCategories);
                }
            } catch (error) {
                console.error("Error:", error);
            }
        };
        fetchDoctors();
    }, []);

    useEffect(() => {
        if (selectedCategory) {
            setFilteredDoctors(allDoctors.filter(doc => doc.category === selectedCategory));
            setSelectedDoctor("");
            setSelectedLocation("");
            setAvailableLocations([]);
        }
    }, [selectedCategory, allDoctors]);

    useEffect(() => {
        if (selectedDoctor) {
            const doctor = allDoctors.find(d => d._id === selectedDoctor);
            if (doctor && doctor.availability?.length > 0) {
                const uniqueLocations = [...new Set(doctor.availability.map(slot => slot.location).filter(Boolean))];
                setAvailableLocations(uniqueLocations);
                setSelectedLocation(uniqueLocations.length === 1 ? uniqueLocations[0] : "");
            }
        }
    }, [selectedDoctor, allDoctors]);

    useEffect(() => {
        if (selectedDoctor && selectedDate) {
            const fetchSlot = async () => {
                const dateParam = format(selectedDate, 'yyyy-MM-dd');
                const res = await fetch(`/api/appointments/nextSlot?doctorId=${selectedDoctor}&date=${dateParam}`);
                const data = await res.json();
                if (data.success) {
                    setSlotData({ patientNo: data.patientNo, time: data.time });
                }
            };
            fetchSlot();
        }
    }, [selectedDoctor, selectedDate]);

    const activeDoctorData = allDoctors.find(d => d._id === selectedDoctor);
    const filteredAvailability = activeDoctorData?.availability?.filter(
        slot => !selectedLocation || slot.location === selectedLocation
    ) ?? [];

    const isDateDisabled = (date) => {
        const isPast = isBefore(date, startOfToday());
        if (isPast) return true;
        if (activeDoctorData && filteredAvailability.length > 0) {
            const dayName = format(date, 'EEEE');
            return !filteredAvailability.some(slot => slot.day === dayName);
        }
        return activeDoctorData && !selectedLocation && availableLocations.length > 1;
    };

    // Generate PDF Receipt
    const generatePDFReceipt = (appointment) => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();

        // Add logo/header
        doc.setFillColor(20, 184, 166); // teal color
        doc.rect(0, 0, pageWidth, 40, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.setFont("helvetica", "bold");
        doc.text("MediConnect", pageWidth / 2, 25, { align: "center" });

        doc.setTextColor(0, 0, 0);
        doc.setFontSize(18);
        doc.setFont("helvetica", "bold");
        doc.text("Appointment Confirmation", pageWidth / 2, 55, { align: "center" });

        // Receipt info
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(`Receipt No: APT-${appointment.appointmentNumber || Date.now()}`, 20, 70);
        doc.text(`Date: ${format(new Date(), 'dd/MM/yyyy hh:mm a')}`, pageWidth - 50, 70);

        // Draw line
        doc.setDrawColor(200, 200, 200);
        doc.line(20, 78, pageWidth - 20, 78);

        // Patient Details
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(20, 184, 166);
        doc.text("Patient Information", 20, 92);

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(0, 0, 0);

        const patientData = [
            ["Full Name", appointment.fullName],
            ["Phone Number", appointment.phone],
            ["NIC/Passport", appointment.nicPassport],
            ["Email", appointment.email || "N/A"]
        ];

        autoTable(doc, {
            startY: 98,
            head: [],
            body: patientData,
            theme: 'plain',
            styles: { fontSize: 10, cellPadding: 3 },
            columnStyles: {
                0: { fontStyle: 'bold', textColor: [80, 80, 80] },
                1: { textColor: [0, 0, 0] }
            },
            margin: { left: 20 }
        });

        // Get the final Y position after the first table
        let finalY = doc.lastAutoTable.finalY + 10;

        // Appointment Details
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(20, 184, 166);
        doc.text("Appointment Details", 20, finalY);

        finalY += 6;

        const appointmentData = [
            ["Doctor", appointment.doctorName],
            ["Specialization", appointment.category],
            ["Location", appointment.location],
            ["Date", format(new Date(appointment.date), 'dd/MM/yyyy')],
            ["Time", appointment.time],
            ["Patient Number", `#${String(appointment.patientNo).padStart(2, '0')}`]
        ];

        autoTable(doc, {
            startY: finalY,
            head: [],
            body: appointmentData,
            theme: 'plain',
            styles: { fontSize: 10, cellPadding: 3 },
            columnStyles: {
                0: { fontStyle: 'bold', textColor: [80, 80, 80] },
                1: { textColor: [0, 0, 0] }
            },
            margin: { left: 20 }
        });

        finalY = doc.lastAutoTable.finalY + 15;

        // Footer message
        doc.setFontSize(9);
        doc.setTextColor(150, 150, 150);
        doc.text("Thank you for choosing MediConnect. Please arrive 15 minutes before your appointment time.",
            pageWidth / 2, finalY, { align: "center" });

        doc.text("This is a computer-generated receipt and does not require a signature.",
            pageWidth / 2, finalY + 6, { align: "center" });

        // Save PDF
        doc.save(`Appointment_${appointment.fullName.replace(/\s/g, '_')}_${format(new Date(appointment.date), 'dd-MM-yyyy')}.pdf`);
    };

    const handleBooking = async () => {
        if (!validateForm()) return;
        if (!selectedDoctor || !selectedLocation) {
            notification.warning("Please select a doctor and location.");
            return;
        }

        setLoading(true);
        try {
            const dateStr = format(selectedDate, 'yyyy-MM-dd');
            const doctor = allDoctors.find(d => d._id === selectedDoctor);

            const appointmentData = {
                ...formData,
                doctorId: selectedDoctor,
                doctorName: doctor?.doctorName,
                category: doctor?.category,
                date: dateStr,
                appointmentDate: dateStr,
                appointmentTime: slotData.time,
                patientNo: slotData.patientNo,
                appointmentLocation: selectedLocation,
                location: selectedLocation,
                time: slotData.time,
            };

            const response = await fetch('/api/appointments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(appointmentData),
            });

            const result = await response.json();

            if (result.success) {
                // Set appointment details for modal
                setAppointmentDetails({
                    ...appointmentData,
                    appointmentNumber: result.appointmentNumber,
                    _id: result.appointmentId
                });
                setShowModal(true);
            } else {
                notification.error("Error: " + result.error);
            }
        } catch (err) {
            notification.error("Failed to connect to the server.");
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadReceipt = () => {
        if (appointmentDetails) {
            generatePDFReceipt(appointmentDetails);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        router.push('/user/home');
    };

    return (
        <section className="py-10 bg-slate-50 min-h-screen">
            <div className="max-w-6xl mx-auto px-4">

                {/* Navigation and Heading Section */}
                <div className="mb-8">
                    <div className="flex justify-between items-center w-full">
                        <Link
                            href="/"
                            className="p-3 bg-white rounded-full shadow-md hover:bg-slate-50 transition-all text-teal-600 border border-slate-100"
                        >
                            <House size={24} />
                        </Link>

                        <h2 className="text-2xl md:text-3xl font-bold text-teal-600 text-center tracking-wide">
                            Book an Appointment
                        </h2>

                        <Link
                            href="/user/appointmentSelection"
                            className="p-3 bg-white rounded-full shadow-md hover:bg-slate-50 transition-all text-teal-600 border border-slate-100"
                        >
                            <ArrowLeft size={24} />
                        </Link>
                    </div>
                </div>

                <div className="bg-white shadow-2xl rounded-2xl p-8 grid grid-cols-1 lg:grid-cols-2 gap-12">

                    {/* Left Column: Selection */}
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-600">1. Specialization</label>
                            <div className="relative">
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-700 focus:ring-2 focus:ring-teal-500 outline-none"
                                >
                                    <option value="">Select Category</option>
                                    {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-600">2. Choose Doctor</label>
                            <div className="relative">
                                <select
                                    value={selectedDoctor}
                                    onChange={(e) => setSelectedDoctor(e.target.value)}
                                    disabled={!selectedCategory}
                                    className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 disabled:opacity-50 outline-none focus:ring-2 focus:ring-teal-500"
                                >
                                    <option value="">{selectedCategory ? "Select Doctor" : "Choose a category first"}</option>
                                    {filteredDoctors.map((doc) => <option key={doc._id} value={doc._id}>{doc.doctorName}</option>)}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                            </div>
                        </div>

                        {selectedDoctor && (
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-teal-600 flex items-center gap-1">
                                    <MapPin size={16} /> Select Hospital/Location
                                </label>
                                <div className="relative">
                                    <select
                                        value={selectedLocation}
                                        onChange={(e) => {
                                            setSelectedLocation(e.target.value);
                                            setSelectedDate(new Date());
                                        }}
                                        className="w-full appearance-none bg-teal-50 border border-teal-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500"
                                    >
                                        <option value="">Select Location</option>
                                        {availableLocations.map((loc) => <option key={loc} value={loc}>{loc}</option>)}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-teal-400 pointer-events-none" />
                                </div>
                            </div>
                        )}

                        <div className="pt-4">
                            <label className="text-sm font-bold text-slate-600 mb-2 block">3. Select Date</label>
                            <div className="border rounded-xl overflow-hidden shadow-md bg-white">
                                <div className="bg-teal-600 p-4 text-white text-center">
                                    <p className="text-lg font-semibold">{format(selectedDate, 'EEEE, MMM dd')}</p>
                                </div>
                                <div className="p-2 flex justify-center">
                                    <DayPicker
                                        mode="single"
                                        selected={selectedDate}
                                        onSelect={(date) => date && setSelectedDate(date)}
                                        disabled={isDateDisabled}
                                        modifiersStyles={{
                                            selected: { backgroundColor: '#14b8a6', color: 'white' }
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Patient Info */}
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-4 bg-white rounded-xl shadow-sm border-t-4 border-teal-500">
                                <p className="text-xs text-slate-500 font-bold uppercase">Patient No</p>
                                <p className="text-3xl font-black text-slate-800">{String(slotData.patientNo).padStart(2, '0')}</p>
                            </div>
                            <div className="text-center p-4 bg-white rounded-xl shadow-sm border-t-4 border-teal-500">
                                <p className="text-xs text-slate-500 font-bold uppercase">Time Slot</p>
                                <p className="text-xl font-black text-slate-800">{slotData.time}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {[
                                { label: 'Full Name', key: 'fullName', type: 'text', placeholder: 'John Doe' },
                                { label: 'Phone Number', key: 'phone', type: 'tel', placeholder: '0771234567' },
                                { label: 'NIC / Passport', key: 'nicPassport', type: 'text', placeholder: '199512345678 or 951234567V' },
                                { label: 'Email Address', key: 'email', type: 'email', placeholder: 'john@example.com' }
                            ].map((field) => (
                                <div key={field.key} className="flex flex-col gap-1">
                                    <label className="text-xs font-bold text-slate-700 ml-1">{field.label}</label>
                                    <input
                                        type={field.type}
                                        placeholder={field.placeholder}
                                        value={formData[field.key]}
                                        onChange={(e) => {
                                            setFormData({...formData, [field.key]: e.target.value});
                                            if (errors[field.key]) setErrors({...errors, [field.key]: ""});
                                        }}
                                        className={`w-full border-b-2 bg-transparent py-2 px-1 focus:outline-none transition-colors ${
                                            errors[field.key] ? 'border-red-500' : 'border-slate-300 focus:border-teal-500'
                                        }`}
                                    />
                                    {errors[field.key] && <span className="text-[10px] text-red-500 font-medium">{errors[field.key]}</span>}
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={handleBooking}
                            disabled={!selectedLocation || loading}
                            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                        >
                            {loading ? "Processing..." : "Confirm Appointment"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Success Modal */}
            {showModal && appointmentDetails && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex min-h-screen items-center justify-center p-4">
                        {/* Backdrop */}
                        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={handleCloseModal}></div>

                        {/* Modal */}
                        <div className="relative bg-white rounded-2xl shadow-xl max-w-2xl w-full mx-auto transform transition-all">
                            {/* Header */}
                            <div className="bg-gradient-to-r from-teal-600 to-teal-500 rounded-t-2xl p-6 text-white">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="text-2xl font-bold">Appointment Confirmed!</h3>
                                        <p className="text-teal-100 mt-1">Your appointment has been successfully booked</p>
                                    </div>
                                    <button
                                        onClick={handleCloseModal}
                                        className="p-2 hover:bg-teal-700 rounded-lg transition-colors"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 space-y-6">
                                {/* Success Icon */}
                                <div className="flex justify-center">
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                    </div>
                                </div>

                                {/* Appointment Details Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-slate-50 rounded-lg p-4">
                                        <div className="flex items-center gap-2 text-teal-600 mb-2">
                                            <User size={18} />
                                            <span className="text-sm font-bold">Patient Details</span>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm"><strong>Name:</strong> {appointmentDetails.fullName}</p>
                                            <p className="text-sm"><strong>Phone:</strong> {appointmentDetails.phone}</p>
                                            <p className="text-sm"><strong>NIC/Passport:</strong> {appointmentDetails.nicPassport}</p>
                                            {appointmentDetails.email && <p className="text-sm"><strong>Email:</strong> {appointmentDetails.email}</p>}
                                        </div>
                                    </div>

                                    <div className="bg-slate-50 rounded-lg p-4">
                                        <div className="flex items-center gap-2 text-teal-600 mb-2">
                                            <FileText size={18} />
                                            <span className="text-sm font-bold">Appointment Details</span>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm"><strong>Doctor:</strong> {appointmentDetails.doctorName}</p>
                                            <p className="text-sm"><strong>Specialization:</strong> {appointmentDetails.category}</p>
                                            <p className="text-sm"><strong>Patient No:</strong> #{String(appointmentDetails.patientNo).padStart(2, '0')}</p>
                                        </div>
                                    </div>

                                    <div className="bg-slate-50 rounded-lg p-4">
                                        <div className="flex items-center gap-2 text-teal-600 mb-2">
                                            <Calendar size={18} />
                                            <span className="text-sm font-bold">Date & Time</span>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm"><strong>Date:</strong> {format(new Date(appointmentDetails.date), 'dd/MM/yyyy')}</p>
                                            <p className="text-sm"><strong>Time:</strong> {appointmentDetails.time}</p>
                                        </div>
                                    </div>

                                    <div className="bg-slate-50 rounded-lg p-4">
                                        <div className="flex items-center gap-2 text-teal-600 mb-2">
                                            <MapPinIcon size={18} />
                                            <span className="text-sm font-bold">Location</span>
                                        </div>
                                        <p className="text-sm">{appointmentDetails.location}</p>
                                    </div>
                                </div>

                                {/* Important Notes */}
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <h4 className="text-sm font-bold text-blue-900 mb-2">Important Notes:</h4>
                                    <ul className="text-xs text-blue-800 space-y-1">
                                        <li>• Please arrive 15 minutes before your appointment time</li>
                                        <li>• For rescheduling, please contact at least 24 hours in advance</li>
                                    </ul>
                                </div>
                            </div>

                            {/* Footer Buttons */}
                            <div className="border-t border-slate-100 p-6 flex flex-col sm:flex-row gap-3">
                                <button
                                    onClick={handleDownloadReceipt}
                                    className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2"
                                >
                                    <Download size={18} />
                                    Download Receipt (PDF)
                                </button>
                                <button
                                    onClick={handleCloseModal}
                                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-4 rounded-xl transition-all"
                                >
                                    Return to Home
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default AppointmentForm;