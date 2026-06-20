import Badge from '../ui/Badge';

export default function StockBadge({ quantity }) {
  if (quantity === 0) {
    return <Badge variant="red">Out of Stock</Badge>;
  }
  if (quantity <= 5) {
    return <Badge variant="red">{quantity} units</Badge>;
  }
  if (quantity <= 10) {
    return <Badge variant="amber">{quantity} units</Badge>;
  }
  return <Badge variant="emerald">{quantity} units</Badge>;
}
