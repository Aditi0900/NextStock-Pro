import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import Card from '../ui/Card';
import styles from '../../styles/modules/RevenueChart.module.css';

const CustomTooltip = ({ active, payload, total }) => {
  if (active && payload && payload.length) {
    const pct = total > 0 ? Math.round((payload[0].value / total) * 100) : 0;
    return (
      <div className={styles.tooltip}>
        <span className={styles.tooltipLabel}>{payload[0].name}</span>
        <span className={styles.tooltipValue}>{payload[0].value} orders ({pct}%)</span>
      </div>
    );
  }
  return null;
};

export default function RevenueChart({ ordersByStatus }) {
  const data = useMemo(() => {
    if (!ordersByStatus) return [];
    const colorMap = {
      pending: '#f59e0b',
      confirmed: '#60a5fa',
      shipped: '#a78bfa',
      delivered: '#06d6a0',
      cancelled: '#ef4444',
    };
    return Object.entries(ordersByStatus).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
      fill: colorMap[name] || '#64748b',
    }));
  }, [ordersByStatus]);

  const total = useMemo(
    () => data.reduce((sum, item) => sum + item.value, 0),
    [data]
  );

  if (!data.length) return null;

  return (
    <Card className={styles.chartCard}>
      <h3 className={styles.title}>Orders by Status</h3>
      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={100}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <text x="50%" y="46%" textAnchor="middle" dominantBaseline="middle" className={styles.centerLabel}>
              {total}
            </text>
            <text x="50%" y="56%" textAnchor="middle" dominantBaseline="middle" className={styles.centerSubLabel}>
              Total Orders
            </text>
            <Tooltip content={<CustomTooltip total={total} />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className={styles.legend}>
        {data.map((item) => (
          <div key={item.name} className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: item.fill }} />
            <span className={styles.legendName}>{item.name}</span>
            <span className={styles.legendValue}>
              {total > 0 ? Math.round((item.value / total) * 100) : 0}%
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
