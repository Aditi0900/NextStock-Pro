import { useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { formatCurrency, formatOrderId, formatRelativeDate } from '../../utils/formatters';
import styles from '../../styles/modules/RecentOrders.module.css';

const statusVariantMap = {
  pending: 'amber',
  confirmed: 'blue',
  shipped: 'purple',
  delivered: 'emerald',
  cancelled: 'red',
};

export default function RecentOrders({ orders }) {
  const navigate = useNavigate();

  if (!orders || orders.length === 0) {
    return (
      <Card>
        <div className={styles.empty}>
          <ShoppingBag size={24} className={styles.emptyIcon} />
          <span>No orders yet</span>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className={styles.header}>
        <h3 className={styles.title}>Recent Orders</h3>
        <button className={styles.viewAll} onClick={() => navigate('/orders')}>
          View All <ArrowRight size={14} />
        </button>
      </div>
      <div className={styles.list}>
        {orders.map((order) => (
          <div
            key={order.id}
            className={styles.item}
            onClick={() => navigate('/orders')}
          >
            <div className={styles.itemLeft}>
              <span className={styles.orderId}>{formatOrderId(order.id)}</span>
              <span className={styles.customer}>{order.customer_name}</span>
            </div>
            <div className={styles.itemRight}>
              <span className={styles.itemCount}>
                {order.item_count} item{order.item_count !== 1 ? 's' : ''}
              </span>
              <Badge variant={statusVariantMap[order.status] || 'default'} dot>
                {order.status}
              </Badge>
              <span className={styles.amount}>{formatCurrency(order.total_amount)}</span>
              <span className={styles.date}>{formatRelativeDate(order.created_at)}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
