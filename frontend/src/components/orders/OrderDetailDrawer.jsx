import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Package } from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchOrder, updateOrderStatus, cancelOrder as cancelOrderApi } from '../../api/ordersApi';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { PageLoader } from '../ui/Loader';
import { formatCurrency, formatDateTime, formatOrderId } from '../../utils/formatters';
import styles from '../../styles/modules/OrderDetailDrawer.module.css';

const statusVariantMap = {
  pending: 'amber',
  confirmed: 'blue',
  shipped: 'purple',
  delivered: 'emerald',
  cancelled: 'red',
};

const statusFlow = ['pending', 'confirmed', 'shipped', 'delivered'];

export default function OrderDetailDrawer({ orderId, onClose, onUpdate }) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (!orderId) return;
    setLoading(true);
    fetchOrder(orderId)
      .then(setOrder)
      .catch(() => toast.error('Failed to load order details'))
      .finally(() => setLoading(false));
  }, [orderId]);

  const handleStatusChange = async (newStatus) => {
    setUpdatingStatus(true);
    try {
      const updated = await updateOrderStatus(orderId, newStatus);
      setOrder(updated);
      toast.success(`Order status updated to ${newStatus}`);
      onUpdate?.();
    } catch (err) {
      toast.error(err.message || 'Failed to update status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleCancel = async () => {
    setCancelling(true);
    try {
      const updated = await cancelOrderApi(orderId);
      setOrder(updated);
      toast.success('Order cancelled! Inventory restored.');
      onUpdate?.();
    } catch (err) {
      toast.error(err.message || 'Failed to cancel order');
    } finally {
      setCancelling(false);
    }
  };

  const currentIndex = statusFlow.indexOf(order?.status);

  return (
    <AnimatePresence>
      {orderId && (
        <>
          <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className={styles.drawer}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            <div className={styles.header}>
              <h2 className={styles.title}>
                Order {formatOrderId(orderId)}
              </h2>
              <button className={styles.closeBtn} onClick={onClose}>
                <X size={20} />
              </button>
            </div>

            {loading ? (
              <PageLoader />
            ) : order ? (
              <div className={styles.body}>
                <div className={styles.statusSection}>
                  <Badge variant={statusVariantMap[order.status]} dot>
                    {order.status}
                  </Badge>
                  <span className={styles.date}>
                    {formatDateTime(order.created_at)}
                  </span>
                </div>

                <div className={styles.section}>
                  <h3 className={styles.sectionTitle}>Customer</h3>
                  <div className={styles.customerCard}>
                    <div className={styles.customerAvatar}>
                      {order.customer.full_name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .slice(0, 2)}
                    </div>
                    <div>
                      <p className={styles.customerName}>
                        {order.customer.full_name}
                      </p>
                      <p className={styles.customerEmail}>
                        {order.customer.email}
                      </p>
                    </div>
                  </div>
                </div>

                <div className={styles.section}>
                  <h3 className={styles.sectionTitle}>Items</h3>
                  <div className={styles.itemsList}>
                    {order.items.map((item) => (
                      <div key={item.id} className={styles.itemRow}>
                        <div className={styles.itemInfo}>
                          <Package size={14} className={styles.itemIcon} />
                          <div>
                            <p className={styles.itemName}>
                              {item.product_name}
                            </p>
                            <p className={styles.itemSku}>{item.sku}</p>
                          </div>
                        </div>
                        <div className={styles.itemDetails}>
                          <span className={styles.itemQty}>
                            {item.quantity} × {formatCurrency(item.unit_price)}
                          </span>
                          <span className={styles.itemSubtotal}>
                            {formatCurrency(item.subtotal)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={styles.totalRow}>
                  <span className={styles.totalLabel}>Total</span>
                  <span className={styles.totalValue}>
                    {formatCurrency(order.total_amount)}
                  </span>
                </div>

                {order.notes && (
                  <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>Notes</h3>
                    <p className={styles.notes}>{order.notes}</p>
                  </div>
                )}

                {currentIndex >= 0 && currentIndex < 3 && (
                  <div className={styles.statusActions}>
                    <Button
                      onClick={() =>
                        handleStatusChange(statusFlow[currentIndex + 1])
                      }
                      loading={updatingStatus}
                    >
                      Mark as {statusFlow[currentIndex + 1]}
                    </Button>
                  </div>
                )}

                {order.status === 'pending' || order.status === 'confirmed' ? (
                  <div className={styles.statusActions}>
                    <Button
                      variant="danger"
                      onClick={handleCancel}
                      loading={cancelling}
                    >
                      Cancel Order
                    </Button>
                  </div>
                ) : null}
              </div>
            ) : null}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
