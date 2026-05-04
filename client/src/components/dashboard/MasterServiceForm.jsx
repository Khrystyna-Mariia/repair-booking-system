import React from 'react';

export default function MasterServiceForm({ newService, setNewService, handleAddService }) {
  return (
    <div className="card shadow-sm mb-5 border-0">
      <div className="card-header bg-primary text-white">
        <h5 className="mb-0">Додати нову спеціалізацію</h5>
      </div>
      <div className="card-body bg-light">
        <form onSubmit={handleAddService} className="row g-3">
          <div className="col-md-5">
            <input type="text" className="form-control" placeholder="Назва (н-р: Ремонт пральних машин)" 
              value={newService.title} onChange={e => setNewService({...newService, title: e.target.value})} required />
          </div>
          <div className="col-md-3">
            <input type="text" className="form-control" placeholder="Категорія" 
              value={newService.category} onChange={e => setNewService({...newService, category: e.target.value})} required />
          </div>
          <div className="col-md-4 d-flex gap-2">
            <input type="text" className="form-control" placeholder="Короткий опис" 
              value={newService.description} onChange={e => setNewService({...newService, description: e.target.value})} />
            <button className="btn btn-success px-4" type="submit">Додати</button>
          </div>
        </form>
      </div>
    </div>
  );
}