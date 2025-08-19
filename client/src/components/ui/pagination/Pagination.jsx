import styles from "./Pagination.module.css";

const Pagination = ({
  currentPage,
  totalPages,
  hasPrev,
  hasNext,
  onPageChange,
  getPageNumbers,
  className = "",
}) => {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers();

  return (
    <div className={`${styles.pagination} ${className}`}>
      <button disabled={!hasPrev} onClick={() => onPageChange(currentPage - 1)}>
        ＜
      </button>

      {pages.map((page) => (
        <button
          key={page}
          className={`${page === currentPage ? styles.active : ""}`}
          disabled={page === currentPage}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}

      <button disabled={!hasNext} onClick={() => onPageChange(currentPage + 1)}>
        ＞
      </button>
    </div>
  );
};

export { Pagination };
