import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

const container = document.getElementById('app');

if (!container) {
  throw new Error('"app" element not found');
}

// <React.StrictMode> render twice in development mode
ReactDOM.createRoot(container).render(
  // <React.StrictMode>
  <BrowserRouter basename={process.env.PUBLIC_URL}>
    <App />
  </BrowserRouter>
  // </React.StrictMode>
);
