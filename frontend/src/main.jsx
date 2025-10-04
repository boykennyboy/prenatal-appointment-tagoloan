import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'sonner';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Toaster
      richColors
      expand={true}
      position='top-right'
      duration={3000}
      toastOptions={{
        classNames: {
          title: 'text-[16px] font-semibold',
        },
      }}
    />
    <App />
  </StrictMode>
);
