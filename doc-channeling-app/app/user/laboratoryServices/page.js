"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    ArrowLeft, Phone, Users, ChevronDown, Calendar,
    CheckCircle2, Download, MapPin
} from 'lucide-react';

const generateWeekDates = () => {
    const today = new Date();
    return Array.from({ length: 7 }, (_, i) => {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        return {
            day: date.toLocaleDateString('en-US', { weekday: 'short' }),
            date: String(date.getDate()).padStart(2, '0'),
            month: date.toLocaleDateString('en-US', { month: 'short' }),
            year: date.getFullYear(),
            fullDate: date,
        };
    });
};

const times = ['06:00 AM', '07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM'];

const LaboratoryServicesPage = () => {
    const dates = generateWeekDates();
    const [labData, setLabData] = useState([]);
    const [selectedTestIds, setSelectedTestIds] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState('');
    const [selectedDate, setSelectedDate] = useState(dates[0].fullDate);
    const [selectedTime, setSelectedTime] = useState('');
    const [mobile, setMobile] = useState('');
    const [patientName, setPatientName] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        const fetchLabData = async () => {
            try {
                const response = await fetch('/api/laboratories');
                const result = await response.json();
                if (result.success) setLabData(result.data);
            } catch (error) { console.error(error); }
        };
        fetchLabData();
    }, []);

    // Filter unique locations - this ensures no duplicate location names appear
    const uniqueLocations = Array.from(new Set(labData.map(item => item.location)));

    const allAvailableTests = labData.flatMap(item =>
        item.tests.map(test => ({ ...test, parentLocation: item.location }))
    );

    const selectedTestsData = allAvailableTests.filter(t => selectedTestIds.includes(t._id));
    const totalPrice = selectedTestsData.reduce((sum, t) => sum + t.price, 0);

    const handleTestToggle = (id) => {
        setSelectedTestIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    // --- FIXED PDF GENERATION ---
    const downloadReceipt = async () => {
        try {
            // Load libraries only when needed
            const { default: jsPDF } = await import('jspdf');
            const { default: autoTable } = await import('jspdf-autotable');

            const doc = new jsPDF();
            const pageWidth = doc.internal.pageSize.getWidth();
            let yPosition = 20;

            // Add logo/header with gradient effect
            doc.setFillColor(20, 184, 166); // teal color
            doc.rect(0, 0, pageWidth, 45, 'F');

            // Company Name
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(26);
            doc.setFont("helvetica", "bold");
            doc.text("MediConnect", pageWidth / 2, 28, { align: "center" });

            // Receipt Title
            doc.setTextColor(0, 0, 0);
            doc.setFontSize(16);
            doc.setFont("helvetica", "bold");
            doc.text("Laboratory Booking Receipt", pageWidth / 2, 55, { align: "center" });

            // Draw separator line
            doc.setDrawColor(220, 220, 220);
            doc.line(20, 62, pageWidth - 20, 62);

            // Patient Information Section
            yPosition = 75;
            doc.setFontSize(11);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(20, 184, 166);
            doc.text("PATIENT INFORMATION", 20, yPosition);

            yPosition += 8;
            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(80, 80, 80);

            // Patient details in two columns
            doc.text(`Patient Name: ${patientName || 'N/A'}`, 20, yPosition);
            doc.text(`Phone Number: ${mobile || 'N/A'}`, pageWidth / 2, yPosition);

            yPosition += 7;
            doc.text(`Location: ${selectedLocation || 'N/A'}`, 20, yPosition);
            doc.text(`Appointment Date: ${selectedDate.toDateString()}`, pageWidth / 2, yPosition);

            yPosition += 7;
            doc.text(`Time: ${selectedTime || 'N/A'}`, 20, yPosition);

            // Draw another separator
            yPosition += 10;
            doc.setDrawColor(220, 220, 220);
            doc.line(20, yPosition, pageWidth - 20, yPosition);

            // Tests Table
            yPosition += 10;
            doc.setFontSize(11);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(20, 184, 166);
            doc.text("TEST DETAILS", 20, yPosition);

            // Prepare table data
            const tableBody = selectedTestsData.map(t => [t.name, `Rs. ${t.price.toLocaleString()}/=`]);

            // Add total row
            tableBody.push([
                { content: 'Total Amount', styles: { fontStyle: 'bold', textColor: [20, 184, 166] } },
                { content: `Rs. ${totalPrice.toLocaleString()}/=`, styles: { fontStyle: 'bold', textColor: [20, 184, 166] } }
            ]);

            // Generate table
            autoTable(doc, {
                startY: yPosition + 5,
                head: [['Test Name', 'Price']],
                body: tableBody,
                theme: 'striped',
                headStyles: {
                    fillColor: [20, 184, 166],
                    textColor: [255, 255, 255],
                    fontStyle: 'bold',
                    fontSize: 10
                },
                styles: {
                    fontSize: 10,
                    cellPadding: 8,
                },
                columnStyles: {
                    0: { cellWidth: 'auto' },
                    1: { cellWidth: 40, halign: 'right' }
                },
                margin: { left: 20, right: 20 }
            });

            // Get final Y position after table
            let finalY = doc.lastAutoTable.finalY + 15;

            // Footer Notes
            doc.setFontSize(9);
            doc.setFont("helvetica", "italic");
            doc.setTextColor(150, 150, 150);

            doc.text("Thank you for choosing MediConnect Laboratory Services.", pageWidth / 2, finalY, { align: "center" });
            finalY += 6;
            doc.text("Please bring this receipt on the day of your appointment.", pageWidth / 2, finalY, { align: "center" });
            finalY += 6;
            doc.text("This is a computer-generated receipt and does not require a signature.", pageWidth / 2, finalY, { align: "center" });

            // Add receipt number at bottom
            const receiptNumber = `LAB-${Date.now()}`;
            doc.setFontSize(8);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(180, 180, 180);
            doc.text(`Receipt No: ${receiptNumber}`, pageWidth - 20, doc.internal.pageSize.getHeight() - 10, { align: "right" });
            doc.text(`Generated on: ${new Date().toLocaleString()}`, pageWidth - 20, doc.internal.pageSize.getHeight() - 15, { align: "right" });

            // Save PDF
            doc.save(`Laboratory_Receipt_${patientName.replace(/\s/g, '_') || 'Lab'}_${new Date().getTime()}.pdf`);

        } catch (err) {
            console.error("PDF Generation failed", err);
            alert("Could not generate PDF. Please check console for errors.");
        }
    };

    const handleBooking = async () => {
        if (!selectedLocation || selectedTestIds.length === 0 || !mobile) {
            alert("Please complete all fields");
            return;
        }
        setLoading(true);
        try {
            const response = await fetch('/api/labBooking', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    testIds: selectedTestIds,
                    tests: selectedTestsData.map(t => ({ name: t.name, price: t.price })),
                    patientName, totalPrice, location: selectedLocation,
                    date: selectedDate, time: selectedTime, mobile,
                }),
            });
            const res = await response.json();
            if (res.success) setIsModalOpen(true);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F0F7FF] flex items-center justify-center p-4 font-sans">
            <div className="bg-white w-full max-w-6xl rounded-xl shadow-md border border-slate-100 flex flex-col md:flex-row overflow-hidden">

                {/* Form Section */}
                <div className="flex-1 p-6 md:p-10 border-r border-slate-100">
                    <header className="flex items-center gap-4 mb-8">
                        <Link href='/user/appointmentSelection' className="p-3 bg-white rounded-full shadow-md text-teal-600 border border-slate-100">
                            <ArrowLeft size={20} />
                        </Link>
                        <h1 className="text-2xl font-bold text-teal-600">Laboratory Services</h1>
                    </header>

                    {/* 1. Multi-Select Dropdown */}
                    <section className="mb-8 relative">
                        <h2 className="text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">1. Select Tests</h2>
                        <div
                            className="w-full max-w-md p-3 border border-slate-200 rounded-lg flex justify-between items-center cursor-pointer bg-white"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        >
                            <span className="text-sm text-slate-600">
                                {selectedTestIds.length > 0 ? `${selectedTestIds.length} Tests Selected` : "Click to choose tests..."}
                            </span>
                            <ChevronDown size={18} className={`text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                        </div>

                        {isDropdownOpen && (
                            <div className="absolute z-20 mt-1 w-full max-w-md bg-white border border-slate-200 rounded-lg shadow-2xl max-h-60 overflow-y-auto">
                                {allAvailableTests.map((test) => (
                                    <div
                                        key={test._id}
                                        className="flex items-center gap-3 p-3 hover:bg-teal-50 cursor-pointer border-b last:border-0"
                                        onClick={() => handleTestToggle(test._id)}
                                    >
                                        <input type="checkbox" checked={selectedTestIds.includes(test._id)} readOnly className="w-4 h-4 accent-teal-600" />
                                        <div className="flex justify-between w-full text-sm">
                                            <span className="font-medium text-slate-700">{test.name}</span>
                                            <span className="font-bold text-teal-600">Rs.{test.price}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* 2. Select Location - Now showing unique locations only */}
                    <section className="mb-8">
                        <h2 className="text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">2. Select Location</h2>
                        <div className="relative max-w-md">
                            <select
                                value={selectedLocation}
                                onChange={(e) => setSelectedLocation(e.target.value)}
                                className="w-full appearance-none bg-white border border-slate-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-teal-500"
                            >
                                <option value="">Choose a Location</option>
                                {uniqueLocations.map((loc, index) => (
                                    <option key={`${loc}-${index}`} value={loc}>{loc}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                        </div>
                    </section>

                    {/* 3 & 4. Date and Time */}
                    <div className="grid gap-6 mb-2">
                        <section>
                            <h2 className="text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">3. Date</h2>
                            <div className="flex gap-2 overflow-x-auto pb-2">
                                {dates.map((item) => (
                                    <button key={item.date} onClick={() => setSelectedDate(item.fullDate)} className={`flex flex-col items-center min-w-[60px] py-2 rounded-lg border ${selectedDate?.toDateString() === item.fullDate.toDateString() ? 'bg-teal-600 border-teal-600 text-white' : 'bg-white text-slate-500'}`}>
                                        <span className="text-[10px] font-bold uppercase">{item.day}</span>
                                        <span className="text-lg font-bold">{item.date}</span>
                                    </button>
                                ))}
                            </div>
                        </section>
                    </div>

                    <div className="grid gap-6 mb-2">
                        <section>
                            <h2 className="text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">4. Time</h2>
                            <div className="grid grid-cols-4 gap-2">
                                {times.map((t) => (
                                    <button key={t} onClick={() => setSelectedTime(t)} className={`py-2 text-[11px] font-bold rounded border ${selectedTime === t ? 'bg-teal-600 border-teal-600 text-white' : 'bg-white text-slate-600'}`}>{t}</button>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* 5. Patient Details */}
                    <section className="pt-6 border-t border-slate-100">
                        <h2 className="text-sm font-bold text-slate-700 mb-4 uppercase tracking-wide">5. Patient Details</h2>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1">
                                <label className="text-[11px] font-bold text-slate-500 flex items-center gap-1 mb-1"><Users size={12}/> PATIENT NAME</label>
                                <input type="text" value={patientName} onChange={(e) => setPatientName(e.target.value)} className="w-full p-3 border border-slate-200 rounded-lg text-sm outline-none focus:border-teal-500" placeholder="Enter full name" />
                            </div>
                            <div className="flex-1">
                                <label className="text-[11px] font-bold text-slate-500 flex items-center gap-1 mb-1"><Phone size={12}/> MOBILE NUMBER</label>
                                <input type="text" value={mobile} onChange={(e) => setMobile(e.target.value)} className="w-full p-3 border border-slate-200 rounded-lg text-sm outline-none focus:border-teal-500" placeholder="07XXXXXXXX" />
                            </div>
                        </div>
                    </section>
                </div>

                {/* Sidebar */}
                <aside className="w-full md:w-[380px] bg-slate-50 p-6 md:p-8 flex flex-col gap-6">
                    <h2 className="text-lg font-bold text-white bg-teal-600 p-2 rounded text-center">Booking Details</h2>
                    <div className="space-y-5">
                        <div>
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Selected Tests</span>
                            {selectedTestsData.length > 0 ? (
                                <div className="space-y-2">
                                    {selectedTestsData.map(t => (
                                        <div key={t._id} className="flex justify-between items-start text-sm">
                                            <span className="text-slate-700 font-medium">{t.name}</span>
                                            <span className="font-bold text-slate-900">Rs.{t.price}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : <p className="text-xs italic text-slate-400">No tests added yet</p>}
                        </div>
                        <div className="pt-4 border-t border-slate-200">
                            <span className="text-[11px] font-bold text-slate-400 uppercase block mb-1">Center</span>
                            <div className="flex items-center gap-2 text-sm font-bold text-teal-700 uppercase">
                                <MapPin size={14} /> {selectedLocation || "Not Selected"}
                            </div>
                        </div>
                        <div className="pt-6 border-t border-slate-200 flex justify-between items-center">
                            <span className="font-bold text-slate-800">Total</span>
                            <span className="text-2xl font-black text-teal-600">Rs.{totalPrice}/-</span>
                        </div>
                        <button
                            disabled={selectedTestIds.length === 0 || !selectedLocation || loading}
                            onClick={handleBooking}
                            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 rounded-xl shadow-lg disabled:opacity-50 transition-all"
                        >
                            {loading ? "Processing..." : "Confirm & Pay"}
                        </button>
                    </div>
                </aside>
            </div>

            {/* Success Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl relative">
                        <div className="w-20 h-20 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 size={40} />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-800 mb-2">Confirmed!</h3>
                        <p className="text-slate-500 text-sm mb-8">Appointment scheduled. Download your receipt below.</p>
                        <div className="space-y-3">
                            <button onClick={downloadReceipt} className="w-full bg-teal-600 text-white font-bold py-3.5 rounded-2xl hover:bg-teal-700 flex items-center justify-center gap-2">
                                <Download size={20} /> Download Receipt (PDF)
                            </button>
                            <button onClick={() => window.location.href = '/user/home'} className="w-full text-slate-400 text-sm font-bold py-2">
                                Return to Home
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LaboratoryServicesPage;