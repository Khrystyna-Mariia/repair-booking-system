import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  // Функція для перевірки активного посилання
  const isActive = (path) => location.pathname === path ? 'active fw-bold' : '';

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark py-3 shadow-sm sticky-top">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <span className="fs-4 fw-bolder tracking-tight">
            Smart<span className="text-primary">Repair</span>
          </span>
        </Link>
        
        <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center gap-2">
            <li className="nav-item">
              <Link className={`nav-link px-3 ${isActive('/')}`} to="/">Головна</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link px-3 ${isActive('/services')}`} to="/services">Послуги</Link>
            </li>
            
            {user && user.role === 'client' && (
              <li className="nav-item">
                <Link className={`nav-link px-3 ${isActive('/sensors')}`} to="/sensors">
                  Мої датчики
                </Link>
              </li>
            )}

            {!user ? (
              <li className="nav-item ms-lg-2">
                <Link className="btn btn-primary rounded-pill px-4" to="/login">Увійти</Link>
              </li>
            ) : (
              <>
                <li className="nav-item ms-lg-2">
                  <Link className={`nav-link px-3 ${isActive('/dashboard')}`} to="/dashboard">Кабінет</Link>
                </li>
                <li className="nav-item ms-lg-2">
                  <button 
                    className="btn btn-outline-danger btn-sm rounded-pill px-4" 
                    onClick={handleLogout}
                    style={{ transition: 'all 0.3s' }}
                  >
                    Вийти
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}