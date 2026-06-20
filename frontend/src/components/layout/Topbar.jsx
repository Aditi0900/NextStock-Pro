import { Menu, Bell } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import styles from '../../styles/modules/Topbar.module.css';

const pageTitles = {
  '/': 'Dashboard',
  '/products': 'Product Catalog',
  '/customers': 'Customer Directory',
  '/orders': 'Order Management',
};

export default function Topbar({ sidebarCollapsed, onMenuToggle }) {
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'NexStock Pro';

  return (
    <header
      className={styles.topbar}
      style={{
        left: sidebarCollapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-width)',
      }}
    >
      <div className={styles.leftSection}>
        <button className={styles.menuBtn} onClick={onMenuToggle} aria-label="Toggle menu">
          <Menu size={20} />
        </button>
        <h1 className={styles.title}>{title}</h1>
      </div>

      <div className={styles.actions}>
        <button className={styles.notificationBtn}>
          <Bell size={18} />
          <span className={styles.notificationDot} />
        </button>
        <div className={styles.avatar} title="Admin">
          <span>AD</span>
        </div>
      </div>
    </header>
  );
}
