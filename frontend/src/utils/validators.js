import * as yup from 'yup';

export const productSchema = yup.object({
  name: yup
    .string()
    .required('Name is required')
    .max(200, 'Name must be at most 200 characters'),
  sku: yup
    .string()
    .required('SKU is required')
    .matches(/^[a-zA-Z0-9-]+$/, 'SKU can only contain letters, numbers, and hyphens')
    .max(100, 'SKU must be at most 100 characters'),
  category: yup.string().nullable(),
  description: yup.string().nullable(),
  price: yup
    .number()
    .required('Price is required')
    .min(0, 'Price must be ≥ 0')
    .typeError('Price must be a number'),
  quantity: yup
    .number()
    .required('Quantity is required')
    .integer('Quantity must be an integer')
    .min(0, 'Quantity must be ≥ 0')
    .typeError('Quantity must be a number'),
});

export const customerSchema = yup.object({
  full_name: yup
    .string()
    .required('Name is required')
    .max(200, 'Name must be at most 200 characters'),
  email: yup
    .string()
    .required('Email is required')
    .email('Invalid email format'),
  phone: yup.string().nullable(),
});

export const orderItemSchema = yup.object({
  product_id: yup.number().required('Product is required'),
  quantity: yup
    .number()
    .required('Quantity is required')
    .integer('Must be an integer')
    .min(1, 'Quantity must be at least 1'),
});
