import Logbun, { LogbunErrorBoundary } from '@logbun/react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

Logbun.init({
  // This apiKey is for testing only. Please use your own apiKey
  apiKey: 'yjupgpuhio04fq5xf2phx4fde5740vtg',

  // This endpoint is for testing purposes. Please remove
  endpoint: 'http://localhost:8000/event',
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <LogbunErrorBoundary logbun={Logbun}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </LogbunErrorBoundary>
);
