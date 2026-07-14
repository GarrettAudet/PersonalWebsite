import React from 'react';
import ReactDOM from 'react-dom/client';
import '@fontsource-variable/inter';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { trackWebVital } from './analytics';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals(trackWebVital);
