import { Bell } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import styles from '../../styles/modules/Topbar.module.css';

const pageTitles = {
  '/': 'Dashboard',
  '/products': 'Product Catalog',
  '/customers': 'Customer Directory',
  '/orders': 'Order Management',
};

export default function Topbar({ sidebarCollapsed }) {
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'NexStock Pro';

  return (
    <header
      className={styles.topbar}
      style={{
        left: sidebarCollapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-width)',
      }}
    >
      <h1 className={styles.title}>{title}</h1>

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
