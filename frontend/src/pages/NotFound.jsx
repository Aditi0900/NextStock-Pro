import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Button from '../components/ui/Button';
import styles from '../styles/modules/NotFound.module.css';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
    >
      <h1 className={styles.code}>404</h1>
      <h2 className={styles.title}>Page Not Found</h2>
      <p className={styles.description}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Button icon={ArrowLeft} onClick={() => navigate('/')}>
        Back to Dashboard
      </Button>
    </motion.div>
  );
}
