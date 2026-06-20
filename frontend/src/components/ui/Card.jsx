import styles from '../../styles/modules/Card.module.css';

export default function Card({ children, className = '', onClick, gradient = '', ...props }) {
  return (
    <div
      className={`${styles.card} ${className}`}
      style={gradient ? { '--gradient': gradient } : {}}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
}
