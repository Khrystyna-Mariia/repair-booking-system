import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'client',
    phone: '',  
    address: ''
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage(''); // очищуємо старі помилки перед запитом
    
    try {
      // Відправка даних
      await axios.post('http://localhost:5000/api/auth/register', formData);
      
      alert("Реєстрація успішна! Тепер ви можете увійти.");
      navigate('/login'); 
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Помилка при реєстрації';
      setMessage(errorMsg);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card shadow border-0">
            <div className="card-body p-4">
              <h2 className="text-center mb-4">Реєстрація</h2>
              <form onSubmit={handleRegister}>
                <div className="mb-3">
                  <label className="form-label font-weight-bold">Повне ім'я</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Іван Іванов"
                    onChange={e => setFormData({...formData, fullName: e.target.value})} 
                    required 
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input 
                    type="email" 
                    className="form-control" 
                    placeholder="example@mail.com"
                    onChange={e => setFormData({...formData, email: e.target.value})} 
                    required 
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Номер телефону</label>
                  <input 
                    type="tel" 
                    className="form-control" 
                    placeholder="+380991234567"
                    onChange={e => setFormData({...formData, phone: e.target.value})} 
                    required 
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Адреса</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="вул. Незалежності 1, кв. 5"
                    onChange={e => setFormData({...formData, address: e.target.value})} 
                    required={formData.role === 'client'} 
                  />
                  <small className="text-muted">Майстер приїде за цією адресою</small>
                </div>

                <div className="mb-3">
                  <label className="form-label">Пароль</label>
                  <input 
                    type="password" 
                    className="form-control" 
                    placeholder="********"
                    onChange={e => setFormData({...formData, password: e.target.value})} 
                    required 
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label">Тип акаунта</label>
                  <select 
                    className="form-select" 
                    value={formData.role}
                    onChange={e => setFormData({...formData, role: e.target.value})}
                  >
                    <option value="client">Я шукаю майстра (Клієнт)</option>
                    <option value="master">Я спеціаліст (Майстер)</option>
                  </select>
                </div>

                <button type="submit" className="btn btn-primary w-100 mb-3 py-2 fw-bold">
                  Зареєструватися
                </button>

                <div className="text-center">
                  <small>Вже маєте акаунт? <Link to="/login" className="text-decoration-none">Увійти</Link></small>
                </div>
              </form>

              {message && (
                <div className="alert alert-danger mt-3 py-2 text-center small" role="alert">
                  {message}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}