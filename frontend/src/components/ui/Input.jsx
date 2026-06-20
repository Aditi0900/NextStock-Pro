import { forwardRef } from 'react';
import styles from '../../styles/modules/Input.module.css';

const Input = forwardRef(
  ({ label, error, icon: Icon, className = '', ...props }, ref) => {
    return (
      <div className={`${styles.wrapper} ${className}`}>
        {label && <label className={styles.label}>{label}</label>}
        <div className={`${styles.inputContainer} ${error ? styles.inputError : ''}`}>
          {Icon && (
            <span className={styles.icon}>
              <Icon size={16} />
            </span>
          )}
          <input
            ref={ref}
            className={`${styles.input} ${Icon ? styles.hasIcon : ''}`}
            {...props}
          />
        </div>
        {error && <span className={styles.error}>{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
