import React from 'react';

export default function ProfileCard({ user, isEditingProfile, setIsEditingProfile, profileData, setProfileData, handleUpdateProfile }) {
  return (
    <>
      {/* Основна картка профілю */}
      <div className="card shadow-sm border-0 rounded-4 overflow-hidden mb-5">
        <div className="card-body p-4 bg-white">
          <div className="row align-items-center">
            <div className="col-auto">
              <div className="bg-primary text-white d-flex align-items-center justify-content-center rounded-circle shadow-sm" style={{ width: '64px', height: '64px', fontSize: '1.5rem', fontWeight: 'bold' }}>
                {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
              </div>
            </div>
            <div className="col">
              <h4 className="fw-bolder text-dark mb-1">{user.fullName}</h4>
              <div className="d-flex flex-wrap gap-3">
                <span className="text-muted small d-flex align-items-center">
                  <i className="bi bi-telephone me-2"></i>
                  {user.phone || 'Телефон не вказано'}
                </span>
                <span className="text-muted small d-flex align-items-center">
                  <i className="bi bi-geo-alt me-2"></i>
                  {user.address || 'Адреса не вказана'}
                </span>
              </div>
            </div>
            <div className="col-auto">
              <button 
                className="btn btn-outline-primary rounded-pill px-4 py-2 fw-bold shadow-sm transition-hover"
                onClick={() => setIsEditingProfile(true)}
              >
                Редагувати профіль
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* вікно редагування */}
      {isEditingProfile && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(10px)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="modal-header border-0 bg-light p-4">
                <h5 className="modal-title fw-bold text-dark">Налаштування профілю</h5>
                <button type="button" className="btn-close" onClick={() => setIsEditingProfile(false)}></button>
              </div>
              <form onSubmit={handleUpdateProfile}>
                <div className="modal-body p-4">
                  <div className="mb-4">
                    <label className="form-label small fw-bold text-muted text-uppercase tracking-wider">Повне ім'я</label>
                    <input 
                      type="text" 
                      className="form-control rounded-3 border-light-subtle py-2 shadow-sm" 
                      value={profileData.fullName}
                      onChange={e => setProfileData({...profileData, fullName: e.target.value})} 
                      required 
                    />
                  </div>
                  <div className="mb-4">
                    <label className="form-label small fw-bold text-muted text-uppercase tracking-wider">Контактний телефон</label>
                    <input 
                      type="text" 
                      className="form-control rounded-3 border-light-subtle py-2 shadow-sm" 
                      value={profileData.phone}
                      onChange={e => setProfileData({...profileData, phone: e.target.value})} 
                    />
                  </div>
                  <div className="mb-4">
                    <label className="form-label small fw-bold text-muted text-uppercase tracking-wider">Основна адреса</label>
                    <input 
                      type="text" 
                      className="form-control rounded-3 border-light-subtle py-2 shadow-sm" 
                      value={profileData.address}
                      onChange={e => setProfileData({...profileData, address: e.target.value})} 
                    />
                  </div>
                </div>
                <div className="modal-footer border-0 p-4 pt-0">
                  <button 
                    type="button" 
                    className="btn btn-light rounded-pill px-4 fw-bold text-muted me-2" 
                    onClick={() => setIsEditingProfile(false)}
                  >
                    СКАСУВАТИ
                  </button>
                  <button type="submit" className="btn btn-primary rounded-pill px-4 fw-bold shadow-sm">
                    ЗБЕРЕГТИ ЗМІНИ
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}