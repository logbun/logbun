import Logbun, { LogbunErrorBoundary } from '@logbun/react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

Logbun.init({
  apiKey: 'YOUR_API_KEY',
  endpoint: 'http://localhost:8000/event',
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <LogbunErrorBoundary logbun={Logbun}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </LogbunErrorBoundary>
);
