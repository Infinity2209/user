import { useState } from 'react';
import { cn } from '../utils/cn';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Table = ({ headers, data, actions, className, enablePagination = false, itemsPerPage = 6, currentPage: externalCurrentPage, onPageChange }) => {
    const [internalCurrentPage, setInternalCurrentPage] = useState(1);

    const currentPage = externalCurrentPage !== undefined ? externalCurrentPage : internalCurrentPage;
    const setCurrentPage = onPageChange || setInternalCurrentPage;

    const totalPages = Math.ceil(data.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = enablePagination ? data.slice(startIndex, endIndex) : data;

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    return (
        <div className={cn('overflow-x-auto', className)}>
            <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        {headers.map((header, index) => (
                            <th key={index} className="px-6 py-3">
                                {header}
                            </th>
                        ))}
                        {actions && <th className="px-6 py-3">Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {paginatedData.map((row, rowIndex) => (
                        <tr
                            key={rowIndex}
                            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                        >
                            {headers.map((header, colIndex) => (
                                <td key={colIndex} className="px-6 py-4 text-gray-900 dark:text-white">
                                    {row[header.toLowerCase().replace(' ', '')]}
                                </td>
                            ))}
                            {actions && (
                                <td className="px-6 py-2 text-gray-900 dark:text-white">
                                    <div className="flex space-x-2">
                                        {actions(row)}
                                    </div>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
            {enablePagination && totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-1 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
                    <div className="text-sm text-gray-700 dark:text-gray-300">
                        Showing {startIndex + 1} to {Math.min(endIndex, data.length)} of {data.length} entries
                    </div>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={handlePrevPage}
                            disabled={currentPage === 1}
                            className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={cn(
                                    'px-3 py-1 rounded-md text-sm font-medium',
                                    page === currentPage
                                        ? 'bg-blue-600 text-white dark:bg-blue-500'
                                        : 'text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-600'
                                )}
                            >
                                {page}
                            </button>
                        ))}
                        <button
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                            className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export { Table };
