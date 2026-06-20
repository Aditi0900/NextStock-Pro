import { Trash2 } from 'lucide-react';
import Table from '../ui/Table';
import { formatRelativeDate } from '../../utils/formatters';
import styles from '../../styles/modules/CustomerTable.module.css';

export default function CustomerTable({ customers, loading, onDelete }) {
  const columns = [
    {
      key: 'full_name',
      label: 'Full Name',
      render: (row) => (
        <div className={styles.nameCell}>
          <div className={styles.avatar}>
            {row.full_name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase()
              .slice(0, 2)}
          </div>
          <span className={styles.name}>{row.full_name}</span>
        </div>
      ),
    },
    {
      key: 'email',
      label: 'Email',
      render: (row) => <span className={styles.email}>{row.email}</span>,
    },
    {
      key: 'phone',
      label: 'Phone',
      render: (row) => row.phone || <span className={styles.none}>—</span>,
    },
    {
      key: 'created_at',
      label: 'Member Since',
      render: (row) => (
        <span className={styles.date}>{formatRelativeDate(row.created_at)}</span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      width: '80px',
      render: (row) => (
        <button
          className={styles.deleteBtn}
          onClick={(e) => {
            e.stopPropagation();
            onDelete(row);
          }}
          title="Delete"
        >
          <Trash2 size={14} />
        </button>
      ),
    },
  ];

  return <Table columns={columns} data={customers} loading={loading} />;
}
