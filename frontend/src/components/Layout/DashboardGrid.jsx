import React from 'react';
import KpiPrincipal from '../KPIs/KpiPrincipal';
import KpiSecundario from '../KPIs/KpiSecundario';
import MapaMundial from '../Charts/MapaMundial';
import GraficoDispersion from '../Charts/GraficoDispersion';
import BarrasHorizontales from '../Charts/BarrasHorizontales';
import GraficoLineas from '../Charts/GraficoLineas';
import BarrasAgrupadas from '../Charts/BarrasAgrupadas';

const DashboardGrid = ({ datosGlobales = {}, filtroAnio = '2024', filtroRegion = 'todas' }) => {
  const { 
    kpis = {}, 
    mapa = [], 
    dispersion = [], 
    apoyoSocial = [], 
    libertadRegiones = [], 
    evolucion = [] 
  } = datosGlobales || {};

  if (!datosGlobales || Object.keys(datosGlobales).length === 0) {
    return (
      <div className="contenedor-prueba">
        <h3>🔄 Cargando datos...</h3>
        <p>Esperando respuesta del servidor...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* === NIVEL 1: KPIs PRINCIPALES === */}
      <div className="kpis-grid">
      <KpiPrincipal valor={kpis.felicidad_promedio || "7.2"} />
      <KpiSecundario 
        titulo="PIB per cápita" 
        valor={kpis.pib_promedio || "1.24"} 
        descripcion="Log GDP per capita"
        color="datos-contraste"
        tipoMetrica="pib"
      />
      <KpiSecundario 
        titulo="Apoyo Social" 
        valor={kpis.apoyo_social_promedio || "0.83"} 
        descripcion="Social support index"
        color="bienestar-social"
        tipoMetrica="social"
      />
      <KpiSecundario 
        titulo="Esperanza de Vida" 
        valor={kpis.esperanza_vida_promedio || "68.5"} 
        descripcion="Años saludables"
        color="datos-contraste"
        tipoMetrica="vida"
      />
      <KpiSecundario 
        titulo="Libertad" 
        valor={kpis.libertad_promedio || "0.72"} 
        descripcion="Freedom to make choices"
        color="bienestar-social"
        tipoMetrica="libertad"
      />
      </div>

      {/* === NIVEL 2: VISUALIZACIONES PRINCIPALES === */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <MapaMundial datos={mapa} filtroAnio={filtroAnio} />
        <GraficoDispersion datos={dispersion} />
      </div>

      {/* === NIVEL 3: ANÁLISIS COMPARATIVOS === */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <BarrasHorizontales datos={apoyoSocial} filtroAnio={filtroAnio} />
        <BarrasAgrupadas datos={libertadRegiones} filtroAnio={filtroAnio} />
      </div>

      {/* === NIVEL 4: ANÁLISIS TEMPORAL === */}
      <div style={{ marginBottom: '1.5rem' }}>
        <GraficoLineas datos={evolucion} filtroRegion={filtroRegion} />
      </div>
    </div>
  );
};

export default DashboardGrid;