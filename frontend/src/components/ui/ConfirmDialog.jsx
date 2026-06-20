import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';
import styles from '../../styles/modules/ConfirmDialog.module.css';

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Delete',
  loading = false,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" width={420}>
      <div className={styles.container}>
        <div className={styles.iconWrapper}>
          <AlertTriangle size={32} />
        </div>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.message}>{message}</p>
        <div className={styles.actions}>
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm} loading={loading}>
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
