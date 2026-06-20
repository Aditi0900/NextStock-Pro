import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Package } from 'lucide-react';
import Badge from '../ui/Badge';
import styles from '../../styles/modules/LowStockAlert.module.css';

export default function LowStockAlert({ products }) {
  const navigate = useNavigate();

  if (!products || products.length === 0) return null;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <AlertTriangle size={18} className={styles.icon} />
          <span className={styles.title}>
            Low Stock Alert — {products.length} product{products.length > 1 ? 's' : ''} running low
          </span>
        </div>
      </div>
      <div className={styles.list}>
        {products.map((product) => (
          <div
            key={product.id}
            className={styles.item}
            onClick={() => navigate('/products')}
          >
            <div className={styles.itemLeft}>
              <Package size={14} className={styles.itemIcon} />
              <span className={styles.itemName}>{product.name}</span>
              <span className={styles.itemSku}>{product.sku}</span>
            </div>
            <Badge variant={product.quantity <= 5 ? 'red' : 'amber'}>
              {product.quantity} units
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
}
