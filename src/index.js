import React from 'react'
import ReactDOM from 'react-dom/client'
import { AppRotas } from './Routes';
import { AuthProvider } from './pages/login/context';
import 'boxicons/css/boxicons.min.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <AppRotas></AppRotas>
    </AuthProvider>
  </React.StrictMode>
)
