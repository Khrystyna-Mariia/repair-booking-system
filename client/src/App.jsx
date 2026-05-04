import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Services from './pages/Services';
import MySensors from './pages/MySensors'; 
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './pages/AdminDashboard';
import ServiceReviewsPage from './pages/ServiceReviewsPage';

function App() {
  const user = JSON.parse(localStorage.getItem('user'));
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/services" element={<Services />} />
        
        <Route 
          path="/sensors" 
          element={
            <ProtectedRoute>
              <MySensors />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/admin" 
          element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/dashboard" />} 
        />

        <Route path="/services/:id/reviews" element={<ServiceReviewsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;