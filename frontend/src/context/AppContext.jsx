import { createContext, useContext, useReducer, useCallback } from 'react';
import {
  fetchProducts as fetchProductsApi,
  createProduct as createProductApi,
  updateProduct as updateProductApi,
  deleteProduct as deleteProductApi,
} from '../api/productsApi';
import {
  fetchCustomers as fetchCustomersApi,
  createCustomer as createCustomerApi,
  deleteCustomer as deleteCustomerApi,
} from '../api/customersApi';
import {
  fetchOrders as fetchOrdersApi,
  createOrder as createOrderApi,
  deleteOrder as deleteOrderApi,
  updateOrderStatus as updateOrderStatusApi,
  cancelOrder as cancelOrderApi,
} from '../api/ordersApi';
import { fetchDashboardStats as fetchDashboardStatsApi } from '../api/dashboardApi';

const AppContext = createContext();

const initialState = {
  products: { items: [], total: 0, page: 1, size: 20, pages: 0, loading: false, error: null },
  customers: { items: [], total: 0, page: 1, size: 20, pages: 0, loading: false, error: null },
  orders: { items: [], total: 0, page: 1, size: 20, pages: 0, loading: false, error: null },
  dashboard: null,
  dashboardLoading: false,
  dashboardError: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_PRODUCTS':
      return { ...state, products: { ...action.payload, loading: false } };
    case 'SET_PRODUCTS_LOADING':
      return { ...state, products: { ...state.products, loading: true } };
    case 'SET_CUSTOMERS':
      return { ...state, customers: { ...action.payload, loading: false } };
    case 'SET_CUSTOMERS_LOADING':
      return { ...state, customers: { ...state.customers, loading: true } };
    case 'SET_ORDERS':
      return { ...state, orders: { ...action.payload, loading: false } };
    case 'SET_ORDERS_LOADING':
      return { ...state, orders: { ...state.orders, loading: true } };
    case 'SET_DASHBOARD':
      return { ...state, dashboard: action.payload, dashboardLoading: false };
    case 'SET_DASHBOARD_LOADING':
      return { ...state, dashboardLoading: true };
    case 'SET_PRODUCTS_ERROR':
      return { ...state, products: { ...state.products, loading: false, error: action.payload } };
    case 'SET_CUSTOMERS_ERROR':
      return { ...state, customers: { ...state.customers, loading: false, error: action.payload } };
    case 'SET_ORDERS_ERROR':
      return { ...state, orders: { ...state.orders, loading: false, error: action.payload } };
    case 'SET_DASHBOARD_ERROR':
      return { ...state, dashboardLoading: false, dashboardError: action.payload };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const loadProducts = useCallback(async (params = {}) => {
    dispatch({ type: 'SET_PRODUCTS_LOADING' });
    try {
      const data = await fetchProductsApi(params);
      dispatch({ type: 'SET_PRODUCTS', payload: data });
      return data;
    } catch (err) {
      dispatch({ type: 'SET_PRODUCTS_ERROR', payload: err.message || 'Failed to load products' });
      throw err;
    }
  }, []);

  const createProduct = useCallback(async (data) => {
    const result = await createProductApi(data);
    return result;
  }, []);

  const updateProduct = useCallback(async (id, data) => {
    const result = await updateProductApi(id, data);
    return result;
  }, []);

  const deleteProduct = useCallback(async (id) => {
    const result = await deleteProductApi(id);
    return result;
  }, []);

  const cancelOrder = useCallback(async (id) => {
    const result = await cancelOrderApi(id);
    return result;
  }, []);

  const loadCustomers = useCallback(async (params = {}) => {
    dispatch({ type: 'SET_CUSTOMERS_LOADING' });
    try {
      const data = await fetchCustomersApi(params);
      dispatch({ type: 'SET_CUSTOMERS', payload: data });
      return data;
    } catch (err) {
      dispatch({ type: 'SET_CUSTOMERS_ERROR', payload: err.message || 'Failed to load customers' });
      throw err;
    }
  }, []);

  const createCustomer = useCallback(async (data) => {
    const result = await createCustomerApi(data);
    return result;
  }, []);

  const deleteCustomer = useCallback(async (id) => {
    const result = await deleteCustomerApi(id);
    return result;
  }, []);

  const loadOrders = useCallback(async (params = {}) => {
    dispatch({ type: 'SET_ORDERS_LOADING' });
    try {
      const data = await fetchOrdersApi(params);
      dispatch({ type: 'SET_ORDERS', payload: data });
      return data;
    } catch (err) {
      dispatch({ type: 'SET_ORDERS_ERROR', payload: err.message || 'Failed to load orders' });
      throw err;
    }
  }, []);

  const createOrder = useCallback(async (data) => {
    const result = await createOrderApi(data);
    return result;
  }, []);

  const deleteOrder = useCallback(async (id) => {
    const result = await deleteOrderApi(id);
    return result;
  }, []);

  const updateOrderStatus = useCallback(async (id, status) => {
    const result = await updateOrderStatusApi(id, status);
    return result;
  }, []);

  const loadDashboard = useCallback(async () => {
    dispatch({ type: 'SET_DASHBOARD_LOADING' });
    try {
      const data = await fetchDashboardStatsApi();
      dispatch({ type: 'SET_DASHBOARD', payload: data });
      return data;
    } catch (err) {
      dispatch({ type: 'SET_DASHBOARD_ERROR', payload: err.message || 'Failed to load dashboard' });
      throw err;
    }
  }, []);

  const value = {
    state,
    loadProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    loadCustomers,
    createCustomer,
    deleteCustomer,
    loadOrders,
    createOrder,
    deleteOrder,
    updateOrderStatus,
    cancelOrder,
    loadDashboard,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
}
