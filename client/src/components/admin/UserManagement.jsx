import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function UserManagement() {
  const [users, setUsers] = useState([]);

  const config = {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/users', config);
      setUsers(res.data);
    } catch (err) { 
      console.error("Помилка завантаження користувачів:", err); 
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const deleteUser = async (userId) => {
    if (window.confirm("Ви точно хочете видалити цього користувача? Це також може видалити пов'язані з ним дані.")) {
      try {
        await axios.delete(`http://localhost:5000/api/users/${userId}`, config);
        fetchUsers();
      } catch (err) {
        console.error(err);
        alert("Помилка видалення користувача");
      }
    }
  };

  const renderRoleBadge = (role) => {
    const roles = {
      admin: { label: 'Адмін', class: 'bg-danger' },
      master: { label: 'Майстер', class: 'bg-primary' },
      client: { label: 'Клієнт', class: 'bg-success' }
    };
    const current = roles[role] || { label: role, class: 'bg-secondary' };
    return <span className={`badge ${current.class}`}>{current.label}</span>;
  };

  return (
    <div className="card shadow-sm mt-3">
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th>Ім'я</th>
              <th>Роль</th>
              <th>Контакти</th>
              <th className="text-center">Дії</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>
                  <div className="fw-bold">{u.fullName}</div>
                </td>
                <td>{renderRoleBadge(u.role)}</td>
                <td className="small">
                  <div>📞 {u.phone || '—'}</div>
                  <div className="text-muted text-decoration-underline">{u.email}</div>
                </td>
                <td className="text-center">
                  <button 
                    className="btn btn-sm btn-outline-danger" 
                    onClick={() => deleteUser(u.id)}
                    title="Видалити користувача"
                  >
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