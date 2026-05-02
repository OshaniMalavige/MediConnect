"use client"
import Modal from "./Modal";
import { AlertTriangle, Loader2 } from "lucide-react";

export default function DeleteConfirmModal({
                                               isOpen,
                                               onClose,
                                               onConfirm,
                                               title = "Confirm Deletion",
                                               message = "Are you sure you want to delete this item? This action cannot be undone.",
                                               loading = false
                                           }) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <div className="flex flex-col items-center text-center p-2">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
                    <AlertTriangle className="text-red-500" size={32} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
                <p className="text-salte-800 text-sm mb-8 leading-relaxed">
                    {message}
                </p>

                <div className="flex w-full gap-3">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all disabled:opacity-50 cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="flex-1 px-4 py-3 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 shadow-lg shadow-red-100 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                    >
                        {loading && <Loader2 size={18} className="animate-spin" />}
                        {loading ? "Deleting..." : "Delete Now"}
                    </button>
                </div>
            </div>
        </Modal>
    );
}