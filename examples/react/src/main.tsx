import Logbun, { LogbunErrorBoundary } from '@logbun/react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Environmental variables set in .env.local
Logbun.init({
  apiKey: import.meta.env.VITE_LOGBUN_API_KEY,
  endpoint: import.meta.env.VITE_LOGBUN_EVENT_ENDPOINT,
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <LogbunErrorBoundary logbun={Logbun}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </LogbunErrorBoundary>
);
