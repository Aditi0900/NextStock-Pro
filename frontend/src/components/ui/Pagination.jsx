import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from '../../styles/modules/Pagination.module.css';

export default function Pagination({ page, pages, onPageChange }) {
  if (pages <= 1) return null;

  const getPageNumbers = () => {
    const nums = [];
    const maxVisible = 5;
    let start = Math.max(1, page - Math.floor(maxVisible / 2));
    let end = Math.min(pages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    for (let i = start; i <= end; i++) {
      nums.push(i);
    }
    return nums;
  };

  return (
    <div className={styles.container}>
      <button
        className={styles.arrow}
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        <ChevronLeft size={16} />
      </button>
      {getPageNumbers().map((num) => (
        <button
          key={num}
          className={`${styles.page} ${num === page ? styles.active : ''}`}
          onClick={() => onPageChange(num)}
        >
          {num}
        </button>
      ))}
      <button
        className={styles.arrow}
        disabled={page >= pages}
        onClick={() => onPageChange(page + 1)}
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
