import { useState } from "react";

import { $api } from "../../http";
import validateSearchQuery from "../../utils/validation/validateSearchQuery";

const useFriendsSearch = (currentUsername) => {
    const [term, setTerm] = useState("");
    const [results, setResults] = useState([]);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = async () => {
        const query = term.trim();

        setError(null);
        setMessage(null);
        setResults([]);
        setHasSearched(true);

        const { valid, error: validationError } = validateSearchQuery(
            query,
            currentUsername
        );

        if (!valid) {
            if (validationError) setError(validationError);

            return;
        }

        try {
            setLoading(true);
            const { data } = await $api.get(`/users/search`, {
                params: { query },
            });

            setResults(data.users || []);
            setMessage(data.message || null);
        } catch {
            setError("There was an error while searching. Please try again");
        } finally {
            setLoading(false);
        }
    };

    const onTermChange = (value) => {
        setTerm(value);
        setError(null);
        setHasSearched(false);
    };

    return {
        term,
        results,
        message,
        error,
        isLoading,
        hasSearched,
        setTerm: onTermChange,
        handleSearch,
    };
};

export default useFriendsSearch;
