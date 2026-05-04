import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="mt-auto py-5 bg-light border-top border-light">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
            <h4 className="fw-bolder mb-1 text-dark">
              Smart<span className="text-primary">Repair</span>
            </h4>
            <p className="text-muted mb-0">
              Інноваційна платформа бронювання послуг ремонту
            </p>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <p className="text-muted small mb-0">
              &copy; {new Date().getFullYear()} Всі права захищено.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}