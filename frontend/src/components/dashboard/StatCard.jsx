import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Card from '../ui/Card';
import styles from '../../styles/modules/StatCard.module.css';

function AnimatedNumber({ value, duration = 1500 }) {
  const [displayValue, setDisplayValue] = useState(0);
  const startRef = useRef(null);

  useEffect(() => {
    if (value === undefined || value === null) return;
    startRef.current = null;
    const startTime = performance.now();

    const animate = (currentTime) => {
      if (!startRef.current) startRef.current = currentTime;
      const elapsed = currentTime - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(eased * value));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  return <>{displayValue}</>;
}

export default function StatCard({ title, value, icon: Icon, gradient }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card gradient={gradient}>
        <div className={styles.content}>
          <div className={styles.header}>
            <span className={styles.title}>{title}</span>
            <div className={styles.iconWrap} style={{ '--icon-color': gradient }}>
              <Icon size={20} />
            </div>
          </div>
          <span className={styles.value}>
            {typeof value === 'number' ? <AnimatedNumber value={value} /> : value}
          </span>
        </div>
      </Card>
    </motion.div>
  );
}
