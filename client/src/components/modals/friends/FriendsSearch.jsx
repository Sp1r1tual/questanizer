import useFriendsSearch from "../../../hooks/user/useFriendsSearch";

import FriendItem from "./FriendItem";
import Loader from "../../ui/Loader";

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
        setTerm,
        handleSearch,
    } = useFriendsSearch(currentUser?.username);

    return (
        <div>
            <div className={styles.searchContainer}>
                <input
                    type="text"
                    className={`${styles.searchInput} ${
                        error ? styles.searchInputError : ""
                    }`}
                    value={term}
                    onChange={(event) => setTerm(event.target.value)}
                    placeholder="Search users to add..."
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
                        results.map((user) => (
                            <FriendItem
                                key={user.id}
                                friend={user}
                                friendStatus={getFriendStatus(user.id)}
                                onAdd={onAdd}
                                onAccept={() => onAccept(user.id)}
                                onRemove={() => onRemove(user.id, "request")}
                            />
                        ))
                    ) : (
                        <p className={styles.noResults}>No users found</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default FriendsSearch;
