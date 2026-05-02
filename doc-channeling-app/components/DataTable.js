"use client";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal, ChevronDown, ChevronUp } from "lucide-react";

export default function DataTable({ columns, data, itemsPerPage = 5 }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [isMobile, setIsMobile] = useState(false);
    const [expandedRows, setExpandedRows] = useState({});

    // Check if mobile view
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Pagination Logic
    const totalPages = Math.ceil(data.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = data.slice(startIndex, startIndex + itemsPerPage);

    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            setExpandedRows({}); // Collapse all rows when changing page
        }
    };

    const toggleRowExpansion = (rowIndex) => {
        setExpandedRows(prev => ({
            ...prev,
            [rowIndex]: !prev[rowIndex]
        }));
    };

    // Get visible columns for mobile (first 2-3 columns)
    const getMobileVisibleColumns = () => {
        // Show first 2 columns in collapsed view
        return columns.slice(0, 2);
    };

    // Get remaining columns for expanded view
    const getRemainingColumns = () => {
        return columns.slice(2);
    };

    // Generate page numbers with ellipsis for mobile
    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = isMobile ? 3 : 5;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                pages.push(1);
                pages.push('...');
                pages.push(currentPage - 1);
                pages.push(currentPage);
                pages.push(currentPage + 1);
                pages.push('...');
                pages.push(totalPages);
            }
        }
        return pages;
    };

    return (
        <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead className="bg-[#0F172A] text-white border-b border-slate-100">
                    <tr>
                        {columns.map((col, i) => (
                            <th key={i} className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                {col.header}
                            </th>
                        ))}
                        <th className="p-4 w-12"></th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                    {currentData.length > 0 ? (
                        currentData.map((row, rowIndex) => (
                            <tr key={rowIndex} className="hover:bg-slate-50/50 transition-colors">
                                {columns.map((col, colIndex) => (
                                    <td key={colIndex} className="p-4 text-sm text-slate-700 font-medium">
                                        {col.render ? col.render(row) : row[col.accessor]}
                                    </td>
                                ))}
                                <td className="p-4 text-right">
                                    <button className="text-slate-400 hover:text-slate-600 transition-colors">
                                        <MoreHorizontal size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={columns.length + 1} className="p-10 text-center text-slate-400">
                                No data found.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden divide-y divide-slate-100">
                {currentData.length > 0 ? (
                    currentData.map((row, rowIndex) => {
                        const visibleColumns = getMobileVisibleColumns();
                        const remainingColumns = getRemainingColumns();
                        const isExpanded = expandedRows[rowIndex];

                        return (
                            <div key={rowIndex} className="p-4 hover:bg-slate-50/50 transition-colors">
                                {/* Collapsed View - Show first 2 columns */}
                                <div className="flex justify-between items-start">
                                    <div className="flex-1 space-y-2">
                                        {visibleColumns.map((col, colIndex) => (
                                            <div key={colIndex}>
                                                <div className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">
                                                    {col.header}
                                                </div>
                                                <div className="text-sm text-slate-700 font-medium break-words">
                                                    {col.render ? col.render(row) : row[col.accessor]}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex items-center gap-2 ml-4">
                                        <button
                                            onClick={() => toggleRowExpansion(rowIndex)}
                                            className="p-2 text-slate-400 hover:text-teal-600 transition-colors"
                                            aria-label={isExpanded ? "Show less" : "Show more"}
                                        >
                                            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                        </button>
                                        <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                                            <MoreHorizontal size={18} />
                                        </button>
                                    </div>
                                </div>

                                {/* Expanded View - Show remaining columns */}
                                {isExpanded && remainingColumns.length > 0 && (
                                    <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
                                        {remainingColumns.map((col, colIndex) => (
                                            <div key={colIndex} className="flex justify-between items-start">
                                                <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                                                    {col.header}
                                                </div>
                                                <div className="text-sm text-slate-700 font-medium text-right flex-1 ml-4 break-words">
                                                    {col.render ? col.render(row) : row[col.accessor]}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })
                ) : (
                    <div className="p-10 text-center text-slate-400">
                        No data found.
                    </div>
                )}
            </div>

            {/* Pagination Controls - Responsive */}
            <div className="p-3 md:p-4 border-t border-slate-50 bg-white">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                    {/* Entries info - Hidden on very small screens */}
                    <p className="text-xs text-slate-500 font-medium order-2 sm:order-1">
                        Showing <span className="text-slate-900">{startIndex + 1}</span> to{" "}
                        <span className="text-slate-900">
                            {Math.min(startIndex + itemsPerPage, data.length)}
                        </span>{" "}
                        of <span className="text-slate-900">{data.length}</span> entries
                    </p>

                    {/* Page navigation */}
                    <div className="flex flex-wrap justify-center gap-1.5 md:gap-2 order-1 sm:order-2">
                        <button
                            onClick={() => goToPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="p-1.5 md:p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                            aria-label="Previous page"
                        >
                            <ChevronLeft size={isMobile ? 14 : 16} />
                        </button>

                        <div className="flex gap-1 md:gap-2">
                            {getPageNumbers().map((page, i) => (
                                page === '...' ? (
                                    <span key={i} className="w-6 md:w-8 h-6 md:h-8 flex items-center justify-center text-xs text-slate-400 cursor-pointer">
                                        ...
                                    </span>
                                ) : (
                                    <button
                                        key={i}
                                        onClick={() => goToPage(page)}
                                        className={`min-w-[28px] md:min-w-[32px] h-7 md:h-8 px-2 cursor-pointer rounded-lg text-xs font-bold transition-all touch-manipulation ${
                                            currentPage === page
                                                ? "bg-teal-600 text-white shadow-md shadow-teal-200"
                                                : "hover:bg-slate-100 text-slate-500"
                                        }`}
                                    >
                                        {page}
                                    </button>
                                )
                            ))}
                        </div>

                        <button
                            onClick={() => goToPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="p-1.5 md:p-2 cursor-pointer rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            aria-label="Next page"
                        >
                            <ChevronRight size={isMobile ? 14 : 16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile swipe hint */}
            {isMobile && currentData.length > 0 && (
                <div className="md:hidden text-center py-2 text-xs text-slate-400 border-t border-slate-50 bg-slate-50/30">
                    <span>Tap on </span>
                    <ChevronDown size={12} className="inline" />
                    <span> to expand row</span>
                </div>
            )}
        </div>
    );
}