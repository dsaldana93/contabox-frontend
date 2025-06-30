import React, { useState } from 'react';
import { Home, Users, DollarSign, BarChart3, Menu, User } from 'lucide-react';
import DashboardHome from './DashboardHome';
import Reports from './Reports';
import Clients from './Clients';
import PaymentValidation from './PaymentValidation';
import './Dashboard.css';

const Dashboard = ({ user, onLogout }) => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarMinimized, setSidebarMinimized] = useState(true);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'clients', label: 'Clientes', icon: Users },
    { id: 'payment-validation', label: 'Validación de pagos', icon: DollarSign },
    { id: 'reports', label: 'Reportes', icon: BarChart3 },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardHome />;
      case 'clients':
        return <Clients />;
      case 'payment-validation':
        return <PaymentValidation />;
      case 'reports':
        return <Reports />;
      default:
        return <DashboardHome />;
    }
  };

  const getPageTitle = () => {
    const item = menuItems.find(item => item.id === activeSection);
    return item ? item.label : 'Dashboard';
  };

  return (
    <div className={`dashboard-container ${sidebarMinimized ? 'sidebar-minimized-layout' : ''}`}>
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''} ${sidebarMinimized ? 'sidebar-minimized' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="logo-circle">C</div>
            {!sidebarMinimized && <span className="logo-text">contabilízate</span>}
          </div>
          <button
            className="sidebar-toggle"
            onClick={() => setSidebarMinimized(!sidebarMinimized)}
            title={sidebarMinimized ? 'Expandir sidebar' : 'Minimizar sidebar'}
          >
            <Menu size={16} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  setSidebarOpen(false);
                  // Auto-minimize sidebar after selection on desktop
                  if (window.innerWidth >= 768) {
                    setSidebarMinimized(true);
                  }
                }}
                className={`nav-item ${activeSection === item.id ? 'nav-item-active' : ''}`}
                title={sidebarMinimized ? item.label : ''}
              >
                <Icon size={20} />
                {!sidebarMinimized && <span className="nav-text">{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <header className="main-header">
          <div className="header-left">
            <button
              className="menu-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu size={24} />
            </button>
            <h1 className="page-title">{getPageTitle()}</h1>
          </div>

          <div className="header-right">
            <div className="user-menu">
              <button className="user-button" onClick={onLogout}>
                <User size={20} />
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="content-area">
          {renderContent()}
        </main>
      </div>

      {/* Sidebar Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;