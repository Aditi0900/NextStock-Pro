import { Search } from 'lucide-react';
import styles from '../../styles/modules/SearchBar.module.css';

export default function SearchBar({ value, onChange, placeholder = 'Search...', className = '' }) {
  return (
    <div className={`${styles.container} ${className}`}>
      <Search size={16} className={styles.icon} />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={styles.input}
      />
    </div>
  );
}
