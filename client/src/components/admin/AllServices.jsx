import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function AllServices() {
  const [services, setServices] = useState([]);

  // Додаємо конфіг з токеном
  const config = {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  };

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/services`, config)
      .then(res => setServices(res.data))
      .catch(err => console.error(err));
  }, []);

  const deleteService = async (id) => {
    if (window.confirm("Видалити цю послугу?")) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/services/${id}`, config);
        setServices(services.filter(s => s.id !== id));
      } catch (err) {
        console.error(err);
        alert("Не вдалося видалити послугу");
      }
    }
  };

  return (
    <div className="row">
      {services.map(s => (
        <div className="col-md-4 mb-3" key={s.id}>
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h6 className="card-title">{s.title}</h6>
              <p className="text-muted small">Майстер: {s.User?.fullName}</p>
              <span className="badge bg-info text-dark mb-2">{s.category}</span>
              <button className="btn btn-sm btn-danger d-block" onClick={() => deleteService(s.id)}>Видалити</button>
            </div>
          </div>
        </div>
      ))}
      
    </div>
  );
}