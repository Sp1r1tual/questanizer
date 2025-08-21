import { useState } from "react";
import { useSelector } from "react-redux";

import { usePagination } from "../ui/usePagination";

import { $api } from "@/http";

import { validateSearchQuery } from "@/utils/validation/validateSearchQuery";

const useFriendsSearch = () => {
  const [input, setInput] = useState("");
  const [results, setResults] = useState({});
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
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
    const trimmedQuery = input.trim();

    if (!trimmedQuery) return;

    const { valid, error: validationError } = validateSearchQuery(
      trimmedQuery,
      currentUserId,
      currentUserName,
    );

    if (!valid) return validationError && setError(validationError);

    setError(null);
    setMessage(null);
    setHasSearched(true);

    if (results[page]) {
      setCurrentPage(page);
      return;
    }

    const { data } = await $api.get(`/users/search`, {
      params: { query: trimmedQuery, page, limit },
    });

    setResults((prev) => ({ ...prev, [page]: data.users || [] }));
    setMessage(data.message || null);

    setCurrentPage(page);
    setPaginationData({
      totalPages: data.totalPages,
      totalResults: data.totalResults,
    });
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) handleSearch(page);
  };

  const onInputChange = (value) => {
    setInput(value);
    setResults({});
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
