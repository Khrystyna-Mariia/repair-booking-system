import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserManagement from '../components/admin/UserManagement';
import AllServices from '../components/admin/AllServices';
import AllBookings from '../components/admin/AllBookings';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('users');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="container mt-4">
      <header className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
        <h2 className="text-danger"> Панель Адміністратора</h2>
        <button onClick={handleLogout} className="btn btn-outline-dark btn-sm">Вийти</button>
      </header>

      {/* Навігація  */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
            Користувачі
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'services' ? 'active' : ''}`} onClick={() => setActiveTab('services')}>
            Послуги майстрів
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'bookings' ? 'active' : ''}`} onClick={() => setActiveTab('bookings')}>
            Усі замовлення
          </button>
        </li>
      </ul>

      {/* Контент вкладок */}
      <div className="tab-content">
        {activeTab === 'users' && <UserManagement />}
        {activeTab === 'services' && <AllServices />}
        {activeTab === 'bookings' && <AllBookings />}
      </div>

      

      <footer className="py-3 mt-5 border-top text-center text-muted small"><p className="mb-0">&copy; 2026 HelpBridge Platform.</p></footer>
    </div>
  );
}