import { useFriendsSearch } from "../../../hooks/user/useFriendsSearch";

import { FriendItem } from "./FriendItem";
import { Loader } from "../../ui/loaders/Loader";
import { Pagination } from "../../ui/pagination/Pagination";

import styles from "./FriendsSearch.module.css";

const FriendsSearch = ({
    currentUser,
    getFriendStatus,
    onAdd,
    onAccept,
    onRemove,
}) => {
    const {
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
        setTerm,
        handleSearch,
        handlePageChange,
        getPageNumbers,
    } = useFriendsSearch(currentUser?.username);

    return (
        <div>
            <div className={styles.searchContainer}>
                <input
                    id="search-friends"
                    type="text"
                    className={`${styles.searchInput} ${
                        error ? styles.searchInputError : ""
                    }`}
                    value={term}
                    onChange={(event) => setTerm(event.target.value)}
                    placeholder="Search users to add..."
                    onKeyDown={(event) => {
                        if (event.key === "Enter") {
                            handleSearch();
                        }
                    }}
                />
                <button className={styles.searchButton} onClick={handleSearch}>
                    Search
                </button>
            </div>

            {isLoading && <Loader visible />}

            {hasSearched && !isLoading && (
                <div className={styles.searchResults}>
                    {error ? (
                        <div className={styles.searchMessage}>{error}</div>
                    ) : message ? (
                        <p className={styles.searchMessage}>{message}</p>
                    ) : results.length > 0 ? (
                        <>
                            {totalResults > 0 && (
                                <div className={styles.searchInfo}>
                                    Found {totalResults} users
                                    {totalPages > 1 &&
                                        ` (page ${currentPage} of ${totalPages})`}
                                </div>
                            )}

                            <div className={styles.usersList}>
                                {results.map((user) => (
                                    <FriendItem
                                        key={user.id}
                                        friend={user}
                                        friendStatus={getFriendStatus(user.id)}
                                        onAdd={onAdd}
                                        onAccept={() => onAccept(user.id)}
                                        onRemove={() =>
                                            onRemove(user.id, "request")
                                        }
                                    />
                                ))}
                            </div>

                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                hasNext={hasNext}
                                hasPrev={hasPrev}
                                onPageChange={handlePageChange}
                                getPageNumbers={getPageNumbers}
                                className={styles.friendsPagination}
                            />
                        </>
                    ) : (
                        <p className={styles.noResults}>No users found</p>
                    )}
                </div>
            )}
        </div>
    );
};

export { FriendsSearch };
