import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Plus, ShoppingCart, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAppContext } from '../context/AppContext';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import Pagination from '../components/ui/Pagination';
import EmptyState from '../components/ui/EmptyState';
import { PageLoader } from '../components/ui/Loader';
import OrderTable from '../components/orders/OrderTable';
import OrderForm from '../components/orders/OrderForm';
import OrderDetailDrawer from '../components/orders/OrderDetailDrawer';
import styles from '../styles/modules/Orders.module.css';

const statusFilters = [
  { label: 'All', value: '' },
  { label: 'Pending', value: 'pending' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Shipped', value: 'shipped' },
  { label: 'Delivered', value: 'delivered' },
  { label: 'Cancelled', value: 'cancelled' },
];

export default function Orders() {
  const { state, loadOrders, createOrder, cancelOrder, deleteOrder } = useAppContext();
  const { orders } = state;

  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [viewOrderId, setViewOrderId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchData = useCallback(() => {
    const params = { page, size: 20, sort_by: sortBy, sort_order: sortOrder };
    if (statusFilter) params.status = statusFilter;
    loadOrders(params);
  }, [statusFilter, page, sortBy, sortOrder, loadOrders]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    setPage(1);
  }, [statusFilter]);

  const handleCreate = async (data) => {
    setSubmitting(true);
    try {
      await createOrder(data);
      toast.success('Order placed successfully!');
      setModalOpen(false);
      fetchData();
    } catch (err) {
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setSubmitting(true);
    try {
      await deleteOrder(deleteTarget.id);
      toast.success('Order deleted successfully!');
      setDeleteTarget(null);
      fetchData();
    } catch (err) {
      toast.error(err.message || 'Failed to delete order');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async () => {
    setSubmitting(true);
    try {
      await cancelOrder(cancelTarget.id);
      toast.success('Order cancelled successfully! Inventory restored.');
      setCancelTarget(null);
      fetchData();
    } catch (err) {
      toast.error(err.message || 'Failed to cancel order');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      className={styles.page}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className={styles.toolbar}>
        <div className={styles.statusPills}>
          {statusFilters.map((f) => (
            <button
              key={f.value}
              className={`${styles.pill} ${
                statusFilter === f.value ? styles.pillActive : ''
              }`}
              onClick={() => setStatusFilter(f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>
        <Button icon={Plus} onClick={() => setModalOpen(true)}>
          Create Order
        </Button>
      </div>

      {orders.loading && orders.items.length === 0 ? (
        <PageLoader />
      ) : orders.items.length === 0 ? (
        <EmptyState
          icon={ShoppingCart}
          title="No orders yet"
          description="Create your first order to get started."
          action={
            <Button icon={Plus} onClick={() => setModalOpen(true)}>
              Create Order
            </Button>
          }
        />
      ) : (
        <>
          <OrderTable
            orders={orders.items}
            loading={orders.loading}
            onView={(order) => setViewOrderId(order.id)}
            onDelete={setDeleteTarget}
            onCancel={setCancelTarget}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={(key) => {
              if (key === sortBy) {
                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
              } else {
                setSortBy(key);
                setSortOrder('asc');
              }
              setPage(1);
            }}
          />
          <Pagination
            page={orders.page}
            pages={orders.pages}
            onPageChange={setPage}
          />
        </>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Create Order"
        width={600}
      >
        <OrderForm onSubmit={handleCreate} loading={submitting} />
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Order"
        message={`Are you sure you want to delete order #${String(deleteTarget?.id).padStart(4, '0')}? Inventory will be restored.`}
        loading={submitting}
      />

      <ConfirmDialog
        isOpen={!!cancelTarget}
        onClose={() => setCancelTarget(null)}
        onConfirm={handleCancel}
        title="Cancel Order"
        confirmText="Cancel Order"
        message={`Cancel order #${String(cancelTarget?.id).padStart(4, '0')}? Inventory will be restored.`}
        loading={submitting}
      />

      <OrderDetailDrawer
        orderId={viewOrderId}
        onClose={() => setViewOrderId(null)}
        onUpdate={fetchData}
      />
    </motion.div>
  );
}
