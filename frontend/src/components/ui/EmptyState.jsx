import { motion } from 'framer-motion';
import styles from '../../styles/modules/EmptyState.module.css';

export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {Icon && (
        <div className={styles.iconWrapper}>
          <Icon size={48} />
        </div>
      )}
      <h3 className={styles.title}>{title}</h3>
      {description && <p className={styles.description}>{description}</p>}
      {action && <div className={styles.action}>{action}</div>}
    </motion.div>
  );
}
