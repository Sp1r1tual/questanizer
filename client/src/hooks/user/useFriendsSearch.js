import { useState } from "react";
import { usePagination } from "../ui/usePagination";

import { $api } from "../../http";
import { validateSearchQuery } from "../../utils/validation/validateSearchQuery";

const useFriendsSearch = (currentUsername) => {
    const [term, setTerm] = useState("");
    const [results, setResults] = useState([]);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    const {
        currentPage,
        totalPages,
        totalResults,
        hasPrev,
        hasNext,
        setCurrentPage,
        setPaginationData,
        getPageNumbers,
        limit,
    } = usePagination();

    const handleSearch = async (page = 1) => {
        const query = term.trim();

        setError(null);
        setMessage(null);
        setHasSearched(true);

        if (page === 1) setResults([]);

        const { valid, error: validationError } = validateSearchQuery(
            query,
            currentUsername
        );

        if (!valid) return validationError && setError(validationError);

        try {
            setLoading(true);
            const { data } = await $api.get(`/users/search`, {
                params: {
                    query,
                    page,
                    limit,
                },
            });

            setResults(data.users || []);
            setMessage(data.message || null);

            setCurrentPage(page);
            setPaginationData({
                totalPages: data.totalPages,
                totalResults: data.totalResults,
            });
        } catch {
            setError("There was an error while searching. Please try again");
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) handleSearch(page);
    };

    const onTermChange = (value) => {
        setTerm(value);
        setError(null);
        setHasSearched(false);

        setCurrentPage(1);
        setPaginationData({ totalPages: 0, totalResults: 0 });
    };

    return {
        term,
        results,
        message,
        error,
        isLoading,
        hasSearched,
        currentPage,
        totalPages,
        totalResults,
        hasNext,
        hasPrev,
        setTerm: onTermChange,
        handleSearch: () => handleSearch(1),
        handlePageChange,
        getPageNumbers,
    };
};

export { useFriendsSearch };
