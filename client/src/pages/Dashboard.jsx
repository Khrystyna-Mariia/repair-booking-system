import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import ProfileCard from '../components/dashboard/ProfileCard';
import MasterServiceForm from '../components/dashboard/MasterServiceForm';
import BookingRow from '../components/dashboard/BookingRow';
import ReviewModal from '../components/dashboard/ReviewModal';
import Footer from '../components/Footer'; 
import './Dashboard.css'; 

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')));

  // СТАН 
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]); 
  const [activeServiceId, setActiveServiceId] = useState(null);
  const [expandedRowId, setExpandedRowId] = useState(null);
  const [myServices, setMyServices] = useState([]);
  const [newService, setNewService] = useState({ title: '', category: '', description: '' });
  const [editingService, setEditingService] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false); 
  const [editingBooking, setEditingBooking] = useState(null);
  const [editDescription, setEditDescription] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editTimeSlot, setEditTimeSlot] = useState('morning');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    address: user?.address || '',
    avatarUrl: user?.avatarUrl || ''
  });
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });

  // ЛОГІКА ТА API 
  const fetchMyServices = useCallback(async () => {
    if (user?.role !== 'master' || !user?.id) return;
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/services?masterId=${user.id}`);
      setMyServices(res.data);
    } catch (err) { console.error("Помилка завантаження послуг", err); }
  }, [user]);

  const fetchBookings = useCallback(async () => {
    if (!user?.id) return;
    try {
      const role = user.role?.toLowerCase().trim(); 
      const queryParam = role === 'client' ? `clientId=${user.id}` : `masterId=${user.id}`;
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/bookings?${queryParam}`);
      setBookings(response.data);
      setFilteredBookings(response.data); 
    } catch (error) { console.error("Помилка при завантаженні заявок", error); }
  }, [user]);

  useEffect(() => {
    if (!user) { navigate('/', { replace: true }); return; }
    if (user.role === 'admin') { navigate('/admin', { replace: true }); return; }
    fetchBookings();
    if (user.role === 'master') fetchMyServices();
  }, [user, navigate, fetchBookings, fetchMyServices]);

  const filterByService = (serviceId) => {
    if (activeServiceId === serviceId) {
      setActiveServiceId(null);
      setFilteredBookings(bookings);
    } else {
      setActiveServiceId(serviceId);
      setFilteredBookings(bookings.filter(b => b.serviceId === serviceId));
    }
  };

  const updateBookingStatus = async (id, newStatus, price = null, masterNote = null) => {
    try {
      const payload = { status: newStatus };
      if (price !== null && price !== '') payload.price = parseFloat(price);
      if (masterNote && masterNote.trim() !== '') payload.masterNote = masterNote;
      const res = await axios.patch(`${import.meta.env.VITE_API_URL}/api/bookings/${id}`, payload);
      if (res.status === 200) {
        fetchBookings();
        if (masterNote || price) alert("Дані оновлено!");
      }
    } catch (error) { console.error("Деталі помилки:", error.response?.data || error.message); }
  };

  const handleAddService = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/services`, { ...newService, masterId: user.id });
      alert("Спеціалізацію додано!");
      setNewService({ title: '', category: '', description: '' });
      setShowAddForm(false); 
      fetchMyServices();
    } catch (error) { alert("Помилка при додаванні"); }
  };

  const handleUpdateService = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`${import.meta.env.VITE_API_URL}/api/services/${editingService.id}`, editingService);
      alert("Послугу оновлено!");
      setEditingService(null);
      fetchMyServices();
    } catch (err) { alert("Помилка оновлення"); }
  };

  const handleDeleteService = async (serviceId) => {
    if (!window.confirm("Ви впевнені?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/services/${serviceId}`);
      setEditingService(null);
      fetchMyServices();
    } catch (err) { alert("Помилка при видаленні."); }
  };

  const handleLogout = () => { localStorage.clear(); setUser(null); navigate('/'); };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`${import.meta.env.VITE_API_URL}/api/users/${user.id}`, profileData);
      const updatedUser = { ...user, ...profileData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      alert("Профіль оновлено!");
      setIsEditingProfile(false);
    } catch (error) { alert("Помилка при оновленні профілю"); }
  };

  const handleUpdateBooking = async (e) => {
    e.preventDefault();
    try {
      const finalDescription = editingBooking.status === 'pending'
        ? editDescription
        : `${editingBooking.problemDescription}\n\n[Доповнення від ${new Date().toLocaleDateString()}]: ${editDescription}`;
      const updateData = { problemDescription: finalDescription };
      if (editingBooking.status === 'pending') {
        updateData.bookingDate = editDate;
        updateData.timeSlot = editTimeSlot;
      }
      await axios.patch(`${import.meta.env.VITE_API_URL}/api/bookings/${editingBooking.id}`, updateData);
      setEditingBooking(null);
      fetchBookings();
    } catch (error) { alert("Помилка при оновленні"); }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/reviews`, {
        rating: reviewData.rating,
        comment: reviewData.comment,
        bookingId: selectedBooking.id,
        clientId: user.id,
        masterId: selectedBooking.Service?.masterId || selectedBooking.Service?.User?.id
      });
      setShowReviewModal(false);
      setReviewData({ rating: 5, comment: '' });
      fetchBookings();
    } catch (error) { alert("Помилка відгуку"); }
  };

  if (!user) return null;

  return (
    <div className="dashboard-page d-flex flex-column min-vh-100">

      <main className="container flex-grow-1 pb-5">
        
        {/* PROFILE SECTION */}
        <div className="row mb-4">
            <div className="col-12">
                <ProfileCard 
                    user={user} 
                    isEditingProfile={isEditingProfile} 
                    setIsEditingProfile={setIsEditingProfile}
                    profileData={profileData} 
                    setProfileData={setProfileData} 
                    handleUpdateProfile={handleUpdateProfile}
                />
            </div>
        </div>

        {user.role === 'client' && (
          <div className="card iot-card stat-card shadow-sm mb-5">
            <div className="card-body d-flex justify-content-between align-items-center p-4">
              <div>
                <h4 className="card-title mb-1 fw-bold">🛰️ Smart IoT Моніторинг</h4>
                <p className="card-text mb-0 opacity-75">Ваші датчики підключені та працюють у фоновому режимі.</p>
              </div>
              <button className="btn btn-light shadow-sm px-4 rounded-pill" onClick={() => navigate('/sensors')}>Керувати пристроями</button>
            </div>
          </div>
        )}

        {user.role === 'master' && (
          <div className="mb-5">
            <h4 className="section-title"> Мої спеціалізації</h4>
            <div className="row g-4 mb-4">
              {myServices.map(service => (
                <div className="col-md-4" key={service.id}>
                  <div className={`card stat-card h-100 shadow-sm border-0 border-top border-4 ${activeServiceId === service.id ? 'border-primary' : 'border-light'}`}>
                    <div className="card-body">
                      <h5 className="fw-bold text-dark">{service.title}</h5>
                      <span className="badge bg-primary-subtle text-primary mb-3">{service.category}</span>
                      <div className="d-flex gap-2 mt-2">
                        <button 
                          className={`btn btn-sm rounded-pill px-3 ${activeServiceId === service.id ? 'btn-primary' : 'btn-outline-primary'}`}
                          onClick={() => filterByService(service.id)}
                        >
                          {activeServiceId === service.id ? 'Всі заявки' : 'Заявки'}
                        </button>
                        <button className="btn btn-sm btn-outline-secondary rounded-pill px-3" onClick={() => setEditingService(service)}>Редагувати</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="col-md-4">
                <div 
                  className="card h-100 btn-add-service d-flex align-items-center justify-content-center p-4" 
                  style={{ cursor: 'pointer', minHeight: '140px' }}
                  onClick={() => setShowAddForm(!showAddForm)}
                >
                  <div className="text-primary fw-bold text-center">
                    {showAddForm ? '✕ Закрити форму' : <><div className="display-6">+</div> <div>Додати нову послугу</div></>}
                  </div>
                </div>
              </div>
            </div>

            {showAddForm && (
              <div className="card stat-card shadow-sm border-0 mb-5">
                <div className="card-body p-4">
                  <h5 className="fw-bold mb-4">Нова послуга</h5>
                  <MasterServiceForm newService={newService} setNewService={setNewService} handleAddService={handleAddService} />
                </div>
              </div>
            )}
          </div>
        )}

        {/* BOOKINGS TABLE SECTION */}
        <div className="bookings-table-container">
          <div className="p-4 bg-dark text-white d-flex justify-content-between align-items-center">
            <h5 className="mb-0 fw-bold">
              {user.role === 'client' ? '🗓️ Мої замовлення' : '📋 Заявки від клієнтів'}
              {activeServiceId && <span className="badge bg-primary ms-3">Фільтр активний</span>}
            </h5>
          </div>
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead>
                <tr>
                  <th>Дата / Слот</th>
                  <th>Послуга</th>
                  <th>{user.role === 'client' ? 'Майстер' : 'Клієнт'}</th>
                  <th>Опис проблеми</th>
                  <th>Статус</th>
                  {user.role === 'master' && <th className="text-end">Керування</th>}
                </tr>
              </thead>
              <tbody>
                {filteredBookings.length === 0 ? (
                  <tr><td colSpan="6" className="text-center py-5 text-muted fs-5">Поки що жодних заявок...</td></tr>
                ) : (
                  filteredBookings.map((b) => (
                    <BookingRow 
                      key={b.id} b={b} user={user}
                      setBookings={setBookings} 
                      setFilteredBookings={setFilteredBookings}
                      expandedRowId={expandedRowId}
                      toggleRow={(id) => setExpandedRowId(expandedRowId === id ? null : id)}
                      navigate={navigate}
                      setEditingBooking={setEditingBooking}
                      setEditDescription={setEditDescription}
                      setEditDate={setEditDate}
                      setEditTimeSlot={setEditTimeSlot}
                      setSelectedBooking={setSelectedBooking}
                      setShowReviewModal={setShowReviewModal}
                      updateBookingStatus={updateBookingStatus}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {editingService && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(4px)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow-lg p-2">
              <div className="modal-header border-0">
                <h5 className="fw-bold">Налаштування послуги</h5>
                <button className="btn-close" onClick={() => setEditingService(null)}></button>
              </div>
              <form onSubmit={handleUpdateService}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label small fw-bold">Назва</label>
                    <input type="text" className="form-control rounded-3" value={editingService.title} onChange={e => setEditingService({...editingService, title: e.target.value})} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-bold">Опис</label>
                    <textarea className="form-control rounded-3" rows="4" value={editingService.description} onChange={e => setEditingService({...editingService, description: e.target.value})} />
                  </div>
                </div>
                <div className="modal-footer border-0 d-flex justify-content-between">
                  <button type="button" className="btn btn-link text-danger text-decoration-none" onClick={() => handleDeleteService(editingService.id)}>Видалити послугу</button>
                  <button type="submit" className="btn btn-primary px-4 rounded-pill">Зберегти</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <ReviewModal showReviewModal={showReviewModal} setShowReviewModal={setShowReviewModal} reviewData={reviewData} setReviewData={setReviewData} handleSubmitReview={handleSubmitReview} />

      {editingBooking && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(4px)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header border-0"><h5 className="fw-bold">Редагування заявки</h5><button className="btn-close" onClick={() => setEditingBooking(null)}></button></div>
              <form onSubmit={handleUpdateBooking}>
                <div className="modal-body">
                  {editingBooking.status === 'pending' && (
                    <div className="row g-3 mb-4">
                      <div className="col-md-6"><label className="form-label small fw-bold">Нова дата</label><input type="date" className="form-control" value={editDate} onChange={e => setEditDate(e.target.value)} /></div>
                      <div className="col-md-6"><label className="form-label small fw-bold">Час</label><select className="form-select" value={editTimeSlot} onChange={e => setEditTimeSlot(e.target.value)}><option value="morning">Ранок</option><option value="afternoon">День</option><option value="evening">Вечір</option></select></div>
                    </div>
                  )}
                  <label className="form-label small fw-bold">Додати коментар</label>
                  <textarea className="form-control" rows="4" value={editDescription} onChange={e => setEditDescription(e.target.value)} placeholder="Опишіть деталі..." required />
                </div>
                <div className="modal-footer border-0"><button type="submit" className="btn btn-primary w-100 rounded-pill py-2 fw-bold">Підтвердити зміни</button></div>
              </form>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}