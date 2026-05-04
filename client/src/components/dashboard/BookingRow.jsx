import React, { useState } from 'react';
import axios from 'axios';

export default function BookingRow({
  b,
  user,
  setBookings,
  setFilteredBookings,
  expandedRowId,
  toggleRow,
  navigate,
  setEditingBooking,
  setEditDescription,
  setEditDate,
  setEditTimeSlot,
  setSelectedBooking,
  setShowReviewModal,
  updateBookingStatus
}) {
  const [masterNote, setMasterNote] = useState('');
  const [tempPrice, setTempPrice] = useState(b.price || '');

  const shortText =
    b.problemDescription?.length > 40
      ? b.problemDescription.substring(0, 40) + "..."
      : b.problemDescription;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending': return { backgroundColor: '#fff3cd', color: '#856404' }; // Очікує
      case 'confirmed': return { backgroundColor: '#cfe2ff', color: '#084298' }; // Підтверджено
      case 'in_progress': return { backgroundColor: '#e0cffc', color: '#6610f2' }; // В роботі
      case 'completed': return { backgroundColor: '#d1e7dd', color: '#0f5132' }; // Виконано
      case 'cancelled': return { backgroundColor: '#f8d7da', color: '#842029' }; // Скасовано
      default: return { backgroundColor: '#f8f9fa', color: '#212529' };
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending': return 'Очікує';
      case 'confirmed': return 'Підтверджено';
      case 'in_progress': return 'В роботі';
      case 'completed': return 'Виконано';
      case 'cancelled': return 'Скасовано';
      default: return status;
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    if (window.confirm("Ви впевнені, що хочете скасувати цю заявку?")) {
      try {
        await axios.delete(`http://localhost:5000/api/bookings/client/${bookingId}`);
        if (setBookings) setBookings(prev => prev.filter(item => item.id !== bookingId));
        if (setFilteredBookings) setFilteredBookings(prev => prev.filter(item => item.id !== bookingId));
      } catch (error) {
        alert(error.response?.data?.message || "Помилка при видаленні");
      }
    }
  };

  return (
    <>
      <tr onClick={() => toggleRow(b.id)} style={{ cursor: 'pointer', verticalAlign: 'middle' }}>
        <td className="py-3">
          <div className="fw-bold text-dark">{b.bookingDate}</div>
          <div className="small text-muted text-uppercase" style={{ fontSize: '0.75rem' }}>{b.timeSlot}</div>
        </td>

        <td>
          <span className="fw-semibold text-dark">{b.Service?.title || 'Без послуги'}</span>
        </td>

        <td>
          {user.role === 'client' ? (
            b.Service?.User?.fullName ? (
              <span className="text-dark">{b.Service.User.fullName}</span>
            ) : (
              <button
                className="btn btn-sm btn-outline-primary rounded-pill px-3"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/services?bookingId=${b.id}`);
                }}
              >
                Знайти майстра
              </button>
            )
          ) : (
            <span className="text-dark font-medium">{b.User?.fullName}</span>
          )}
        </td>

        <td style={{ maxWidth: '220px' }}>
          <div className="d-flex flex-column">
            <div className="text-muted small text-truncate" title={b.problemDescription}>
              {shortText}
            </div>

            {user.role === 'client' && !['completed', 'cancelled'].includes(b.status) && (
              <div className="d-flex gap-2 mt-2">
                <button
                  className="btn btn-link btn-sm p-0 text-decoration-none text-primary fw-bold"
                  style={{ fontSize: '0.75rem' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingBooking(b);
                    setEditDescription(b.status === 'pending' ? b.problemDescription : '');
                    setEditDate(b.bookingDate || '');
                    setEditTimeSlot(b.timeSlot || 'morning');
                  }}
                >
                  РЕДАГУВАТИ
                </button>
                {b.status === 'pending' && (
                  <button
                    className="btn btn-link btn-sm p-0 text-decoration-none text-danger fw-bold"
                    style={{ fontSize: '0.75rem' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteBooking(b.id);
                    }}
                  >
                    СКАСУВАТИ
                  </button>
                )}
              </div>
            )}
          </div>
        </td>

        <td>
          <span className="badge rounded-pill px-3 py-2 fw-semibold" style={getStatusBadge(b.status)}>
            {getStatusLabel(b.status)}
          </span>

          {user.role === 'client' && b.status === 'completed' && (
            b.Review ? (
              <span className="ms-2 badge bg-light text-success border border-success-subtle">
                Оцінка: {b.Review.rating}/5
              </span>
            ) : (
              <button
                className="btn btn-sm btn-warning ms-2 rounded-pill px-3 fw-bold"
                style={{ fontSize: '0.75rem' }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedBooking(b);
                  setShowReviewModal(true);
                }}
              >
                ОЦІНИТИ
              </button>
            )
          )}
        </td>

        {user.role === 'master' && (
          <td>
            <select
              className="form-select form-select-sm rounded-3 shadow-sm border-0 bg-white"
              value={b.status}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => updateBookingStatus(b.id, e.target.value)}
              style={{ width: '140px' }}
            >
              <option value="pending">Очікує</option>
              <option value="confirmed">Підтвердити</option>
              <option value="in_progress">В роботі</option>
              <option value="completed">Виконано</option>
              <option value="cancelled">Скасувати</option>
            </select>
          </td>
        )}
      </tr>

      {expandedRowId === b.id && (
        <tr>
          <td colSpan="6" className="p-0 border-0">
            <div className="p-4 bg-white border-top border-bottom border-light shadow-inner animate__animated animate__fadeIn">
              <div className="row">
                <div className="col-md-7">
                  <h6 className="fw-bold text-uppercase small text-muted tracking-wider mb-3">Деталі заявки #{b.id}</h6>
                  <div className="d-flex gap-4 mb-3">
                    <div>
                      <span className="text-muted small d-block text-uppercase fw-bold">Адреса</span>
                      <span className="text-dark">{b.address}</span>
                    </div>
                    <div>
                      <span className="text-muted small d-block text-uppercase fw-bold">Телефон</span>
                      <span className="text-dark">{b.phone}</span>
                    </div>
                  </div>
                  <div className="mb-3">
                    <span className="text-muted small d-block text-uppercase fw-bold">Опис поломки</span>
                    <p className="text-dark mb-0 lh-base">{b.problemDescription}</p>
                  </div>

                  {b.masterNotes && (
                    <div className="mt-4">
                      <span className="text-muted small d-block text-uppercase fw-bold mb-1">Коментарі майстра</span>
                      <div className="p-3 bg-light small rounded-3 border-0 text-secondary">
                        {b.masterNotes}
                      </div>
                    </div>
                  )}
                </div>

                <div className="col-md-5 border-start">
                  <div className="ps-md-4">
                    <h6 className="fw-bold text-uppercase small text-muted tracking-wider mb-3">Розрахунок</h6>
                    <div className="mb-4">
                      <span className="text-muted small d-block text-uppercase fw-bold">Вартість робіт</span>
                      <div className="h4 fw-bolder text-primary mb-0">
                        {b.price ? `${b.price} грн.` : <span className="text-muted fs-6">Ціну не встановлено</span>}
                      </div>
                    </div>

                    {user.role === 'master' && (
                      <div className="bg-light p-3 rounded-4 shadow-sm border-0">
                        <div className="mb-2">
                          <label className="form-label small fw-bold text-muted text-uppercase">Встановити ціну (грн):</label>
                          <input 
                            type="number" 
                            className="form-control rounded-3 border-0 shadow-sm mb-2" 
                            value={tempPrice}
                            onChange={(e) => setTempPrice(e.target.value)}
                          />
                        </div>
                        
                        <div className="mb-3">
                          <label className="form-label small fw-bold text-muted text-uppercase">Додати примітку:</label>
                          <textarea 
                            className="form-control rounded-3 border-0 shadow-sm" 
                            rows="2"
                            placeholder="Наприклад: деталі замовлені..."
                            value={masterNote}
                            onChange={(e) => setMasterNote(e.target.value)}
                          />
                        </div>
                        
                        <button 
                          className="btn btn-primary w-100 rounded-pill py-2 fw-bold"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateBookingStatus(b.id, b.status, tempPrice, masterNote);
                            setMasterNote('');
                          }}
                        >
                          Оновити дані
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}