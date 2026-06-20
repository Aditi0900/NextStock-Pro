import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { motion } from 'framer-motion';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { productSchema } from '../../utils/validators';
import styles from '../../styles/modules/ProductForm.module.css';

export default function ProductForm({ initialData, onSubmit, loading }) {
  const isEdit = !!initialData;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: yupResolver(productSchema),
    defaultValues: initialData || {
      name: '',
      sku: '',
      category: '',
      description: '',
      price: '',
      quantity: '',
    },
  });

  const handleFormSubmit = async (data) => {
    try {
      await onSubmit(data);
    } catch (err) {
      if (err.detail?.includes('SKU')) {
        setError('sku', { message: err.detail || 'SKU already exists' });
      }
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit(handleFormSubmit)}
      className={styles.form}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className={styles.grid}>
        <Input
          label="Product Name *"
          placeholder="Enter product name"
          error={errors.name?.message}
          {...register('name')}
        />
        <Input
          label="SKU *"
          placeholder="e.g. WKB-2024-BLK"
          error={errors.sku?.message}
          {...register('sku')}
        />
      </div>

      <div className={styles.grid}>
        <Input
          label="Category"
          placeholder="e.g. Electronics"
          error={errors.category?.message}
          {...register('category')}
        />
        <div />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Description</label>
        <textarea
          className={styles.textarea}
          placeholder="Enter product description (optional)"
          rows={3}
          {...register('description')}
        />
      </div>

      <div className={styles.grid}>
        <Input
          label="Price *"
          type="number"
          step="0.01"
          placeholder="0.00"
          error={errors.price?.message}
          {...register('price')}
        />
        <Input
          label="Quantity *"
          type="number"
          placeholder="0"
          error={errors.quantity?.message}
          {...register('quantity')}
        />
      </div>

      <div className={styles.actions}>
        <Button type="submit" loading={loading}>
          {isEdit ? 'Update Product' : 'Add Product'}
        </Button>
      </div>
    </motion.form>
  );
}
