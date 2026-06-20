import { motion } from 'framer-motion';
import styles from '../../styles/modules/Loader.module.css';

export function Spinner({ size = 24 }) {
  return (
    <div className={styles.spinnerWrapper}>
      <motion.div
        className={styles.spinner}
        style={{ width: size, height: size }}
        animate={{ rotate: 360 }}
        transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
      >
        <svg viewBox="0 0 24 24" fill="none" width={size} height={size}>
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="3"
          />
          <path
            d="M12 2a10 10 0 0 1 10 10"
            stroke="url(#gradient)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#7c3aed" />
              <stop offset="100%" stopColor="#06d6a0" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>
    </div>
  );
}

export function PageLoader() {
  return (
    <div className={styles.pageLoader}>
      <Spinner size={40} />
    </div>
  );
}

export function SkeletonRow({ cells = 4 }) {
  return (
    <tr>
      {Array.from({ length: cells }).map((_, i) => (
        <td key={i}>
          <div className="skeleton" style={{ height: 16, width: `${60 + Math.random() * 30}%` }} />
        </td>
      ))}
    </tr>
  );
}
