import React, { useState, useEffect } from 'react';
import { reportService } from '../services/apiService';
import LoadingSpinner from './LoadingSpinner';
import './CFDITable.css';

const CFDITable = ({ objectId, rfc, month, year, cfdiType = 'I', section = 'entidades' }) => {
  const [activeFilter, setActiveFilter] = useState('todos');
  const [cfdiData, setCfdiData] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const filters = [
    { key: 'todos', label: 'Todos' },
    { key: 'no_considerados', label: 'No Considerados' },
    { key: 'considerados', label: 'Sí Considerados' },
    { key: 'sin_xml', label: 'Ingresos sin XML' }
  ];

  useEffect(() => {
    if ((objectId && rfc) || (month && year && rfc)) {
      fetchCFDIData();
    }
  }, [objectId, rfc, month, year, cfdiType, activeFilter]);

  const fetchCFDIData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let response;
      
      if (objectId && rfc) {
        // Use ObjectId search
        response = await reportService.getCFDIData(objectId, rfc, activeFilter, cfdiType, section);
      } else if (month && year && rfc) {
        // Use month/year search
        response = await reportService.getCFDIDataByPeriod(month, year, rfc, activeFilter, cfdiType, section);
      } else {
        throw new Error('Missing required parameters');
      }
      
      if (response.success) {
        setCfdiData(response.data.cfdis || []);
        setSummary(response.data.summary || {});
      } else {
        setError(response.error || 'Error al cargar datos');
        setCfdiData([]);
        setSummary({});
      }
    } catch (err) {
      console.error('Error fetching CFDI data:', err);
      setError('Error de conexión al servidor');
      setCfdiData([]);
      setSummary({});
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-MX');
    } catch {
      return dateString;
    }
  };

  const getStatusIcon = (isConsidered) => {
    return isConsidered ? (
      <span className="status-icon considered" title="Considerado">✓</span>
    ) : (
      <span className="status-icon not-considered" title="No Considerado">✗</span>
    );
  };

  const getFilteredSummary = () => {
    if (!summary) return { count: 0, amount: 0 };
    
    switch (activeFilter) {
      case 'considerados':
        return {
          count: summary.considered_count || 0,
          amount: summary.considered_amount || 0
        };
      case 'no_considerados':
        return {
          count: summary.not_considered_count || 0,
          amount: summary.not_considered_amount || 0
        };
      default:
        return {
          count: summary.total_count || 0,
          amount: summary.total_amount || 0
        };
    }
  };

  if (loading) {
    return <LoadingSpinner message="Cargando datos de CFDI..." />;
  }

  const filteredSummary = getFilteredSummary();

  return (
    <div className="cfdi-table-container">
      <div className="cfdi-header">
        <h2 className="cfdi-title">
          {section === 'recibidos' ? 'Recibidos' : 'Emitidos'} (Ingresos)
        </h2>
        
        {/* Filter Tabs */}
        <div className="filter-tabs">
          {filters.map(filter => (
            <button
              key={filter.key}
              className={`filter-tab ${activeFilter === filter.key ? 'active' : ''}`}
              onClick={() => setActiveFilter(filter.key)}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="cfdi-summary">
        <div className="summary-item">
          <span className="summary-label">Total de registros:</span>
          <span className="summary-value">{filteredSummary.count}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Monto total:</span>
          <span className="summary-value">{formatCurrency(filteredSummary.amount)}</span>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <p>⚠️ {error}</p>
        </div>
      )}

      {/* CFDI Table */}
      <div className="cfdi-table-wrapper">
        <table className="cfdi-table">
          <thead>
            <tr>
              <th>Editar</th>
              <th>Considerable</th>
              <th>Folio fiscal</th>
              <th>Uso CFDI</th>
              <th>Clasificación</th>
              <th>Cliente</th>
              <th>Estatus SAT</th>
              <th>Conceptos</th>
              <th>Fecha de cobro</th>
              <th>Fecha de emisión</th>
              <th>Forma de pago</th>
              <th>Método de pago</th>
              <th>Régimen Emisor</th>
              <th>Tipo de relación</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {cfdiData.length === 0 ? (
              <tr>
                <td colSpan="15" className="no-data">
                  {loading ? 'Cargando...' : 'No hay datos disponibles para el filtro seleccionado'}
                </td>
              </tr>
            ) : (
              cfdiData.map((cfdi, index) => (
                <tr key={cfdi.id || index} className={cfdi.isConsidered ? 'considered-row' : 'not-considered-row'}>
                  <td>
                    <button className="edit-button" title="Editar">
                      ✏️
                    </button>
                  </td>
                  <td className="status-cell">
                    {getStatusIcon(cfdi.isConsidered)}
                  </td>
                  <td className="folio-cell" title={cfdi.uuid}>
                    {cfdi.folioFiscal}
                  </td>
                  <td>{cfdi.usoCFDI}</td>
                  <td className="classification-cell">
                    {cfdi.clasificacion}
                  </td>
                  <td className="client-cell">
                    {cfdi.cliente}
                  </td>
                  <td>
                    <span className={`status-badge ${cfdi.estatusSAT.toLowerCase()}`}>
                      {cfdi.estatusSAT}
                    </span>
                  </td>
                  <td className="concepts-cell">
                    {cfdi.conceptos}
                  </td>
                  <td>{formatDate(cfdi.fechaCobro)}</td>
                  <td>{formatDate(cfdi.fechaEmision)}</td>
                  <td>{cfdi.formaPago}</td>
                  <td>{cfdi.metodoPago}</td>
                  <td>{cfdi.regimen}</td>
                  <td>{cfdi.tipoRelacion}</td>
                  <td className="amount-cell">
                    {formatCurrency(cfdi.total)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Summary */}
      {cfdiData.length > 0 && (
        <div className="table-footer">
          <div className="footer-summary">
            <strong>
              Mostrando {cfdiData.length} registros | 
              Total: {formatCurrency(filteredSummary.amount)}
            </strong>
          </div>
        </div>
      )}
    </div>
  );
};

export default CFDITable;