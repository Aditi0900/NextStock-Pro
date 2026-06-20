import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import { AppProvider } from './context/AppContext';
import './styles/global.css';
import './styles/animations.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppProvider>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: 'rgba(16, 16, 24, 0.95)',
              color: '#f1f5f9',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
            },
            success: {
              iconTheme: { primary: '#06d6a0', secondary: '#0a0a0f' },
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#0a0a0f' },
            },
            duration: 3000,
          }}
        />
      </AppProvider>
    </BrowserRouter>
  </React.StrictMode>
);
