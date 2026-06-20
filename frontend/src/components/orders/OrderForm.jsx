import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus, X, Search } from 'lucide-react';
import { fetchCustomers } from '../../api/customersApi';
import { fetchProducts } from '../../api/productsApi';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { formatCurrency } from '../../utils/formatters';
import styles from '../../styles/modules/OrderForm.module.css';

export default function OrderForm({ onSubmit, loading }) {
  const [step, setStep] = useState(1);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [customerSearch, setCustomerSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [lineItems, setLineItems] = useState([{ product_id: '', quantity: 1 }]);
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchCustomers({ size: 100 }).then((res) => setCustomers(res.items)).catch(() => {});
    fetchProducts({ size: 100 }).then((res) => setProducts(res.items)).catch(() => {});
  }, []);

  const filteredCustomers = useMemo(() => {
    if (!customerSearch) return customers;
    const q = customerSearch.toLowerCase();
    return customers.filter(
      (c) =>
        c.full_name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q)
    );
  }, [customers, customerSearch]);

  const updateLineItem = (index, field, value) => {
    setLineItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const addLineItem = () => {
    setLineItems((prev) => [...prev, { product_id: '', quantity: 1 }]);
  };

  const removeLineItem = (index) => {
    if (lineItems.length <= 1) return;
    setLineItems((prev) => prev.filter((_, i) => i !== index));
  };

  const getProduct = (id) => products.find((p) => p.id === Number(id));

  const lineTotal = useMemo(() => {
    return lineItems.reduce((sum, item) => {
      const product = getProduct(item.product_id);
      if (!product || !item.quantity) return sum;
      return sum + Number(product.price) * Number(item.quantity);
    }, 0);
  }, [lineItems, products]);

  const validate = () => {
    const errs = {};
    if (!selectedCustomer) errs.customer = 'Please select a customer';
    lineItems.forEach((item, i) => {
      if (!item.product_id) errs[`item_${i}_product`] = 'Select a product';
      if (!item.quantity || item.quantity < 1)
        errs[`item_${i}_qty`] = 'Min 1';
      const product = getProduct(item.product_id);
      if (product && Number(item.quantity) > product.quantity)
        errs[`item_${i}_stock`] = `Only ${product.quantity} available`;
    });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validate()) return;
    try {
      await onSubmit({
        customer_id: selectedCustomer.id,
        notes: notes || undefined,
        items: lineItems.map((item) => ({
          product_id: Number(item.product_id),
          quantity: Number(item.quantity),
        })),
      });
    } catch (err) {
      throw err;
    }
  };

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {step === 1 && (
        <div className={styles.step}>
          <h3 className={styles.stepTitle}>Select Customer</h3>
          <div className={styles.searchInput}>
            <Search size={16} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search customers..."
              value={customerSearch}
              onChange={(e) => setCustomerSearch(e.target.value)}
              className={styles.searchField}
            />
          </div>
          {errors.customer && (
            <span className={styles.error}>{errors.customer}</span>
          )}
          <div className={styles.customerList}>
            {filteredCustomers.map((customer) => (
              <div
                key={customer.id}
                className={`${styles.customerItem} ${
                  selectedCustomer?.id === customer.id ? styles.selected : ''
                }`}
                onClick={() => setSelectedCustomer(customer)}
              >
                <div className={styles.customerAvatar}>
                  {customer.full_name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)}
                </div>
                <div>
                  <p className={styles.customerName}>{customer.full_name}</p>
                  <p className={styles.customerEmail}>{customer.email}</p>
                </div>
              </div>
            ))}
            {filteredCustomers.length === 0 && (
              <p className={styles.noResults}>No customers found</p>
            )}
          </div>
          <div className={styles.stepActions}>
            <Button
              disabled={!selectedCustomer}
              onClick={() => setStep(2)}
            >
              Next — Add Products
            </Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className={styles.step}>
          <div className={styles.stepHeader}>
            <h3 className={styles.stepTitle}>Order Items</h3>
            <button className={styles.backBtn} onClick={() => setStep(1)}>
              Change Customer
            </button>
          </div>
          {selectedCustomer && (
            <div className={styles.selectedCustomerBadge}>
              Ordering for: <strong>{selectedCustomer.full_name}</strong>
            </div>
          )}

          <div className={styles.itemsSection}>
            {lineItems.map((item, index) => {
              const product = getProduct(item.product_id);
              return (
                <div key={index} className={styles.itemRow}>
                  <div className={styles.itemFields}>
                    <div className={styles.productSelect}>
                      <select
                        value={item.product_id}
                        onChange={(e) =>
                          updateLineItem(index, 'product_id', e.target.value)
                        }
                        className={styles.select}
                      >
                        <option value="">Select product</option>
                        {products
                          .filter((p) => {
                            const usedInOther = lineItems.some(
                              (li, i) =>
                                i !== index &&
                                Number(li.product_id) === p.id
                            );
                            return !usedInOther || Number(item.product_id) === p.id;
                          })
                          .map((p) => (
                            <option
                              key={p.id}
                              value={p.id}
                              disabled={p.quantity === 0}
                            >
                              {p.name} ({p.sku}) — {p.quantity} in stock
                              {p.quantity === 0 ? ' [Out of Stock]' : ''}
                            </option>
                          ))}
                      </select>
                      {errors[`item_${index}_product`] && (
                        <span className={styles.error}>
                          {errors[`item_${index}_product`]}
                        </span>
                      )}
                    </div>
                    <div className={styles.qtyInput}>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          updateLineItem(index, 'quantity', e.target.value)
                        }
                        className={styles.qtyField}
                      />
                      {errors[`item_${index}_qty`] && (
                        <span className={styles.error}>
                          {errors[`item_${index}_qty`]}
                        </span>
                      )}
                      {errors[`item_${index}_stock`] && (
                        <span className={styles.error}>
                          {errors[`item_${index}_stock`]}
                        </span>
                      )}
                    </div>
                    <div className={styles.subtotal}>
                      {product
                        ? formatCurrency(
                            Number(product.price) * Number(item.quantity || 0)
                          )
                        : '—'}
                    </div>
                    <button
                      className={styles.removeBtn}
                      onClick={() => removeLineItem(index)}
                      disabled={lineItems.length <= 1}
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              );
            })}

            <button className={styles.addItemBtn} onClick={addLineItem}>
              <Plus size={14} /> Add Item
            </button>
          </div>

          {lineItems.length > 0 && (
            <div className={styles.runningTotal}>
              <span>Running Total</span>
              <span className={styles.totalValue}>
                {formatCurrency(lineTotal)}
              </span>
            </div>
          )}

          <div className={styles.notesSection}>
            <label className={styles.notesLabel}>Notes (optional)</label>
            <textarea
              className={styles.notesInput}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any special instructions..."
              rows={2}
            />
          </div>

          <div className={styles.stepActions}>
            <Button variant="ghost" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button onClick={() => setStep(3)}>
              Next — Review
            </Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className={styles.step}>
          <h3 className={styles.stepTitle}>Review & Confirm</h3>
          <div className={styles.reviewSection}>
            <h4>Customer</h4>
            <p>{selectedCustomer?.full_name} — {selectedCustomer?.email}</p>
          </div>
          <div className={styles.reviewSection}>
            <h4>Items ({lineItems.length})</h4>
            {lineItems.map((item, i) => {
              const product = getProduct(item.product_id);
              return (
                <div key={i} className={styles.reviewItem}>
                  <span>{product?.name} × {item.quantity}</span>
                  <span>{formatCurrency(Number(product?.price || 0) * Number(item.quantity))}</span>
                </div>
              );
            })}
          </div>
          <div className={styles.runningTotal}>
            <span>Total</span>
            <span className={styles.totalValue}>{formatCurrency(lineTotal)}</span>
          </div>
          {notes && <p className={styles.reviewNotes}>Notes: {notes}</p>}
          <div className={styles.stepActions}>
            <Button variant="ghost" onClick={() => setStep(2)}>Back</Button>
            <Button onClick={handlePlaceOrder} loading={loading}>Place Order</Button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
