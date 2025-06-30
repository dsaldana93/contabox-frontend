import React, { useState } from 'react';
import { reportService } from '../services/apiService';
import LoadingSpinner from './LoadingSpinner';
import './Reports.css';

const Reports = () => {
  const [activeView, setActiveView] = useState('list'); // 'list' or 'calculations'
  const [showParameters, setShowParameters] = useState(false);
  const [loading, setLoading] = useState(false);
  const [calculationData, setCalculationData] = useState(null);
  const [parameters, setParameters] = useState({
    month: '',
    year: new Date().getFullYear().toString(),
    rfc: 'SOBA901008FM4',
    objectId: '',
    useObjectId: false,
  });

  const months = [
    { value: '1', label: 'Enero' },
    { value: '2', label: 'Febrero' },
    { value: '3', label: 'Marzo' },
    { value: '4', label: 'Abril' },
    { value: '5', label: 'Mayo' },
    { value: '6', label: 'Junio' },
    { value: '7', label: 'Julio' },
    { value: '8', label: 'Agosto' },
    { value: '9', label: 'Septiembre' },
    { value: '10', label: 'Octubre' },
    { value: '11', label: 'Noviembre' },
    { value: '12', label: 'Diciembre' },
  ];

  const years = Array.from({ length: 10 }, (_, i) => {
    const year = new Date().getFullYear() - 5 + i;
    return { value: year.toString(), label: year.toString() };
  });

  const handleParametersSubmit = async () => {
    // Validar campos según el tipo de consulta
    if (parameters.useObjectId) {
      if (!parameters.objectId || !parameters.rfc) {
        alert('Por favor ingresa RFC y ObjectId');
        return;
      }
    } else {
      if (!parameters.month || !parameters.year || !parameters.rfc) {
        alert('Por favor selecciona RFC, mes y año');
        return;
      }
    }

    setLoading(true);
    try {
      let response;
      
      console.log('Iniciando petición con parámetros:', parameters);
      
      if (parameters.useObjectId) {
        // Usar búsqueda por ObjectId
        console.log('Llamando getCalculationById con:', parameters.objectId, parameters.rfc);
        response = await reportService.getCalculationById(parameters.objectId, parameters.rfc);
      } else {
        // Usar búsqueda por RFC, mes y año
        console.log('Llamando getCalculations con:', parameters.month, parameters.year, parameters.rfc);
        response = await reportService.getCalculations(parameters.month, parameters.year, parameters.rfc);
      }
      
      console.log('API Response recibida:', response);
      
      // Extraer los datos de cálculo de la respuesta
      if (response.success && response.data && response.data.calculations) {
        setCalculationData(response.data.calculations);
      } else {
        // Si no hay datos válidos, usar datos de ejemplo
        setCalculationData(getMockCalculationData());
      }
      
      setActiveView('calculations');
      setShowParameters(false);
    } catch (error) {
      console.error('Error fetching calculations:', error);
      
      // Mostrar mensaje de error específico
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        alert('Error: Tiempo de espera agotado. Verifica que el backend esté ejecutándose en el puerto 8080.');
      } else if (error.message?.includes('Network Error') || error.code === 'ERR_NETWORK') {
        alert('Error de conexión: No se puede conectar al servidor. Verifica que el backend esté ejecutándose.');
      } else {
        alert(`Error al obtener datos: ${error.message || 'Error desconocido'}`);
      }
      
      // Mostrar datos de ejemplo si falla la API
      setCalculationData(getMockCalculationData());
      setActiveView('calculations');
      setShowParameters(false);
    } finally {
      setLoading(false);
    }
  };

  const getMockCalculationData = () => ({
    servicioHospedaje: {
      ingresosMediantes: 0.00,
      ingresosDirectos: 0.00,
      ingresosDirectosServicios: 0.00,
      ingresosTotales: 0.00,
      tasa: 1.00,
      isrCausado: 0.00,
      retencionesPlataforma: 0.00,
    },
    servicioTerrestre: {
      ingresosMediantes: 0.00,
      ingresosDirectos: 0.00,
      ingresosDirectosServicios: 0.00,
      ingresosTotales: 0.00,
      tasa: 4.00,
      isrCausado: 0.00,
      retencionesPlataforma: 0.00,
    }
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount);
  };

  const formatPercentage = (value) => {
    return `${value.toFixed(2)}%`;
  };

  if (loading) {
    return <LoadingSpinner message="Obteniendo datos, un momento por favor" />;
  }

  return (
    <div className="reports-container">
      {activeView === 'list' && (
        <div className="reports-list">
          <h2 className="reports-title">Listado de Reportes</h2>
          
          <div className="report-card">
            <h3 className="report-card-title">Reporte de Status</h3>
            <p className="report-card-description">
              Descarga un excel con el status de todos los clientes.
            </p>
            <button 
              className="parameters-button"
              onClick={() => setShowParameters(true)}
            >
              PARÁMETROS
            </button>
          </div>

          {showParameters && (
            <div className="parameters-modal">
              <div className="parameters-content">
                <div className="parameters-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">RFC</label>
                      <input
                        type="text"
                        value={parameters.rfc}
                        onChange={(e) => setParameters(prev => ({ ...prev, rfc: e.target.value }))}
                        className="form-input"
                        placeholder="Ingresa el RFC"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-checkbox-container">
                        <input
                          type="checkbox"
                          checked={parameters.useObjectId}
                          onChange={(e) => setParameters(prev => ({ ...prev, useObjectId: e.target.checked }))}
                          className="form-checkbox"
                        />
                        <span className="form-checkbox-label">Buscar por ObjectId</span>
                      </label>
                    </div>
                  </div>

                  {parameters.useObjectId ? (
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">ObjectId</label>
                        <input
                          type="text"
                          value={parameters.objectId}
                          onChange={(e) => setParameters(prev => ({ ...prev, objectId: e.target.value }))}
                          className="form-input"
                          placeholder="ObjectId('685d96a89c8534c5fab6dc0f')"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Mes</label>
                        <select
                          value={parameters.month}
                          onChange={(e) => setParameters(prev => ({ ...prev, month: e.target.value }))}
                          className="form-select"
                        >
                          <option value="">Seleccionar mes</option>
                          {months.map(month => (
                            <option key={month.value} value={month.value}>
                              {month.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Año</label>
                        <select
                          value={parameters.year}
                          onChange={(e) => setParameters(prev => ({ ...prev, year: e.target.value }))}
                          className="form-select"
                        >
                          <option value="">Seleccionar año</option>
                          {years.map(year => (
                            <option key={year.value} value={year.value}>
                              {year.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}

                  <div className="form-actions">
                    <button 
                      className="consult-button"
                      onClick={handleParametersSubmit}
                    >
                      CONSULTAR
                    </button>
                    <button 
                      className="close-button"
                      onClick={() => setShowParameters(false)}
                    >
                      CERRAR
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeView === 'calculations' && calculationData && (
        <div className="calculations-view">
          <div className="calculations-header">
            <button 
              className="back-button"
              onClick={() => setActiveView('list')}
            >
              ← Volver a Reportes
            </button>
          </div>

          <div className="calculations-content">
            {/* Servicio de Enajenación de Bienes */}
            {calculationData.servicioEnajenacionBienes && (
              <div className="service-section enajenacion-table" data-table="enajenacion">
                <h3 className="service-title">Servicio de Enajenación de Bienes</h3>
                <div className="calculation-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Ingresos obtenidos mediante intermediarios por enajenación de bienes</th>
                        <th>Ingresos obtenidos mediante intermediarios por prestación de servicios</th>
                        <th>Ingresos obtenidos directamente del usuario por enajenación de bienes</th>
                        <th>Ingresos obtenidos directamente del usuario por prestación de servicios</th>
                        <th>Ingresos totales del mes</th>
                        <th>Tasa %</th>
                        <th>ISR causado</th>
                        <th>Retenciones por plataformas tecnológicas</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{formatCurrency(calculationData.servicioEnajenacionBienes.ingresosMediantesIntermediarios)}</td>
                        <td>{formatCurrency(calculationData.servicioEnajenacionBienes.ingresosMediantesIntermediariosPorEntrega)}</td>
                        <td>{formatCurrency(calculationData.servicioEnajenacionBienes.ingresosDirectamenteDelUsuario)}</td>
                        <td>{formatCurrency(calculationData.servicioEnajenacionBienes.ingresosDirectamenteDelUsuarioPorEntrega)}</td>
                        <td>{formatCurrency(calculationData.servicioEnajenacionBienes.ingresosTotales)}</td>
                        <td>{formatPercentage(calculationData.servicioEnajenacionBienes.tasa)}</td>
                        <td>{formatCurrency(calculationData.servicioEnajenacionBienes.isrCausado)}</td>
                        <td>{formatCurrency(calculationData.servicioEnajenacionBienes.retencionesPlataforma)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Servicio Hospedaje */}
            {calculationData.servicioHospedaje && (
              <div className="service-section hospedaje-table" data-table="hospedaje">
                <h3 className="service-title">Servicio Hospedaje</h3>
                <div className="calculation-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Ingresos obtenidos mediante intermediarios</th>
                        <th>Ingresos obtenidos directamente del usuario</th>
                        <th>Ingresos totales del mes</th>
                        <th>Tasa %</th>
                        <th>ISR causado</th>
                        <th>Retenciones por plataformas tecnológicas</th>
                        <th>ISR a cargo</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{formatCurrency(calculationData.servicioHospedaje.ingresosMediantesIntermediarios)}</td>
                        <td>{formatCurrency(calculationData.servicioHospedaje.ingresosDirectamenteDelUsuario)}</td>
                        <td>{formatCurrency(calculationData.servicioHospedaje.ingresosTotales)}</td>
                        <td>{formatPercentage(calculationData.servicioHospedaje.tasa)}</td>
                        <td>{formatCurrency(calculationData.servicioHospedaje.isrCausado)}</td>
                        <td>{formatCurrency(calculationData.servicioHospedaje.retencionesPlataforma)}</td>
                        <td>{formatCurrency(calculationData.servicioHospedaje.isrACargo)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Servicio Terrestre */}
            {calculationData.servicioTerrestre && (
              <div className="service-section terrestre-table" data-table="terrestre">
                <h3 className="service-title">Servicio Terrestre</h3>
                <div className="calculation-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Ingresos obtenidos mediante intermediarios por servicios terrestres de pasajeros</th>
                        <th>Ingresos obtenidos mediante intermediarios por entrega de bienes</th>
                        <th>Ingresos obtenidos directamente del usuario por servicios terrestres de pasajeros</th>
                        <th>Ingresos obtenidos directamente del usuario por entrega de bienes</th>
                        <th>Ingresos totales del mes</th>
                        <th>Tasa %</th>
                        <th>ISR causado</th>
                        <th>Retenciones por plataformas tecnológicas</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{formatCurrency(calculationData.servicioTerrestre.ingresosMediantesIntermediariosPorServicios)}</td>
                        <td>{formatCurrency(calculationData.servicioTerrestre.ingresosMediantesIntermediariosPorEntrega)}</td>
                        <td>{formatCurrency(calculationData.servicioTerrestre.ingresosDirectamenteDelUsuarioPorServicios)}</td>
                        <td>{formatCurrency(calculationData.servicioTerrestre.ingresosDirectamenteDelUsuarioPorEntrega)}</td>
                        <td>{formatCurrency(calculationData.servicioTerrestre.ingresosTotales)}</td>
                        <td>{formatPercentage(calculationData.servicioTerrestre.tasa)}</td>
                        <td>{formatCurrency(calculationData.servicioTerrestre.isrCausado)}</td>
                        <td>{formatCurrency(calculationData.servicioTerrestre.retencionesPlataforma)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* IVA */}
            {calculationData.iva && (
              <div className="service-section iva-table" data-table="iva">
                <h3 className="service-title">IVA</h3>
                <div className="calculation-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Ingresos obtenidos mediante intermediarios</th>
                        <th>Ingresos obtenidos directamente del usuario</th>
                        <th>Ingresos totales del mes</th>
                        <th>Tasa %</th>
                        <th>IVA causado</th>
                        <th>IVA de gastos (acreditable)</th>
                        <th>Retenciones de IVA por plataforma tecnológica</th>
                        <th>IVA del período a declarar</th>
                        <th>IVA acreditable de períodos anteriores</th>
                        <th>IVA a cargo o a favor</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{formatCurrency(calculationData.iva.ingresosMediantesIntermediarios)}</td>
                        <td>{formatCurrency(calculationData.iva.ingresosDirectamenteDelUsuario)}</td>
                        <td>{formatCurrency(calculationData.iva.ingresosTotales)}</td>
                        <td>{formatPercentage(calculationData.iva.tasa)}</td>
                        <td>{formatCurrency(calculationData.iva.ivaCausado)}</td>
                        <td>{formatCurrency(calculationData.iva.ivaGastos)}</td>
                        <td>{formatCurrency(calculationData.iva.retencionesIvaPlataforma)}</td>
                        <td>{formatCurrency(calculationData.iva.ivaPeriodoDeclarar)}</td>
                        <td>{formatCurrency(calculationData.iva.ivaPeriodosAnteriores || 0)}</td>
                        <td>{formatCurrency(calculationData.iva.ivaACargo || 0)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;