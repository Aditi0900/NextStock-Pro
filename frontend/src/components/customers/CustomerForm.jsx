import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { motion } from 'framer-motion';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { customerSchema } from '../../utils/validators';
import styles from '../../styles/modules/CustomerForm.module.css';

export default function CustomerForm({ onSubmit, loading }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: yupResolver(customerSchema),
    defaultValues: { full_name: '', email: '', phone: '' },
  });

  const handleFormSubmit = async (data) => {
    try {
      await onSubmit(data);
    } catch (err) {
      if (err.detail?.includes('Email')) {
        setError('email', { message: err.detail || 'Email already registered' });
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
      <Input
        label="Full Name *"
        placeholder="Enter full name"
        error={errors.full_name?.message}
        {...register('full_name')}
      />
      <Input
        label="Email *"
        type="email"
        placeholder="email@example.com"
        error={errors.email?.message}
        {...register('email')}
      />
      <Input
        label="Phone"
        placeholder="+91-9876543210"
        error={errors.phone?.message}
        {...register('phone')}
      />

      <div className={styles.actions}>
        <Button type="submit" loading={loading}>
          Add Customer
        </Button>
      </div>
    </motion.form>
  );
}
