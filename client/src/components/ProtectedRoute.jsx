import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  // Якщо токена немає — відправляємо на сторінку входу
  if (!token) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;