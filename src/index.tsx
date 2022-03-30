import * as React from 'react';
import * as ReactDOM from 'react-dom/client';

const container = document.getElementById('app');

if (!container) {
  throw new Error('"app" element not found');
}

const root = ReactDOM.createRoot(container);
root.render(
  <React.StrictMode>
    <div>h4</div>
  </React.StrictMode>
);
