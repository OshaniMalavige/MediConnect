import { X } from 'lucide-react'

export default function Modal({ isOpen, onClose, title, children }) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full animate-slide-up">
                <div className="flex justify-between items-center p-6 border-b border-emerald-100">
                    <h2 className="text-lg font-semibold text-black">{title}</h2>
                    <button onClick={onClose} className="bg-gray-200 p-2 cursor-pointer">
                        <X size={20} />
                    </button>
                </div>
                <div className="p-6">{children}</div>
            </div>
        </div>
    )
}