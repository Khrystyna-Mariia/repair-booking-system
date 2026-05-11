import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams, useNavigate } from 'react-router-dom';

import Footer from '../components/Footer';

export default function Services() {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState(['Всі']); 
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Всі');
  
  const [selectedService, setSelectedService] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));
  
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('bookingId');
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    bookingDate: '',
    timeSlot: 'morning',
    problemDescription: '',
    address: user?.address || '',
    phone: user?.phone || ''
  });

  // ЗАВАНТАЖЕННЯ КАТЕГОРІЙ ПРИ СТАРТІ
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/services`);
        // Створюємо список унікальних категорій з усіх наявних послуг
        const uniqueCats = ['Всі', ...new Set(res.data.map(s => s.category))];
        setCategories(uniqueCats);
      } catch (error) {
        console.error("Помилка при завантаженні категорій:", error);
      }
    };
    fetchCategories();
  }, []);

  // ЗАВАНТАЖЕННЯ ПОСЛУГ З ФІЛЬТРАЦІЄЮ
  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/services`, {
          params: {
            category: selectedCategory !== 'Всі' ? selectedCategory : undefined,
            search: searchTerm || undefined
          }
        });
        setServices(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Помилка завантаження послуг:", error);
        setLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchServices();
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, selectedCategory]);

  // ЗАВАНТАЖЕННЯ ДАНИХ БРОНЮВАННЯ (якщо редагуємо)
  useEffect(() => {
    if (bookingId && user) {
      const fetchBooking = async () => {
        try {
          const bookRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/bookings?clientId=${user.id}`);
          const existing = bookRes.data.find(b => b.id === parseInt(bookingId));
          if (existing) {
            setFormData({
              bookingDate: existing.bookingDate || '',
              timeSlot: existing.timeSlot || 'morning',
              problemDescription: existing.problemDescription || '',
              address: existing.address || user.address,
              phone: existing.phone || user.phone
            });
          }
        } catch (e) { console.error(e); }
      };
      fetchBooking();
    }
  }, [bookingId, user?.id]);

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    try {
      if (bookingId) {
        await axios.patch(`${import.meta.env.VITE_API_URL}/api/bookings/${bookingId}`, {
          ...formData,
          serviceId: selectedService.id
        });
        alert("Заявку оновлено!");
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/bookings`, {
          ...formData,
          serviceId: selectedService.id,
          clientId: user.id
        });
        alert("Заявку успішно надіслано!");
      }
      setSelectedService(null);
      navigate('/dashboard');
    } catch (error) { alert("Помилка."); }
  };

  const renderStars = (avgRating, reviewsCount) => {
    const rating = parseFloat(avgRating) || 0;
    if (!reviewsCount || reviewsCount === "0" || reviewsCount === 0) 
      return <span className="text-muted small">Немає оцінок</span>;

    return (
      <div className="mb-2">
        <span className="text-warning fw-bold">{rating.toFixed(1)} ★</span>
        <span className="text-muted small ms-1">({reviewsCount})</span>
      </div>
    );
  };

  if (loading && services.length === 0) return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Завантаження...</span>
      </div>
    </div>
  );

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <main className="container flex-grow-1 py-5">
        <div className="text-center mb-5">
          <h2 className="fw-bolder display-6">Каталог послуг</h2>
          <p className="text-muted">Професійна допомога від перевірених майстрів</p>
        </div>
        
        {bookingId && (
          <div className="alert alert-primary border-0 shadow-sm text-center mb-4 rounded-4 py-3">
            <strong>Режим призначення:</strong> Оберіть спеціаліста для вашої заявки.
          </div>
        )}

        {/* Секція фільтрів */}
        <div className="card border-0 shadow-sm rounded-4 p-3 mb-5">
          <div className="row g-3">
            <div className="col-md-8">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <i className="bi bi-search text-muted"></i>
                </span>
                <input 
                  type="text" 
                  className="form-control border-start-0 ps-0" 
                  placeholder="Що ви шукаєте?" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-4">
              <select 
                className="form-select" 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {/* ДИНАМІЧНІ КАТЕГОРІЇ ТУТ */}
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Список послуг */}
        <div className="row">
          {services.length > 0 ? (
            services.map((service) => (
              <div className="col-md-4 mb-4" key={service.id}>
                <div className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden transition-hover">
                  <div className="card-body d-flex flex-column p-4">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <span className="badge px-3 py-2 rounded-pill" style={{backgroundColor: '#e7f1ff', color: '#0d6efd'}}>
                        {service.category}
                      </span>
                      {renderStars(service.avgRating, service.reviewsCount)}
                    </div>
                    
                    <h5 className="card-title fw-bold text-dark mb-2">{service.title}</h5>
                    <p className="card-text text-muted small flex-grow-1">{service.description}</p>
                    
                    <button 
                      className="btn btn-link btn-sm p-0 text-decoration-none fw-semibold mb-3 text-start"
                      onClick={() => navigate(`/services/${service.id}/reviews`)}
                    >
                      Відгуки ({service.reviewsCount || 0})
                    </button>

                    <div className="d-flex align-items-center mb-4 p-3 bg-light rounded-3">
                       <div className="small">
                          <span className="text-muted d-block">Майстер:</span>
                          <strong className="text-dark">{service.User?.fullName}</strong>
                       </div>
                    </div>

                    <button className="btn btn-primary w-100 rounded-pill py-2 fw-bold" onClick={() => {
                      if (!user) return alert("Будь ласка, увійдіть!");
                      setSelectedService(service);
                    }}>
                      {bookingId ? 'Призначити' : 'Замовити'}
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12 text-center py-5">
              <div className="text-muted fs-5">За вашим запитом нічого не знайдено.</div>
            </div>
          )}
        </div>
      </main>

      {selectedService && (
        <div className="modal show d-block" style={{backgroundColor: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(8px)'}}>
           <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header border-0 pb-0">
                <h5 className="fw-bold px-2 pt-3">
                   {bookingId ? 'Деталі призначення' : 'Оформлення заявки'}
                </h5>
                <button type="button" className="btn-close me-2 mt-2" onClick={() => setSelectedService(null)}></button>
              </div>
              <form onSubmit={handleSubmitBooking}>
                <div className="modal-body p-4">
                  <div className="mb-4">
                    <label className="form-label small fw-bold text-muted text-uppercase">Опис задачі</label>
                    <textarea 
                      className="form-control rounded-3" 
                      rows="3" 
                      required
                      placeholder="Напишіть, що потрібно зробити..."
                      value={formData.problemDescription}
                      onChange={e => setFormData({...formData, problemDescription: e.target.value})}
                    ></textarea>
                  </div>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-muted text-uppercase">Дата</label>
                      <input 
                        type="date" 
                        className="form-control rounded-3" 
                        required
                        value={formData.bookingDate}
                        onChange={e => setFormData({...formData, bookingDate: e.target.value})} 
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-muted text-uppercase">Час</label>
                      <select 
                        className="form-select rounded-3" 
                        value={formData.timeSlot} 
                        onChange={e => setFormData({...formData, timeSlot: e.target.value})}
                      >
                        <option value="morning">Ранок</option>
                        <option value="afternoon">День</option>
                        <option value="evening">Вечір</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-0 p-4 pt-0">
                  <button type="submit" className="btn btn-primary w-100 py-3 rounded-pill fw-bold">
                    {bookingId ? 'ПІДТВЕРДИТИ' : 'ЗАМОВИТИ'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}