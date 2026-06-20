import { Edit2, Trash2 } from 'lucide-react';
import Table from '../ui/Table';
import StockBadge from './StockBadge';
import Badge from '../ui/Badge';
import { formatCurrency } from '../../utils/formatters';
import styles from '../../styles/modules/ProductTable.module.css';

export default function ProductTable({ products, loading, onEdit, onDelete, sortBy, sortOrder, onSort }) {
  const columns = [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (row) => (
        <div className={styles.nameCell}>
          <span className={styles.name}>{row.name}</span>
        </div>
      ),
    },
    {
      key: 'sku',
      label: 'SKU',
      render: (row) => <span className={styles.sku}>{row.sku}</span>,
    },
    {
      key: 'category',
      label: 'Category',
      sortable: true,
      render: (row) => row.category || <span className={styles.none}>—</span>,
    },
    {
      key: 'price',
      label: 'Price',
      sortable: true,
      render: (row) => <span className={styles.price}>{formatCurrency(row.price)}</span>,
    },
    {
      key: 'quantity',
      label: 'Stock',
      sortable: true,
      render: (row) => <StockBadge quantity={row.quantity} />,
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => {
        if (row.quantity === 0) return <Badge variant="red">Out of Stock</Badge>;
        if (row.quantity <= 10) return <Badge variant="amber">Low Stock</Badge>;
        return <Badge variant="emerald">In Stock</Badge>;
      },
    },
    {
      key: 'actions',
      label: 'Actions',
      width: '100px',
      render: (row) => (
        <div className={styles.actions}>
          <button
            className={styles.actionBtn}
            onClick={(e) => {
              e.stopPropagation();
              onEdit(row);
            }}
            title="Edit"
          >
            <Edit2 size={14} />
          </button>
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

  return (
    <Table columns={columns} data={products} loading={loading} sortBy={sortBy} sortOrder={sortOrder} onSort={onSort} />
  );
}
