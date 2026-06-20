import { format, formatDistanceToNow } from 'date-fns';

export function formatCurrency(value) {
  const num = Number(value);
  if (isNaN(num)) return '₹ 0.00';
  return `₹ ${num.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return format(date, 'dd MMM yyyy');
}

export function formatDateTime(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return format(date, 'dd MMM yyyy, h:mm a');
}

export function formatRelativeDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return formatDistanceToNow(date, { addSuffix: true });
}

export function truncate(str, len = 50) {
  if (!str) return '';
  if (str.length <= len) return str;
  return str.substring(0, len) + '...';
}

export function formatOrderId(id) {
  return `#${String(id).padStart(4, '0')}`;
}

export function abbreviateNumber(num) {
  if (num >= 10000000) return `${(num / 10000000).toFixed(1)}Cr`;
  if (num >= 100000) return `${(num / 100000).toFixed(1)}L`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}
