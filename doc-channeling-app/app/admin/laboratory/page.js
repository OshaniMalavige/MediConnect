"use client"

import { Clock, MapPin, Plus, SquarePen, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import Modal from "@/components/Modal";
import DataTable from "@/components/DataTable";
import DeleteConfirmModal from "@/components/ui/DeleteConfirmModel";
import notifications from "@/components/alerts/alerts";

export default function ManageLaboratory() {
    const [tests, setTests] = useState([]);
    const [editingLaboratoryService, setEditingLaboratoryService] = useState(null);
    const [isLaboratoryModalOpen, setIsLaboratoryModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [deleteModal, setDeleteModal] = useState({ open: false, id: null });
    const [deleteLoading, setDeleteLoading] = useState(false);

    const initialFormState = {
        tests: [{ name: "", price: "", description: "" }],
        location: "",
        time: "",
    };
    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        fetchTestDetails();
    }, []);

    const fetchTestDetails = async () => {
        try {
            const res = await fetch("/api/laboratories");

            // Check if the response is valid before parsing
            if (!res.ok) {
                const errorText = await res.text(); // Get raw text to see what went wrong
                console.error("Server Error:", errorText);
                return;
            }

            const json = await res.json();
            if (json.success) {
                setTests(json.data);
            }
        } catch (err) {
            console.error("Fetch error:", err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const formattedData = {
                ...formData,
                tests: formData.tests.map(test => ({
                    name: test.name,
                    description: test.description,
                    price: Number(test.price),
                })),
            };

            // If editing, use /[id], else use base route
            const url = editingLaboratoryService
                ? `/api/laboratories/${editingLaboratoryService._id}`
                : "/api/laboratories";

            const res = await fetch(url, {
                method: editingLaboratoryService ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formattedData),
            });

            if (!res.ok) throw new Error("Something went wrong");

            notifications.success(editingLaboratoryService ? "Updated successfully" : "Saved successfully");
            setIsLaboratoryModalOpen(false);
            setFormData(initialFormState);
            setEditingLaboratoryService(null);
            fetchTestDetails();
        } catch (error) {
            notifications.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (service) => {
        setEditingLaboratoryService(service);
        setFormData({
            tests: service.tests,
            location: service.location,
            time: service.time,
        });
        setIsLaboratoryModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        setDeleteLoading(true);
        try {
            const res = await fetch(`/api/laboratories/${deleteModal.id}`, { method: "DELETE" });
            if (res.ok) {
                fetchTestDetails();
            }
        } finally {
            setDeleteLoading(false);
            setDeleteModal({ open: false, id: null });
        }
    };

    // 3. Define Table Columns
    const columns = [
        {
            header: "Location & Time",
            accessor: "location",
            render: (row) => (
                <div className="space-y-1">
                    <div className="flex items-center gap-1 text-slate-900 font-bold">
                        <MapPin size={14} className="text-teal-500" /> {row.location}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                        <Clock size={14} /> {row.time}
                    </div>
                </div>
            )
        },
        {
            header: "Available Tests",
            accessor: "tests",
            render: (row) => (
                <div className="flex flex-wrap gap-1">
                    {row.tests.map((t, i) => (
                        <span key={i} className="bg-teal-50 text-teal-700 text-[10px] px-2 py-0.5 rounded-full border border-teal-100 font-semibold">
                            {t.name}
                        </span>
                    ))}
                </div>
            )
        },
        {
            header: "Total Price (LKR)",
            accessor: "price",
            render: (row) => {
                const total = row.tests.reduce((acc, curr) => acc + (curr.price || 0), 0);
                return (
                    <span className="font-mono font-bold text-slate-700">
                        {total.toLocaleString()}
                    </span>
                );
            }
        },
        {
            header: "Actions",
            accessor: "_id",
            render: (row) => (
                <div className="flex gap-2">
                    <button
                        onClick={() => handleEdit(row)}
                        className="p-2 text-teal-600 hover:bg-teal-100 rounded-lg transition cursor-pointer"
                    >
                        <SquarePen size={18} />
                    </button>
                    <button onClick={() => setDeleteModal({ open: true, id: row._id })} className="text-red-500 hover:bg-red-100 p-2 cursor-pointer">
                        <Trash2 size={18} />
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Manage Laboratory Services</h1>
                    <p className="text-slate-500 mt-1">Configure laboratory services availability and clinical specialties.</p>
                </div>
                <button
                    onClick={() => {
                        setEditingLaboratoryService(null);
                        setFormData(initialFormState);
                        setIsLaboratoryModalOpen(true);
                    }}
                    className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all font-bold shadow-sm cursor-pointer"
                >
                    <Plus size={20} />
                    Add Laboratory Service
                </button>
            </div>

            {/* 4. Display the Table */}
            <DataTable columns={columns} data={tests} itemsPerPage={5} />

            <Modal
                isOpen={isLaboratoryModalOpen}
                onClose={() => setIsLaboratoryModalOpen(false)}
                title={editingLaboratoryService ? "Update Service" : "New Service Registration"}
            >
                <form className="space-y-6" onSubmit={handleSubmit}>
                    {/* ... (Your existing form code remains the same) ... */}
                    <div className="space-y-4">
                        <label className="text-sm font-bold text-slate-600 uppercase tracking-wider">
                            Laboratory Tests
                        </label>

                        <div className="max-h-[40vh] overflow-y-auto pr-2 space-y-4">
                            {formData.tests?.map((test, index) => (
                                <div key={index} className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 relative shadow-sm">
                                    {formData.tests.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const updated = formData.tests.filter((_, i) => i !== index);
                                                setFormData({ ...formData, tests: updated });
                                            }}
                                            className="absolute top-4 right-4 text-slate-400 hover:text-red-500 p-1 hover:bg-red-50 rounded-md transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-xs font-medium text-slate-500">Test Name</label>
                                            <input
                                                placeholder="e.g. Blood Sugar"
                                                value={test.name}
                                                onChange={(e) => {
                                                    const updated = [...formData.tests];
                                                    updated[index].name = e.target.value;
                                                    setFormData({ ...formData, tests: updated });
                                                }}
                                                className="w-full p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-medium text-slate-500">Price (LKR)</label>
                                            <input
                                                type="number"
                                                placeholder="0.00"
                                                value={test.price}
                                                onChange={(e) => {
                                                    const updated = [...formData.tests];
                                                    updated[index].price = e.target.value;
                                                    setFormData({ ...formData, tests: updated });
                                                }}
                                                className="w-full p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-slate-500">Description</label>
                                        <textarea
                                            placeholder="Briefly describe the test requirements..."
                                            rows={2}
                                            value={test.description}
                                            onChange={(e) => {
                                                const updated = [...formData.tests];
                                                updated[index].description = e.target.value;
                                                setFormData({ ...formData, tests: updated });
                                            }}
                                            className="w-full p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                setFormData({
                                    ...formData,
                                    tests: [...formData.tests, { name: "", price: "", description: "" }],
                                })
                            }
                            className="w-full border-2 border-dashed border-slate-200 rounded-xl py-4 text-sm font-semibold text-teal-600 hover:bg-teal-50 hover:border-teal-200 transition-all flex items-center justify-center gap-2"
                        >
                            <Plus size={18} />
                            Add Another Test
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-6">
                        <div className="space-y-1">
                            <label className="text-sm font-bold text-slate-600">Location</label>
                            <input
                                required
                                placeholder="e.g. Colombo 09"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-bold text-slate-600">Available Time</label>
                            <input
                                required
                                placeholder="e.g. 9:00 AM - 5:00 PM"
                                value={formData.time}
                                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <button
                            type="button"
                            onClick={() => {
                                setIsLaboratoryModalOpen(false);
                                setFormData(initialFormState);
                            }}
                            className="px-6 py-2.5 rounded-lg border border-slate-300 text-slate-600 font-semibold hover:bg-slate-50 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-8 py-2.5 rounded-lg bg-teal-600 text-white font-bold hover:bg-teal-700 shadow-md shadow-teal-100 transition disabled:opacity-50"
                        >
                            {loading ? "Saving..." : editingLaboratoryService ? "Update" : "Save Service"}
                        </button>
                    </div>
                </form>
            </Modal>

            <DeleteConfirmModal
                isOpen={deleteModal.open}
                onClose={() => setDeleteModal({ open: false, id: null })}
                onConfirm={handleDeleteConfirm}
                loading={deleteLoading}
                title="Remove Lab Service"
            />
        </div>
    )
}