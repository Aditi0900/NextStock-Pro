import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import styles from '../../styles/modules/Button.module.css';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon: Icon,
  type = 'button',
  className = '',
  onClick,
  ...props
}) {
  return (
    <motion.button
      whileHover={!disabled && !loading ? { y: -1 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      className={`${styles.button} ${styles[variant]} ${styles[size]} ${className}`}
      disabled={disabled || loading}
      type={type}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <Loader2 size={16} className={styles.spinner} />
      ) : Icon ? (
        <Icon size={16} />
      ) : null}
      {children && <span>{children}</span>}
    </motion.button>
  );
}
