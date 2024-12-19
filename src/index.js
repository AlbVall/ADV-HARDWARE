import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter, BrowserRouter as Router } from 'react-router-dom'; // Import Router for routing
import App from './App'; // Import your App component
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root')); // Correct way to create the root

root.render(
  <React.StrictMode>
    <BrowserRouter>
   
      <App />
   
    </BrowserRouter>
  </React.StrictMode>
);


reportWebVitals();
