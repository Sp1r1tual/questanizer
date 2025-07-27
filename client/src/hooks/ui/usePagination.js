import { useState } from "react";

const usePagination = (initialPage = 1, initialLimit = 5) => {
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [totalPages, setTotalPages] = useState(0);
    const [totalResults, setTotalResults] = useState(0);

    const limit = initialLimit;

    const hasPrev = currentPage > 1;
    const hasNext = currentPage < totalPages;

    const setPaginationData = ({ totalPages, totalResults }) => {
        setTotalPages(totalPages || 0);
        setTotalResults(totalResults || 0);
    };

    const getPageNumbers = (maxVisible = 5) => {
        const pages = [];
        let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        let end = Math.min(totalPages, start + maxVisible - 1);

        if (end - start + 1 < maxVisible) {
            start = Math.max(1, end - maxVisible + 1);
        }

        for (let i = start; i <= end; i++) pages.push(i);
        return pages;
    };

    return {
        currentPage,
        totalPages,
        totalResults,
        hasPrev,
        hasNext,
        setCurrentPage,
        setPaginationData,
        getPageNumbers,
        limit,
    };
};

export { usePagination };
