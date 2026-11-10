'use client';

import React from 'react';
import { FaChevronLeft, FaChevronRight, FaAnglesLeft, FaAnglesRight } from 'react-icons/fa6';
import { Button } from '@/components/ui/button';

export interface PaginationProps {
    currentPage?: number;
    totalPages?: number;
    totalItems?: number;
    pageSize?: number;
    onPageChange: (page: number) => void;
    onPageSizeChange?: (size: number) => void;
    pageSizeOptions?: number[];
    className?: string;
}

export default function Pagination({
    currentPage = 1,
    totalPages = 1,
    totalItems = 0,
    pageSize = 10,
    onPageChange,
    onPageSizeChange,
    pageSizeOptions = [5, 10, 20, 50],
    className = '',
}: PaginationProps) {
    if (totalPages <= 1 && totalItems <= pageSize) {
        if (totalItems === 0) return null;
    }

    const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, totalItems);

    // Calculate visible page range (e.g. max 5 buttons)
    const getPageNumbers = () => {
        const pages: number[] = [];
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
                        <strong className="font-semibold text-slate-800">{totalItems}</strong> entries
                    </span>
                )}

                {onPageSizeChange && (
                    <div className="flex items-center gap-1.5 ml-2 pl-3 border-l border-slate-200">
                        <span className="text-slate-500">Rows:</span>
                        <select
                            value={pageSize}
                            onChange={(e) => onPageSizeChange(Number(e.target.value))}
                            className="bg-white/80 border border-slate-300 rounded px-2 py-1 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
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
                    {/* First page */}
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => onPageChange(1)}
                        disabled={currentPage <= 1}
                        className="h-8 w-8 p-0 border-slate-200 hover:bg-slate-100 disabled:opacity-40"
                        title="First Page"
                    >
                        <FaAnglesLeft className="h-3 w-3" />
                    </Button>

                    {/* Prev page */}
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage <= 1}
                        className="h-8 w-8 p-0 border-slate-200 hover:bg-slate-100 disabled:opacity-40"
                        title="Previous Page"
                    >
                        <FaChevronLeft className="h-3 w-3" />
                    </Button>

                    {/* Windowed page numbers */}
                    {pages.map((p) => {
                        const isActive = p === currentPage;
                        return (
                            <Button
                                key={p}
                                type="button"
                                variant={isActive ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => onPageChange(p)}
                                className={`h-8 w-8 p-0 text-xs font-semibold ${
                                    isActive
                                        ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
                                        : 'border-slate-200 text-slate-700 hover:bg-slate-100'
                                }`}
                            >
                                {p}
                            </Button>
                        );
                    })}

                    {/* Next page */}
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage >= totalPages}
                        className="h-8 w-8 p-0 border-slate-200 hover:bg-slate-100 disabled:opacity-40"
                        title="Next Page"
                    >
                        <FaChevronRight className="h-3 w-3" />
                    </Button>

                    {/* Last page */}
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => onPageChange(totalPages)}
                        disabled={currentPage >= totalPages}
                        className="h-8 w-8 p-0 border-slate-200 hover:bg-slate-100 disabled:opacity-40"
                        title="Last Page"
                    >
                        <FaAnglesRight className="h-3 w-3" />
                    </Button>
                </div>
            )}
        </div>
    );
}
