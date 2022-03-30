import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './App';

const container = document.getElementById('app');

if (!container) {
  throw new Error('"app" element not found');
}

const root = ReactDOM.createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
