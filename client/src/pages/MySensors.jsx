import { useState, useEffect } from 'react';
import axios from 'axios';

import Footer from '../components/Footer';

export default function MySensors() {
  const [sensors, setSensors] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));

  const fetchSensors = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/sensors?userId=${user.id}`);
      setSensors(res.data);
    } catch (err) {
      console.error("Помилка завантаження даних");
    }
  };

  useEffect(() => {
    fetchSensors();
    const interval = setInterval(fetchSensors, 5000);
    return () => clearInterval(interval);
  }, []);

  const saveName = async (id) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/sensors/${id}`, { name: editName });
      setEditingId(null);
      fetchSensors();
    } catch (err) {
      alert("Не вдалося зберегти назву.");
    }
  };

  const deleteSensor = async (id) => {
    if (window.confirm("Ви впевнені, що хочете видалити цей пристрій зі свого кабінету?")) {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/sensors/${id}`);
      fetchSensors();
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <main className="container flex-grow-1 py-5">
        
        {/* Заголовок та кнопка пошуку */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-3">
          <div>
            <h2 className="fw-bolder mb-1">Мої пристрої</h2>
            <p className="text-muted mb-0">Керування підключеними датчиками та моніторинг показників</p>
          </div>
          <button 
            className={`btn ${isSearching ? 'btn-outline-danger' : 'btn-primary'} px-4 py-2 rounded-pill shadow-sm fw-bold`}
            onClick={() => setIsSearching(!isSearching)}
          >
            {isSearching ? 'Зупинити пошук' : 'Пошук нових пристроїв'}
          </button>
        </div>

        {/* Панель пошуку */}
        {isSearching && (
          <div className="card border-0 shadow-sm mb-5 bg-primary text-white rounded-4 overflow-hidden">
            <div className="card-body p-4 d-flex align-items-center">
              <div className="spinner-grow text-white-50 me-4" role="status" style={{width: '1.5rem', height: '1.5rem'}}></div>
              <div>
                <h5 className="fw-bold mb-1">Режим підключення активовано</h5>
                <p className="mb-0 opacity-75">
                  Увімкніть пристрій. Для прив'язки використовуйте ваш унікальний ID: 
                  <span className="ms-2 badge bg-white text-primary fs-6">{user.id}</span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Список датчиків */}
        <div className="row g-4">
          {sensors.length > 0 ? (
            sensors.map(s => (
              <div key={s.id} className="col-md-6 col-lg-4">
                <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden position-relative transition-hover">
                  
                  {/*  статусу (критичне значення або норма) */}
                  <div style={{ 
                    height: '6px', 
                    backgroundColor: s.lastValue > 30 ? '#ef4444' : '#10b981',
                    transition: 'background-color 0.5s ease'
                  }}></div>

                  <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-start mb-4">
                      <div className="bg-light px-3 py-1 rounded-pill small text-muted fw-bold border">
                        ID: {s.chipId}
                      </div>
                      <span className="badge bg-soft-success text-success small" style={{backgroundColor: '#ecfdf5'}}>
                        Online
                      </span>
                    </div>

                    {editingId === s.id ? (
                      <div className="mb-4">
                        <div className="input-group">
                          <input 
                            className="form-control rounded-start-3" 
                            value={editName} 
                            onChange={e => setEditName(e.target.value)}
                            autoFocus
                          />
                          <button className="btn btn-success rounded-end-3" onClick={() => saveName(s.id)}>Зберегти</button>
                        </div>
                      </div>
                    ) : (
                      <div className="d-flex justify-content-between align-items-center mb-4">
                        <h5 className="fw-bolder mb-0 text-dark">{s.name}</h5>
                        <button 
                          className="btn btn-link btn-sm text-primary p-0 text-decoration-none fw-bold" 
                          onClick={() => {setEditingId(s.id); setEditName(s.name)}}
                        >
                          Змінити назву
                        </button>
                      </div>
                    )}

                    {/* Показник температури / значення */}
                    <div className="text-center py-4 bg-light rounded-4 mb-4">
                      <div className="text-muted small text-uppercase tracking-wider fw-bold mb-1">Поточне значення</div>
                      <div className="display-4 fw-bolder text-dark">
                        {s.lastValue !== null ? `${s.lastValue}°C` : "--"}
                      </div>
                    </div>
                    
                    <button 
                      className="btn btn-outline-danger btn-sm w-100 rounded-pill py-2 fw-bold opacity-75 hover-opacity-100" 
                      onClick={() => deleteSensor(s.id)}
                    >
                      Відключити пристрій
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12 text-center py-5">
              <div className="p-5 bg-white rounded-4 shadow-sm">
                <p className="text-muted fs-5 mb-0">У вас поки немає підключених пристроїв.</p>
                <small className="text-muted">Натисніть "Пошук", щоб додати новий датчик.</small>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}