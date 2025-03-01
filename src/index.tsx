import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Tạo root để render ứng dụng vào DOM
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

// Render App component
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

// Báo cáo hiệu suất (tuỳ chọn)
reportWebVitals();
