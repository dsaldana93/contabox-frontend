import React from 'react';
import { FileText } from 'lucide-react';
import './DashboardHome.css';

const DashboardHome = () => {
  const handleViewDocumentation = () => {
    // Aquí puedes agregar la lógica para abrir la documentación
    window.open('#', '_blank');
  };

  return (
    <div className="dashboard-home">
      <div className="welcome-container">
        <div className="welcome-logo">
          <div className="logo-circle-large">C</div>
          <span className="logo-text-large">contabilízate</span>
        </div>
        
        <div className="welcome-content">
          <h1 className="welcome-title">¡Bienvenido a Contabilízate!</h1>
          <p className="welcome-description">
            Hemos renovado nuestra plataforma para ofrecerte una experiencia
            más rápida, intuitiva y segura.
          </p>
          
          <button 
            className="documentation-button"
            onClick={handleViewDocumentation}
          >
            <FileText size={20} />
            VER DOCUMENTACIÓN
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;