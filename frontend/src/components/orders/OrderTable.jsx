import { Eye, Trash2, XCircle } from 'lucide-react';
import Table from '../ui/Table';
import Badge from '../ui/Badge';
import { formatCurrency, formatOrderId, formatRelativeDate } from '../../utils/formatters';
import styles from '../../styles/modules/OrderTable.module.css';

const statusVariantMap = {
  pending: 'amber',
  confirmed: 'blue',
  shipped: 'purple',
  delivered: 'emerald',
  cancelled: 'red',
};

export default function OrderTable({ orders, loading, onView, onDelete, onCancel, sortBy, sortOrder, onSort }) {
  const cancellable = new Set(['pending', 'confirmed']);
  const columns = [
    {
      key: 'id',
      label: 'Order #',
      sortable: true,
      render: (row) => (
        <span className={styles.orderId}>{formatOrderId(row.id)}</span>
      ),
    },
    {
      key: 'customer_name',
      label: 'Customer',
      sortable: true,
      render: (row) => (
        <span className={styles.customer}>{row.customer_name}</span>
      ),
    },
    {
      key: 'item_count',
      label: 'Items',
      sortable: true,
      render: (row) => (
        <span className={styles.items}>
          {row.item_count} item{row.item_count !== 1 ? 's' : ''}
        </span>
      ),
    },
    {
      key: 'total_amount',
      label: 'Total',
      sortable: true,
      render: (row) => (
        <span className={styles.total}>{formatCurrency(row.total_amount)}</span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (row) => (
        <Badge variant={statusVariantMap[row.status] || 'default'} dot>
          {row.status}
        </Badge>
      ),
    },
    {
      key: 'created_at',
      label: 'Date',
      sortable: true,
      render: (row) => (
        <span className={styles.date}>{formatRelativeDate(row.created_at)}</span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      width: '140px',
      render: (row) => (
        <div className={styles.actions}>
          <button
            className={styles.actionBtn}
            onClick={(e) => {
              e.stopPropagation();
              onView(row);
            }}
            title="View"
          >
            <Eye size={14} />
          </button>
          {cancellable.has(row.status) && (
            <button
              className={`${styles.actionBtn} ${styles.dangerAction}`}
              onClick={(e) => {
                e.stopPropagation();
                onCancel?.(row);
              }}
              title="Cancel"
            >
              <XCircle size={14} />
            </button>
          )}
          <button
            className={`${styles.actionBtn} ${styles.dangerAction}`}
            onClick={(e) => {
              e.stopPropagation();
              onDelete(row);
            }}
            title="Delete"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  return <Table columns={columns} data={orders} loading={loading} sortBy={sortBy} sortOrder={sortOrder} onSort={onSort} />;
}
