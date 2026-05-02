'use client'
import {useEffect, useState} from "react";
import { Trash2} from "lucide-react";
import DataTable from "@/components/DataTable";
import notifications from "@/components/alerts/alerts";
import DeleteConfirmModal from "@/components/ui/DeleteConfirmModel";

export default function ManagePatients() {
    const [users, setUsers] = useState([]);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedPatientId, setSelectedPatientId] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    // Fetch doctors
    const fetchPatients = async () => {
        try {
            const res = await fetch("/api/users");
            const json = await res.json();
            if (json.success) setUsers(json.data);
        } catch (err) {
            console.error("Fetch error:", err);
        }
    };

    useEffect(() => {
        fetchPatients();
    }, []);

    const confirmDelete = async () => {
        setDeleteLoading(true);
        try {
            const res = await fetch(`/api/users/${selectedPatientId}`, { method: "DELETE" });
            if (res.ok) {
                fetchPatients();
                notifications.success("Patient Deleted!");
            }
        } finally {
            setDeleteLoading(false);
            setIsDeleteModalOpen(false);
        }
    };

    const columns = [
        { header: "Full Name", accessor: "fullName" },
        { header: "Email", accessor: "email" },
        { header: "Contact No", accessor: "phone" },
        { header: "Joined Date", accessor: "createdAt" },
        {
            header: "Actions",
            render: (row) => (
                <div className="flex gap-2">
                    <button onClick={() => { setSelectedPatientId(row._id); setIsDeleteModalOpen(true); }} className="cursor-pointer text-red-500 hover:bg-red-100 p-2">
                        <Trash2 size={20} />
                    </button>
                </div>
            ),
        }
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Manage Patients</h1>
                    <p className="text-slate-500 text-sm">
                        Track Patients.
                    </p>
                </div>
            </div>

            {/* Table */}
            <DataTable columns={columns} data={users} itemsPerPage={8} />

            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                loading={deleteLoading}
                message="Deleting this patient will remove all their medical history records."
            />

        </div>
    );
}