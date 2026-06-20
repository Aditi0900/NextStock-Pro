import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  Box,
} from 'lucide-react';
import styles from '../../styles/modules/Sidebar.module.css';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/products', label: 'Products', icon: Package },
  { path: '/customers', label: 'Customers', icon: Users },
  { path: '/orders', label: 'Orders', icon: ShoppingCart },
];

export default function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose, standalone }) {
  const location = useLocation();

  return (
    <motion.aside
      className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''} ${standalone ? styles.standalone : ''}`}
      layout
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className={styles.logoArea}>
        <div className={styles.logo}>
          <Box size={28} className={styles.logoIcon} />
          {!collapsed && (
            <motion.span
              className={styles.logoText}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              NexStock
            </motion.span>
          )}
        </div>
        <button className={styles.toggleBtn} onClick={() => onToggle(!collapsed)}>
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      <nav className={styles.nav}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || 
            (item.path !== '/' && location.pathname.startsWith(item.path));
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`${styles.navItem} ${isActive ? styles.active : ''}`}
            >
              <item.icon size={20} />
              {!collapsed && (
                <motion.span
                  className={styles.navLabel}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {item.label}
                </motion.span>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className={styles.footer}>
        {!collapsed && <span className={styles.version}>v1.0.0</span>}
      </div>
    </motion.aside>
  );
}
