import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Transfer from './pages/Transfer';
import Transactions from './pages/Transactions';
import Beneficiaries from './pages/Beneficiaries';
import Kyc from './pages/Kyc';
import Notifications from './pages/Notifications';
import Admin from './pages/Admin';
import './styles/app.css';

export default function App(){
  const me = useAuthStore(s => s.me);
  useEffect(() => { me(); }, [me]);
  return <BrowserRouter>
    <Routes>
      <Route path="/login" element={<Login/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="/" element={<ProtectedRoute><Dashboard/></ProtectedRoute>}/>
      <Route path="/transfer" element={<ProtectedRoute><Transfer/></ProtectedRoute>}/>
      <Route path="/transactions" element={<ProtectedRoute><Transactions/></ProtectedRoute>}/>
      <Route path="/beneficiaries" element={<ProtectedRoute><Beneficiaries/></ProtectedRoute>}/>
      <Route path="/kyc" element={<ProtectedRoute><Kyc/></ProtectedRoute>}/>
      <Route path="/notifications" element={<ProtectedRoute><Notifications/></ProtectedRoute>}/>
      <Route path="/admin" element={<ProtectedRoute admin><Admin/></ProtectedRoute>}/>
      <Route path="*" element={<Navigate to="/" replace/>}/>
    </Routes>
  </BrowserRouter>;
}
