import React, { useState } from 'react';
import { authService } from '../services/apiService';
import './Login.css';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberUser: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Verificar credenciales específicas
    if (formData.email === 'julio.vera@contabilizate.com' && formData.password === '12345678') {
      // Simular respuesta exitosa
      const mockUser = {
        id: 1,
        email: 'julio.vera@contabilizate.com',
        name: 'Julio Vera',
        role: 'admin'
      };
      
      const mockToken = 'mock-jwt-token-12345';
      
      localStorage.setItem('authToken', mockToken);
      localStorage.setItem('user', JSON.stringify(mockUser));
      onLogin(mockUser);
      setLoading(false);
      return;
    }

    // Si las credenciales no coinciden, intentar con el backend
    try {
      const response = await authService.login(formData.email, formData.password);
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      onLogin(response.user);
    } catch (err) {
      setError('Credenciales incorrectas. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-left-panel">
        <div className="login-logo-container">
          <div className="login-logo">C</div>
        </div>
      </div>
      
      <div className="login-right-panel">
        <div className="login-form-container">
          <div className="login-header">
            <div className="login-logo-small">
              <div className="logo-circle">C</div>
            </div>
            <h1 className="login-title">Inicio de sesión</h1>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Correo electrónico *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Contraseña *
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="rememberUser"
                  checked={formData.rememberUser}
                  onChange={handleInputChange}
                  className="checkbox-input"
                />
                <span className="checkbox-text">Recordar usuario</span>
              </label>
            </div>

            <div className="session-warning">
              <div className="warning-icon">⚠</div>
              <span className="warning-text">
                Sin recordar usuario, la sesión expira en 30 minutos
              </span>
            </div>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading ? 'INICIANDO SESIÓN...' : 'INICIAR SESIÓN'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;