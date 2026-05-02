"use client";
import { useState, useEffect } from "react";
import { AppointmentsChart } from "@/components/charts/AppointmentsChart";
import { TreatmentsChart } from "@/components/charts/TreatmentsChart";
import { Phone, Mail, Activity, Loader2, Beaker, ChevronRight } from "lucide-react";

export default function Dashboard() {
    const [userName, setUserName] = useState("Doctor");
    const [data, setData] = useState({
        totalPatients: 0,
        consultations: 0,
        doctors: [],
        labServices: [],
        totalLabServicesCount: 0,
        latestPatient: null,
        appointments: [],
        loading: true
    });

    useEffect(() => {
        // 1. Get the 'user' string from localStorage
        const storedUser = localStorage.getItem("user");

        if (storedUser) {
            try {
                // 2. Parse the string into a JSON object
                const userData = JSON.parse(storedUser);

                // 3. Set the name (using the 'fullName' property from your screenshot)
                if (userData.fullName) {
                    setUserName(userData.fullName);
                }
            } catch (error) {
                console.error("Error parsing user data from localStorage", error);
            }
        }
    }, []);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [docsRes, appsRes, usersRes, labRes] = await Promise.all([
                    fetch('/api/doctors').then(res => res.json()),
                    fetch('/api/appointments').then(res => res.json()),
                    fetch('/api/users').then(res => res.json()),
                    fetch('/api/laboratory').then(res => res.json())
                ]);

                // FIX: Get all lab services from ALL laboratories
                let allLabServices = [];

                if (labRes.data && Array.isArray(labRes.data)) {
                    // Loop through all laboratories and collect their tests
                    labRes.data.forEach(laboratory => {
                        if (laboratory.tests && Array.isArray(laboratory.tests)) {
                            allLabServices = [...allLabServices, ...laboratory.tests];
                        }
                    });
                }

                console.log('Total lab services found:', allLabServices.length); // Debug log
                console.log('Lab services:', allLabServices); // Debug log

                setData({
                    doctors: docsRes.data || [],
                    appointments: appsRes.data || [],
                    consultations: appsRes.data?.length || 0,
                    totalPatients: usersRes.data?.length || 0,
                    latestPatient: usersRes.data?.[0] || null,
                    labServices: allLabServices,
                    totalLabServicesCount: allLabServices.length,
                    loading: false
                });
            } catch (error) {
                console.error("Data Fetch Error:", error);
                setData(prev => ({ ...prev, loading: false }));
            }
        };
        fetchDashboardData();
    }, []);

    if (data.loading) {
        return (
            <div className="h-96 w-full flex items-center justify-center">
                <Loader2 className="animate-spin text-blue-600" size={40} />
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-10">
            {/* 1. HEADER */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 font-jakarta">Welcome back, {userName}!</h1>
                    <p className="text-slate-500 text-sm">You have {data.appointments.length} appointments in the system.</p>
                </div>
            </div>

            {/* 2. STAT CARDS - Updated Procedure card to show total lab services count */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Patients" value={data.totalPatients} trend="+6.2%" color="bg-blue-600" />
                <StatCard title="Consultation" value={data.consultations} trend="+14.5%" color="bg-cyan-500" />
                <StatCard title="Lab Services" value={data.totalLabServicesCount} trend="+8.3%" color="bg-indigo-600" />
                <StatCard title="Payment" value="LKR 28,704" trend="+12.2%" color="bg-purple-600" />
            </div>

            {/* 3. CHARTS */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 bg-white p-6 rounded-[24px] shadow-sm border border-slate-100">
                    <h3 className="font-bold text-slate-800 mb-6">Appointments</h3>
                    <div className="h-[300px]">
                        <AppointmentsChart rawData={data.appointments} />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-[24px] shadow-sm border border-slate-100">
                    <h3 className="font-bold text-slate-800 mb-6">Top Treatments</h3>
                    <div className="h-[300px]">
                        <TreatmentsChart />
                    </div>
                </div>
            </div>

            {/* 4. BOTTOM GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                {/* Patient Details */}
                <div className="bg-white p-6 rounded-[24px] shadow-sm border border-slate-100">
                    <h3 className="font-bold text-slate-800 mb-6">Patient Details</h3>
                    {data.latestPatient ? (
                        <div className="flex flex-col items-center text-center">
                            <div className="w-20 h-20 rounded-full bg-blue-50 mb-3 overflow-hidden border-4 border-white shadow-sm">
                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${data.latestPatient.fullName}`} alt="patient" />
                            </div>
                            <h4 className="font-bold text-lg">{data.latestPatient.fullName}</h4>
                            <p className="text-slate-400 text-sm">ID: {data.latestPatient._id.slice(-6).toUpperCase()}</p>
                            <div className="flex gap-2 mt-4">
                                <button className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"><Phone size={18}/></button>
                                <button className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"><Mail size={18}/></button>
                            </div>
                        </div>
                    ) : <p className="text-center text-slate-400">No patient data</p>}
                </div>

                {/* Doctors at Work */}
                <div className="bg-white p-6 rounded-[24px] shadow-sm border border-slate-100">
                    <h3 className="font-bold text-slate-800 mb-6">Doctors at Work</h3>
                    <div className="space-y-5">
                        {data.doctors.slice(0, 4).map((doc, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden">
                                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${doc.doctorName}`} alt="doc" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm text-slate-800">{doc.doctorName}</p>
                                        <p className="text-xs text-slate-400">{doc.category}</p>
                                    </div>
                                </div>
                                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Lab Services - Showing latest 5 services */}
                <div className="bg-white p-6 rounded-[24px] shadow-sm border border-slate-100">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-slate-800">Lab Services</h3>
                        <Beaker className="text-blue-600" size={18} />
                    </div>
                    <div className="space-y-3">
                        {/* Show latest 5 services (assuming the array order reflects creation order) */}
                        {data.labServices.length > 0 ? (
                            [...data.labServices]
                                .reverse() // Show newest first
                                .slice(0, 5) // Take only latest 5
                                .map((test, i) => (
                                    <div key={i} className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl flex justify-between items-center group hover:from-blue-100 hover:to-indigo-100 transition-all duration-200">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1 h-8 bg-blue-500 rounded-full"></div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-700">{test.name}</p>
                                                <p className="text-[10px] text-slate-400 mt-0.5">Lab Service</p>
                                            </div>
                                        </div>
                                        <p className="text-xs font-bold text-blue-600">LKR {test.price.toLocaleString()}</p>
                                    </div>
                                ))
                        ) : (
                            <p className="text-center text-slate-400 text-sm py-4">No lab services available</p>
                        )}
                    </div>

                    {/* Optional: View All button if needed */}
                    {data.labServices.length > 5 && (
                        <button className="mt-4 w-full text-center text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center justify-center gap-1">
                            View All Lab Services <ChevronRight size={14} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, trend, color, isNegative = false }) {
    return (
        <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-24 h-24 ${color} opacity-[0.03] rounded-bl-full`}></div>
            <p className="text-slate-400 text-sm font-bold uppercase tracking-wider">{title}</p>
            <div className="flex items-end justify-between mt-3">
                <h3 className="text-3xl font-extrabold text-slate-900">{value}</h3>
                <span className={`text-xs font-bold px-2 py-1 rounded-lg ${isNegative ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-500'}`}>
                    {trend}
                </span>
            </div>
        </div>
    );
}