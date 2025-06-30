import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ message = "Cargando..." }) => {
  return (
    <div className="loading-overlay">
      <div className="loading-modal">
        <div className="loading-logo">
          <div className="logo-circle-loading">C</div>
          <span className="logo-text-loading">contabilízate</span>
        </div>
        <div className="loading-content">
          <div className="spinner"></div>
          <p className="loading-message">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;