/// <reference types="webpack-env" />
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from '../App';

const container = document.getElementById('app');

if (!container) {
  throw new Error('"app" element not found');
}

ReactDOM.hydrateRoot(
  container,
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

if (module.hot) {
  module.hot.accept();
}
