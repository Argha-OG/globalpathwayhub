'use client';

import React from 'react';
import { FaChevronLeft, FaChevronRight, FaAnglesLeft, FaAnglesRight } from 'react-icons/fa6';
import { Button } from '@/components/ui/button';

export default function Pagination({
    currentPage = 1,
    totalPages = 1,
    totalItems = 0,
    pageSize = 10,
    onPageChange,
    onPageSizeChange,
    pageSizeOptions = [5, 10, 20, 50],
    className = '',
}) {
    if (totalPages <= 1 && totalItems <= pageSize) {
        if (totalItems === 0) return null;
    }

    const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, totalItems);

    // Calculate visible page range (e.g. max 5 buttons)
    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;
        let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        let end = Math.min(totalPages, start + maxVisible - 1);

        if (end - start + 1 < maxVisible) {
            start = Math.max(1, end - maxVisible + 1);
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
        return pages;
    };

    const pages = getPageNumbers();

    return (
        <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 py-3 px-2 text-xs text-slate-600 ${className}`}>
            {/* Items count summary & page size */}
            <div className="flex items-center gap-3">
                {totalItems > 0 && (
                    <span>
                        Showing <strong className="font-semibold text-slate-800">{startItem}</strong> to{' '}
                        <strong className="font-semibold text-slate-800">{endItem}</strong> of{' '}
                        <strong className="font-semibold text-slate-800">{totalItems}</strong> items
                    </span>
                )}

                {onPageSizeChange && (
                    <div className="flex items-center gap-1.5 ml-2">
                        <span className="text-slate-500">Per page:</span>
                        <select
                            value={pageSize}
                            onChange={(e) => onPageSizeChange(Number(e.target.value))}
                            className="bg-white/80 border border-slate-300 rounded-lg px-2 py-1 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm"
                        >
                            {pageSizeOptions.map((opt) => (
                                <option key={opt} value={opt}>
                                    {opt}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center gap-1">
                    {/* First Page */}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPageChange(1)}
                        disabled={currentPage === 1}
                        className="h-8 w-8 p-0 border-slate-200/80 bg-white/70 hover:bg-slate-100 text-slate-700 disabled:opacity-40 rounded-lg shadow-sm"
                        title="First Page"
                    >
                        <FaAnglesLeft className="h-3 w-3" />
                    </Button>

                    {/* Prev Page */}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="h-8 w-8 p-0 border-slate-200/80 bg-white/70 hover:bg-slate-100 text-slate-700 disabled:opacity-40 rounded-lg shadow-sm"
                        title="Previous Page"
                    >
                        <FaChevronLeft className="h-3 w-3" />
                    </Button>

                    {/* Page Numbers */}
                    {pages[0] > 1 && (
                        <>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onPageChange(1)}
                                className="h-8 w-8 p-0 border-slate-200/80 bg-white/70 hover:bg-slate-100 text-slate-700 rounded-lg shadow-sm"
                            >
                                1
                            </Button>
                            {pages[0] > 2 && <span className="px-1 text-slate-400">...</span>}
                        </>
                    )}

                    {pages.map((p) => {
                        const isActive = p === currentPage;
                        return (
                            <Button
                                key={p}
                                variant={isActive ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => onPageChange(p)}
                                className={`h-8 w-8 p-0 rounded-lg text-xs font-semibold shadow-sm transition-all ${
                                    isActive
                                        ? 'bg-primary text-white border-primary shadow-primary/25'
                                        : 'border-slate-200/80 bg-white/70 hover:bg-slate-100 text-slate-700'
                                }`}
                            >
                                {p}
                            </Button>
                        );
                    })}

                    {pages[pages.length - 1] < totalPages && (
                        <>
                            {pages[pages.length - 1] < totalPages - 1 && <span className="px-1 text-slate-400">...</span>}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onPageChange(totalPages)}
                                className="h-8 w-8 p-0 border-slate-200/80 bg-white/70 hover:bg-slate-100 text-slate-700 rounded-lg shadow-sm"
                            >
                                {totalPages}
                            </Button>
                        </>
                    )}

                    {/* Next Page */}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="h-8 w-8 p-0 border-slate-200/80 bg-white/70 hover:bg-slate-100 text-slate-700 disabled:opacity-40 rounded-lg shadow-sm"
                        title="Next Page"
                    >
                        <FaChevronRight className="h-3 w-3" />
                    </Button>

                    {/* Last Page */}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPageChange(totalPages)}
                        disabled={currentPage === totalPages}
                        className="h-8 w-8 p-0 border-slate-200/80 bg-white/70 hover:bg-slate-100 text-slate-700 disabled:opacity-40 rounded-lg shadow-sm"
                        title="Last Page"
                    >
                        <FaAnglesRight className="h-3 w-3" />
                    </Button>
                </div>
            )}
        </div>
    );
}
