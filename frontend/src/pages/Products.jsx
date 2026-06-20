import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Plus, Package, Filter } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAppContext } from '../context/AppContext';
import useDebounce from '../hooks/useDebounce';
import Button from '../components/ui/Button';
import SearchBar from '../components/ui/SearchBar';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import Pagination from '../components/ui/Pagination';
import EmptyState from '../components/ui/EmptyState';
import { PageLoader } from '../components/ui/Loader';
import ProductTable from '../components/products/ProductTable';
import ProductForm from '../components/products/ProductForm';
import styles from '../styles/modules/Products.module.css';

const categories = [
  'Electronics',
  'Clothing',
  'Food & Beverages',
  'Furniture',
  'Stationery',
  'Sports',
  'Other',
];

export default function Products() {
  const { state, loadProducts, createProduct, updateProduct, deleteProduct } = useAppContext();
  const { products } = state;

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [lowStock, setLowStock] = useState(false);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const debouncedSearch = useDebounce(search, 300);

  const fetchData = useCallback(() => {
    const params = { page, size: 20, sort_by: sortBy, sort_order: sortOrder };
    if (debouncedSearch) params.search = debouncedSearch;
    if (category) params.category = category;
    if (lowStock) params.low_stock = true;
    loadProducts(params);
  }, [debouncedSearch, category, lowStock, page, sortBy, sortOrder, loadProducts]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, category, lowStock]);

  const handleCreate = async (data) => {
    setSubmitting(true);
    try {
      await createProduct(data);
      toast.success('Product created successfully!');
      setModalOpen(false);
      fetchData();
    } catch (err) {
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (data) => {
    setSubmitting(true);
    try {
      await updateProduct(editProduct.id, data);
      toast.success('Product updated successfully!');
      setModalOpen(false);
      setEditProduct(null);
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
      await deleteProduct(deleteTarget.id);
      toast.success('Product deleted successfully!');
      setDeleteTarget(null);
      fetchData();
    } catch (err) {
      toast.error(err.message || 'Failed to delete product');
    } finally {
      setSubmitting(false);
    }
  };

  const openCreateModal = () => {
    setEditProduct(null);
    setModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditProduct(product);
    setModalOpen(true);
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
        <div className={styles.toolbarLeft}>
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search products..."
          />
          <select
            className={styles.select}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <button
            className={`${styles.lowStockBtn} ${lowStock ? styles.lowStockActive : ''}`}
            onClick={() => setLowStock(!lowStock)}
          >
            <Filter size={14} />
            Low Stock Only
          </button>
        </div>
        <Button icon={Plus} onClick={openCreateModal}>
          Add Product
        </Button>
      </div>

      {products.loading && products.items.length === 0 ? (
        <PageLoader />
      ) : products.items.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No products yet"
          description="Add your first product to get started."
          action={
            <Button icon={Plus} onClick={openCreateModal}>
              Add Product
            </Button>
          }
        />
      ) : (
        <>
          <ProductTable
            products={products.items}
            loading={products.loading}
            onEdit={openEditModal}
            onDelete={setDeleteTarget}
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
            page={products.page}
            pages={products.pages}
            onPageChange={setPage}
          />
        </>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditProduct(null);
        }}
        title={editProduct ? 'Edit Product' : 'Add Product'}
      >
        <ProductForm
          initialData={editProduct}
          onSubmit={editProduct ? handleUpdate : handleCreate}
          loading={submitting}
        />
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Product"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        loading={submitting}
      />
    </motion.div>
  );
}
