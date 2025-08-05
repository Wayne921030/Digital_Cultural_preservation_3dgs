import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', () => {
//     navigator.serviceWorker.register('/sw.js').then(
//       reg => console.log('Service Worker registered.', reg),
//       err => console.error('Service Worker registration failed:', err)
//     );
//   });
// }

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
) 