import React, { useState, useEffect } from 'react';
import './styles/globals.css';
import Header from './components/Layout/Header';
import Filtros from './components/Layout/Filtros';
import DashboardGrid from './components/Layout/DashboardGrid';

function App() {
  const [filtroAnio, setFiltroAnio] = useState('2024');
  const [filtroRegion, setFiltroRegion] = useState('todas');
  const [datosGlobales, setDatosGlobales] = useState({
    kpis: {},
    mapa: [],
    dispersion: [],
    apoyoSocial: [],
    libertad: []
  });
  const [cargando, setCargando] = useState(true);

  // Cuando cambien los filtros, recargar TODOS los datos
  useEffect(() => {
    const cargarDatos = async () => {
      setCargando(true);
      
      try {
        const [kpisRes, mapaRes, dispersionRes, apoyoSocialRes, libertadRes] = await Promise.all([
          fetch(`http://localhost:3001/api/kpis?anio=${filtroAnio}&region=${filtroRegion}`),
          fetch(`http://localhost:3001/api/mapa?anio=${filtroAnio}&region=${filtroRegion}`),
          fetch(`http://localhost:3001/api/dispersion?anio=${filtroAnio}&region=${filtroRegion}`),
          fetch(`http://localhost:3001/api/apoyo-social?anio=${filtroAnio}&region=${filtroRegion}`),
          fetch(`http://localhost:3001/api/libertad-regiones?anio=${filtroAnio}`)
        ]);

        const [kpis, mapa, dispersion, apoyoSocial, libertad] = await Promise.all([
          kpisRes.json(),
          mapaRes.json(),
          dispersionRes.json(),
          apoyoSocialRes.json(),
          libertadRes.json()
        ]);

        setDatosGlobales({ kpis, mapa, dispersion, apoyoSocial, libertad });
      } catch (error) {
        console.error('Error cargando datos:', error);
        // Datos de ejemplo si falla la conexión
        setDatosGlobales({
          kpis: {
            felicidad_promedio: 7.2,
            pib_promedio: 1.24,
            apoyo_social_promedio: 0.83,
            esperanza_vida_promedio: 68.5,
            libertad_promedio: 0.72
          },
          mapa: [
            { pais: 'Finland', score: 7.8, region: 'Western Europe', year: 2024 },
            { pais: 'Denmark', score: 7.6, region: 'Western Europe', year: 2024 },
            { pais: 'Mexico', score: 6.3, region: 'Latin America', year: 2024 }
          ],
          dispersion: [
            { pais: 'Finland', pib: 1.4, felicidad: 7.8 },
            { pais: 'Mexico', pib: 1.0, felicidad: 6.3 }
          ],
          apoyoSocial: [
            { pais: 'Iceland', social_support: 0.95, region: 'Western Europe' },
            { pais: 'Norway', social_support: 0.92, region: 'Western Europe' }
          ],
          libertad: [
            { region: 'Western Europe', libertad_promedio: 0.85, felicidad_promedio: 7.2 },
            { region: 'Latin America', libertad_promedio: 0.75, felicidad_promedio: 6.2 }
          ]
        });
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, [filtroAnio, filtroRegion]);

  if (cargando && filtroAnio === '2024') {
    return (
      <div className="app">
        <Header />
        <div className="contenedor-prueba">
          <h3>🔄 Conectando con base de datos MySQL...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <Header />
      <Filtros 
        filtroAnio={filtroAnio}
        setFiltroAnio={setFiltroAnio}
        filtroRegion={filtroRegion}
        setFiltroRegion={setFiltroRegion}
      />
      <DashboardGrid 
        datosGlobales={datosGlobales}
        filtroAnio={filtroAnio}
        filtroRegion={filtroRegion}
      />
    </div>
  );
}

export default App;