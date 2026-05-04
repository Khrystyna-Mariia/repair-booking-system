import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function AllBookings() {
  const [bookings, setBookings] = useState([]);
  
  const config = {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  };

  const fetchAllBookings = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/bookings/all', config);
      setBookings(res.data);
    } catch (err) { console.error("Помилка", err); }
  };

  useEffect(() => { fetchAllBookings(); }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.patch(`http://localhost:5000/api/bookings/${id}/status`, { status: newStatus }, config);
      fetchAllBookings(); // Оновлюємо дані
    } catch (err) { alert("Не вдалося змінити статус"); }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Видалити цей запис із бази даних?")) {
      try {
        await axios.delete(`http://localhost:5000/api/bookings/${id}`, config);
        fetchAllBookings();
      } catch (err) { alert("Помилка видалення"); }
    }
  };

  return (
    <div className="card border-0 shadow-sm mt-3">
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th>ID</th>
              <th>Клієнт</th>
              <th>Майстер / Послуга</th>
              <th>Статус</th>
              <th>Дії</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(b => (
              <tr key={b.id}>
                <td>#{b.id}</td>
                <td>
                  <div className="fw-bold">{b.User?.fullName}</div>
                  <div className="small text-muted">{b.User?.email}</div>
                </td>
                <td>
                  <div>{b.Service?.title}</div>
                  <div className="small text-primary">Майстер: {b.Service?.User?.fullName || '—'}</div>
                </td>
                <td>
                  <select 
                    className="form-select form-select-sm w-auto"
                    value={b.status}
                    onChange={(e) => handleStatusChange(b.id, e.target.value)}
                  >
                    <option value="pending">Очікує</option>
                    <option value="confirmed">Підтверджено</option>
                    <option value="in_progress">В роботі</option>
                    <option value="completed">Виконано</option>
                    <option value="cancelled">Скасовано</option>
                  </select>
                </td>
                <td>
                  <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(b.id)}>
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
    </div>
    
  );
}