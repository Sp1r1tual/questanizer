import { useState } from "react";
import { useSelector } from "react-redux";

import { usePagination } from "../ui/usePagination";

import { $api } from "@/http";

import { validateSearchQuery } from "@/utils/validation/validateSearchQuery";

const useFriendsSearch = () => {
    const [input, setInput] = useState("");
    const [results, setResults] = useState([]);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    const currentUserId = useSelector((state) => state.auth.user.id);
    const currentUserName = useSelector((state) => state.auth.user.username);

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
        const query = input.trim();

        setError(null);
        setMessage(null);
        setHasSearched(true);

        if (page === 1) setResults([]);

        const { valid, error: validationError } = validateSearchQuery(
            query,
            currentUserId,
            currentUserName
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

    const onInputChange = (value) => {
        setInput(value);
        setError(null);
        setHasSearched(false);

        setCurrentPage(1);
        setPaginationData({ totalPages: 0, totalResults: 0 });
    };

    return {
        input,
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
        onInputChange,
        handleSearch,
        handlePageChange,
        getPageNumbers,
    };
};

export { useFriendsSearch };
