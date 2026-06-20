import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Users, ShoppingBag, TrendingUp } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import StatCard from '../components/dashboard/StatCard';
import RevenueChart from '../components/dashboard/RevenueChart';
import LowStockAlert from '../components/dashboard/LowStockAlert';
import RecentOrders from '../components/dashboard/RecentOrders';
import { PageLoader } from '../components/ui/Loader';
import { formatCurrency } from '../utils/formatters';
import styles from '../styles/modules/Dashboard.module.css';

export default function Dashboard() {
  const { state, loadDashboard } = useAppContext();
  const { dashboard, dashboardLoading } = state;

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  if (dashboardLoading || !dashboard) {
    return <PageLoader />;
  }

  return (
    <motion.div
      className={styles.dashboard}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className={styles.statsGrid}>
        <StatCard
          title="Total Products"
          value={dashboard.total_products}
          icon={Package}
          gradient="linear-gradient(90deg, #7c3aed, #a78bfa)"
        />
        <StatCard
          title="Total Customers"
          value={dashboard.total_customers}
          icon={Users}
          gradient="linear-gradient(90deg, #06d6a0, #34d399)"
        />
        <StatCard
          title="Total Orders"
          value={dashboard.total_orders}
          icon={ShoppingBag}
          gradient="linear-gradient(90deg, #f59e0b, #fbbf24)"
        />
        <StatCard
          title="Total Revenue"
          value={formatCurrency(dashboard.total_revenue)}
          icon={TrendingUp}
          gradient="linear-gradient(90deg, #06d6a0, #10b981)"
        />
      </div>

      {dashboard.low_stock_count > 0 && (
        <LowStockAlert products={dashboard.low_stock_products} />
      )}

      <div className={styles.bottomGrid}>
        <RevenueChart ordersByStatus={dashboard.orders_by_status} />
        <RecentOrders orders={dashboard.recent_orders} />
      </div>
    </motion.div>
  );
}
