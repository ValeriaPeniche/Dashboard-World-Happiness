import React from 'react';

const Filtros = ({ filtroAnio, setFiltroAnio, filtroRegion, setFiltroRegion }) => {
  const anios = ['2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015'];
  const regiones = [
    { value: 'todas', label: 'Todas las regiones' },
    { value: 'Western Europe', label: 'Europa Occidental' },
    { value: 'Latin America and Caribbean', label: 'América Latina' },
    { value: 'North America and ANZ', label: 'Norte América' },
    { value: 'Middle East and North Africa', label: 'Medio Oriente' },
    { value: 'Sub-Saharan Africa', label: 'África Subsahariana' },
    { value: 'South Asia', label: 'Asia del Sur' },
    { value: 'East Asia', label: 'Asia del Este' }
  ];

  return (
    <div className="filtros-container">
      <div className="filtros">
        <div className="filtro-grupo">
          <label htmlFor="filtro-anio" className="filtro-label">Año:</label>
          <select 
            id="filtro-anio"
            value={filtroAnio} 
            onChange={(e) => setFiltroAnio(e.target.value)}
            className="filtro-select"
          >
            {anios.map(anio => (
              <option key={anio} value={anio}>{anio}</option>
            ))}
          </select>
        </div>

        <div className="filtro-grupo">
          <label htmlFor="filtro-region" className="filtro-label">Región:</label>
          <select 
            id="filtro-region"
            value={filtroRegion} 
            onChange={(e) => setFiltroRegion(e.target.value)}
            className="filtro-select"
          >
            {regiones.map(region => (
              <option key={region.value} value={region.value}>
                {region.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="filtros-info">
        <span className="info-text">
          Mostrando: <strong>{filtroAnio}</strong>
          {filtroRegion !== 'todas' && ` • ${regiones.find(r => r.value === filtroRegion)?.label}`}
        </span>
      </div>
    </div>
  );
};

export default Filtros;