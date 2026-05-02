"use client";

import { useState, useEffect } from "react";
import {Plus, SquarePen, Trash2, Clock, Calendar as CalIcon, MapPin} from "lucide-react";
import DataTable from "@/components/DataTable";
import Modal from "@/components/Modal";
import notification from "@/components/alerts/alerts";
import DeleteConfirmModal from "@/components/ui/DeleteConfirmModel";

export default function ManageDoctors() {
    const [doctors, setDoctors] = useState([]);
    const [editingDoctor, setEditingDoctor] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    // Dynamic Availability State
    const [availability, setAvailability] = useState([{ day: "", startTime: "", endTime: "", location: "" }]);

    const [formData, setFormData] = useState({
        doctorName: "",
        description: "",
        category: "",
    });

    // Fetch doctors
    const fetchDoctors = async () => {
        try {
            const res = await fetch("/api/doctors");
            const json = await res.json();
            if (json.success) setDoctors(json.data);
        } catch (err) {
            console.error("Fetch error:", err);
        }
    };

    useEffect(() => {
        fetchDoctors();
    }, []);

    const openDeleteModal = (id) => {
        setItemToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        setDeleteLoading(true);
        try {
            const res = await fetch(`/api/doctors/${itemToDelete}`, { method: "DELETE" });
            if (res.ok) {
                notification.success("Doctor removed successfully");
                fetchDoctors();
            }
        } catch (err) {
            notification.error("Delete failed");
        } finally {
            setDeleteLoading(false);
            setIsDeleteModalOpen(false);
        }
    };

    // Availability Handlers
    const addDayRow = () => {
        setAvailability([...availability, { day: "", startTime: "", endTime: "", location: "" }]);
    };

    const removeDayRow = (index) => {
        if (availability.length > 1) {
            setAvailability(availability.filter((_, i) => i !== index));
        }
    };

    const updateDayRow = (index, field, value) => {
        const newArr = [...availability];
        newArr[index][field] = value;
        setAvailability(newArr);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Prepare the structured payload
        const payload = {
            doctorName: formData.doctorName,
            description: formData.description,
            category: formData.category,
            // Only send valid rows
            availability: availability.filter(a => a.day && a.startTime && a.endTime && a.location),
            availableHospitals: formData.availableHospitals
                ? formData.availableHospitals.split(",").map((h) => h.trim())
                : [],
        };

        try {
            const url = editingDoctor
                ? `/api/doctors/${editingDoctor._id}`
                : "/api/doctors";

            const method = editingDoctor ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                notification.error(data.error || "Something went wrong");
                setLoading(false);
                return;
            } else {
                notification.success('Doctor Details Saved Successfully!')
            }

            // Reset all states
            setFormData({ doctorName: "", description: "", category: "" });
            setAvailability([{ day: "", startTime: "", endTime: "", location: "" }]);
            setEditingDoctor(null);
            setIsModalOpen(false);
            fetchDoctors();
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    const handleEdit = (doctor) => {
        setEditingDoctor(doctor);
        setFormData({
            doctorName: doctor.doctorName,
            description: doctor.description,
            category: doctor.category,
        });
        // Populate availability from the doctor's record
        setAvailability(doctor.availability && doctor.availability.length > 0
            ? doctor.availability
            : [{ day: "", startTime: "", endTime: "", location: "" }]
        );
        setIsModalOpen(true);
    };

    const columns = [
        {
            header: "Doctor",
            accessor: "doctorName",
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                        {row.doctorName.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                        <div className="font-bold text-slate-900">{row.doctorName}</div>
                        <div className="text-xs text-slate-500">{row.category}</div>
                    </div>
                </div>
            ),
        },
        {
            header: "Schedule",
            render: (row) => (
                <div className="text-xs space-y-1">
                    {row.availability?.map((a, i) => (
                        <div key={i} className="flex items-center gap-1 text-slate-600">
                            <Clock size={12} className="text-teal-500" />
                            <span className="font-semibold">{a.day.substring(0, 3)}:</span>
                            {a.startTime} - {a.endTime}
                            <MapPin size={16} className="text-teal-500"/>{a.location}
                        </div>
                    ))}
                </div>
            )
        },
        {
            header: "Actions",
            render: (row) => (
                <div className="flex gap-1">
                    <button onClick={() => handleEdit(row)} className="p-2 text-teal-600 hover:bg-teal-100 rounded-lg transition-colors cursor-pointer">
                        <SquarePen size={18} />
                    </button>
                    <button onClick={() => openDeleteModal(row._id)} className="p-2 text-red-500 hover:bg-red-100 cursor-pointer">
                        <Trash2 size={18} />
                    </button>
                </div>
            ),
        }
    ];

    return (
        <div className="space-y-6">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Manage Doctors</h1>
                    <p className="text-slate-500 mt-1">Configure doctor availability and clinical specialties.</p>
                </div>
                <button
                    onClick={() => {
                        setEditingDoctor(null);
                        setAvailability([{ day: "", startTime: "", endTime: "", location: "" }]);
                        setFormData({ doctorName: "", description: "", category: "" });
                        setIsModalOpen(true);
                    }}
                    className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all font-bold cursor-pointer"
                >
                    <Plus size={20} />
                    Register Doctor
                </button>
            </div>

            {/* Table Container */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <DataTable columns={columns} data={doctors} itemsPerPage={8} />
            </div>

            {/* Modal Form */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingDoctor ? "Update Profile" : "New Staff Registration"}
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 ml-1">Full Name</label>
                            <input required placeholder="Dr. John Doe" value={formData.doctorName}
                                   onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
                                   className="w-full p-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-teal-500" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 ml-1">Medical Specialty</label>
                            <input required placeholder="e.g. Cardiology" value={formData.category}
                                   onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                   className="w-full p-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-teal-500" />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 ml-1">Professional Bio</label>
                        <textarea required placeholder="Brief description of experience..." value={formData.description}
                                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                  className="w-full p-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-teal-500 h-24" />
                    </div>

                    {/* AVAILABILITY SECTION */}
                    <div className="bg-slate-50 p-4 rounded-2xl space-y-4 border border-slate-100">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                <CalIcon size={16} className="text-teal-600" /> Availability & Hours
                            </label>
                            <button type="button" onClick={addDayRow} className="text-xs bg-white text-teal-600 px-3 py-1.5 rounded-lg border border-teal-100 font-bold hover:bg-teal-50">
                                + Add Day
                            </button>
                        </div>

                        <div className="space-y-3">
                            {availability.map((item, index) => (
                                <div key={index} className="flex flex-wrap md:flex-nowrap gap-3 items-center bg-white p-3 rounded-xl shadow-sm border border-slate-100">
                                    <select required value={item.day} onChange={(e) => updateDayRow(index, 'day', e.target.value)}
                                            className="bg-transparent text-sm font-semibold flex-1 outline-none">
                                        <option value="">Select Day</option>
                                        {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(d => (
                                            <option key={d} value={d}>{d}</option>
                                        ))}
                                    </select>
                                    <div className="flex items-center gap-2">
                                        <input type="time" required value={item.startTime} onChange={(e) => updateDayRow(index, 'startTime', e.target.value)}
                                               className="text-sm p-1 hover:bg-slate-50 rounded" />
                                        <span className="text-slate-400 text-xs">to</span>
                                        <input type="time" required value={item.endTime} onChange={(e) => updateDayRow(index, 'endTime', e.target.value)}
                                               className="text-sm p-1 hover:bg-slate-50 rounded" />
                                        <input type="text" required value={item.location} onChange={(e) => updateDayRow(index, 'location', e.target.value)}
                                               className="text-sm p-1 hover:bg-slate-50 rounded" />
                                    </div>
                                    <button type="button" onClick={() => removeDayRow(index)} className="p-1 text-red-400 hover:text-red-600 transition-colors">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button type="submit" disabled={loading}
                            className="w-full bg-teal-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-teal-100 hover:bg-teal-700 transition-all disabled:opacity-50">
                        {loading ? "Synchronizing Data..." : editingDoctor ? "Update Staff Member" : "Confirm Registration"}
                    </button>
                </form>
            </Modal>

            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                loading={deleteLoading}
                title="Delete Doctor Profile"
            />
        </div>
    );
}