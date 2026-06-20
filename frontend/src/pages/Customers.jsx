import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Plus, Users } from 'lucide-react';
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
import CustomerTable from '../components/customers/CustomerTable';
import CustomerForm from '../components/customers/CustomerForm';
import styles from '../styles/modules/Customers.module.css';

export default function Customers() {
  const { state, loadCustomers, createCustomer, deleteCustomer } = useAppContext();
  const { customers } = state;

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const debouncedSearch = useDebounce(search, 300);

  const fetchData = useCallback(() => {
    const params = { page, size: 20 };
    if (debouncedSearch) params.search = debouncedSearch;
    loadCustomers(params);
  }, [debouncedSearch, page, loadCustomers]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const handleCreate = async (data) => {
    setSubmitting(true);
    try {
      await createCustomer(data);
      toast.success('Customer added successfully!');
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
      await deleteCustomer(deleteTarget.id);
      toast.success('Customer deleted successfully!');
      setDeleteTarget(null);
      fetchData();
    } catch (err) {
      toast.error(err.message || 'Failed to delete customer');
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
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search customers..."
        />
        <Button icon={Plus} onClick={() => setModalOpen(true)}>
          Add Customer
        </Button>
      </div>

      {customers.loading && customers.items.length === 0 ? (
        <PageLoader />
      ) : customers.items.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No customers yet"
          description="Add your first customer to get started."
          action={
            <Button icon={Plus} onClick={() => setModalOpen(true)}>
              Add Customer
            </Button>
          }
        />
      ) : (
        <>
          <CustomerTable
            customers={customers.items}
            loading={customers.loading}
            onDelete={setDeleteTarget}
          />
          <Pagination
            page={customers.page}
            pages={customers.pages}
            onPageChange={setPage}
          />
        </>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add Customer"
      >
        <CustomerForm onSubmit={handleCreate} loading={submitting} />
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Customer"
        message={`Are you sure you want to delete "${deleteTarget?.full_name}"? This action cannot be undone.`}
        loading={submitting}
      />
    </motion.div>
  );
}
