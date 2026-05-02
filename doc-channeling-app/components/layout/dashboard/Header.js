import { Search, Bell, ChevronDown, Menu } from "lucide-react";
import { useState, useEffect } from "react";

export default function Header({ onMenuClick }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");

        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
            } catch (err) {
                console.error("Invalid user in localStorage");
            }
        }
    }, []);

    return (
        <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-4 md:px-6 lg:px-8 sticky top-0 z-30">
            <div className="flex items-center gap-3">
                {/* Mobile Menu Button */}
                <button
                    onClick={onMenuClick}
                    className="xl:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    aria-label="Open menu"
                >
                    <Menu size={24} className="text-slate-700" />
                </button>

                {/* Search Bar - Hidden on small screens */}
                <div className="hidden md:block relative w-64 lg:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search anything here..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-100 outline-none text-sm"
                    />
                </div>

                {/* Mobile Search Button */}
                <button className="md:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors">
                    <Search size={20} className="text-slate-700" />
                </button>
            </div>

            <div className="flex items-center gap-4 md:gap-6">
                <button className="relative p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors">
                    <Bell size={22} />
                    <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>

                <div className="flex items-center gap-2 md:gap-3 border-l pl-4 md:pl-6">
                    <div className="hidden sm:block text-right">
                        <p className="text-sm font-bold text-slate-800">{user?.fullName || "User"}</p>
                        <p className="text-xs text-slate-500">Admin</p>
                    </div>
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-blue-100 overflow-hidden border-2 border-white shadow-sm">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" className="w-full h-full object-cover" />
                    </div>
                </div>
            </div>
        </header>
    );
}