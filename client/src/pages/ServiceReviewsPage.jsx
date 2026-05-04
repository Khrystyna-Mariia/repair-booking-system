import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

import Footer from '../components/Footer';

export default function ServiceReviewsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServiceDetails = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/services/${id}`);
        setService(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Помилка при завантаженні деталей послуги", error);
        setLoading(false);
      }
    };
    fetchServiceDetails();
  }, [id]);

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Завантаження...</span>
      </div>
    </div>
  );

  if (!service) return (
    <div className="container mt-5 text-center py-5">
      <h3 className="text-muted">Послугу не знайдено</h3>
      <button className="btn btn-primary mt-3 rounded-pill px-4" onClick={() => navigate('/services')}>
        Повернутися до каталогу
      </button>
    </div>
  );

  const reviews = service.Bookings?.filter(b => b.Review).map(b => b.Review) || [];
  
  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, rev) => sum + rev.rating, 0) / reviews.length 
    : 0;

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <main className="container flex-grow-1 py-5">
        
        <button 
          className="btn btn-outline-secondary border-0 mb-4 ps-0 d-flex align-items-center gap-2" 
          onClick={() => navigate(-1)}
        >
          <i className="bi bi-arrow-left"></i> Назад
        </button>

        {/* Інформація про послугу */}
        <div className="card shadow-sm border-0 rounded-4 mb-5 overflow-hidden">
          <div className="card-body p-4 p-lg-5 bg-white">
            <div className="row align-items-center">
              <div className="col-md-8">
                <span className="badge px-3 py-2 rounded-pill mb-3" style={{backgroundColor: '#e7f1ff', color: '#0d6efd'}}>
                  {service.category}
                </span>
                <h2 className="fw-bolder display-6 mb-3 text-dark">{service.title}</h2>
                <p className="text-muted fs-5 mb-0">{service.description}</p>
                <div className="mt-3 text-dark">
                  <strong>Майстер:</strong> {service.User?.fullName}
                </div>
              </div>
              <div className="col-md-4 text-md-end mt-4 mt-md-0">
                <div className="d-inline-block p-4 rounded-4 bg-light text-center shadow-sm">
                  <div className="display-5 fw-bold text-primary">{averageRating.toFixed(1)}</div>
                  <div className="text-warning mb-1">
                    {/*  зірочки на основі рейтингу */}
                    {[...Array(5)].map((_, i) => (
                      <i key={i} className={`bi ${i < Math.round(averageRating) ? 'bi-star-fill' : 'bi-star'}`}></i>
                    ))}
                  </div>
                  <div className="small text-muted text-uppercase fw-bold">
                    {service.reviewsCount || reviews.length} відгуків
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Список відгуків */}
        <div className="row justify-content-center">
          <div className="col-lg-9">
            <h4 className="fw-bold mb-4 px-2">Відгуки клієнтів</h4>
            
            {reviews.length > 0 ? (
              <div className="d-flex flex-column gap-3">
                {reviews.map((rev, index) => (
                  <div className="card border-0 shadow-sm rounded-4" key={index}>
                    <div className="card-body p-4">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div>
                          <h6 className="fw-bold mb-1 text-dark">
                            {/* Якщо є об'єкт User у відгуку, беремо ім'я */}
                            {rev.User?.fullName || `Клієнт #${rev.clientId}`}
                          </h6>
                          <div className="text-muted small">
                            {new Date(rev.createdAt).toLocaleDateString('uk-UA', { 
                              day: 'numeric', 
                              month: 'long', 
                              year: 'numeric' 
                            })}
                          </div>
                        </div>
                        <div className="bg-light px-3 py-1 rounded-pill border">
                          <span className="text-warning fw-bold">{rev.rating} / 5</span>
                        </div>
                      </div>
                      <p className="text-secondary fs-6 mb-0 lh-base">
                        "{rev.comment}"
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="card border-0 shadow-sm rounded-4 py-5 text-center bg-white">
                <div className="card-body">
                  <p className="text-muted mb-0">Відгуків поки немає. Будьте першим!</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}