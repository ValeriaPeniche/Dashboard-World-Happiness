import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import './MapaMundial.css';

// GeoJSON real de países
const MapaCoropletico = ({ datos = [], filtroAnio = '2024' }) => {
  const [geoData, setGeoData] = useState(null);
  const [cargando, setCargando] = useState(true);

  // Cargar GeoJSON real
  useEffect(() => {
    const cargarGeoJSON = async () => {
      try {
        // Opción 1: Cargar desde URL pública
        const response = await fetch('https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json');
        const data = await response.json();
        setGeoData(data);
        setCargando(false);
      } catch (error) {
        console.error('Error cargando GeoJSON:', error);
        
        // Opción 2: Datos de ejemplo mínimos si falla
        const datosMinimos = {
          type: "FeatureCollection",
          features: [
            // Solo algunos países clave para demo
            {
              type: "Feature",
              properties: { name: "Finland" },
              geometry: { 
                type: "Polygon", 
                coordinates: [[[20, 60], [31.5, 60], [31.5, 70], [20, 70], [20, 60]]] 
              }
            },
            {
              type: "Feature", 
              properties: { name: "Sweden" },
              geometry: { 
                type: "Polygon", 
                coordinates: [[[11, 55], [24, 55], [24, 69], [11, 69], [11, 55]]] 
              }
            },
            {
              type: "Feature",
              properties: { name: "Norway" },
              geometry: { 
                type: "Polygon", 
                coordinates: [[[4, 58], [31, 58], [31, 71], [4, 71], [4, 58]]] 
              }
            },
            {
              type: "Feature",
              properties: { name: "Denmark" },
              geometry: { 
                type: "Polygon", 
                coordinates: [[[8, 54], [15, 54], [15, 58], [8, 58], [8, 54]]] 
              }
            },
            {
              type: "Feature",
              properties: { name: "Mexico" },
              geometry: { 
                type: "Polygon", 
                coordinates: [[[-117, 14], [-86, 14], [-86, 32], [-117, 32], [-117, 14]]] 
              }
            },
            {
              type: "Feature",
              properties: { name: "United States" },
              geometry: { 
                type: "Polygon", 
                coordinates: [[[-125, 24], [-66, 24], [-66, 49], [-125, 49], [-125, 24]]] 
              }
            },
            {
              type: "Feature",
              properties: { name: "Brazil" },
              geometry: { 
                type: "Polygon", 
                coordinates: [[[-74, -33], [-35, -33], [-35, 5], [-74, 5], [-74, -33]]] 
              }
            }
          ]
        };
        setGeoData(datosMinimos);
        setCargando(false);
      }
    };

    cargarGeoJSON();
  }, []);

  // Función mejorada para matching de nombres de países
  const encontrarDatosPais = (countryName) => {
    if (!datos || datos.length === 0) return null;

    const mapeoNombres = {
      // Nombres en GeoJSON -> Nombres en tu BD
      'United States of America': 'United States',
      'United States': 'United States',
      'Russian Federation': 'Russia',
      'Korea, Republic of': 'South Korea',
      'Korea, Democratic People\'s Republic of': 'North Korea',
      'Iran, Islamic Republic of': 'Iran',
      'Viet Nam': 'Vietnam',
      'Czechia': 'Czech Republic',
      'Macedonia': 'North Macedonia',
      'Syrian Arab Republic': 'Syria',
      'Lao People\'s Democratic Republic': 'Laos',
      'Brunei Darussalam': 'Brunei',
      'Myanmar': 'Myanmar',
      'Congo': 'Republic of the Congo',
      'Democratic Republic of the Congo': 'Democratic Republic of the Congo',
      'Tanzania, United Republic of': 'Tanzania',
      'Bolivia, Plurinational State of': 'Bolivia',
      'Venezuela, Bolivarian Republic of': 'Venezuela'
    };

    const nombreNormalizado = mapeoNombres[countryName] || countryName;
    
    return datos.find(pais => {
      const nombrePaisBD = pais.pais.toLowerCase().trim();
      const nombrePaisGeo = nombreNormalizado.toLowerCase().trim();
      
      return nombrePaisBD === nombrePaisGeo ||
             nombrePaisGeo.includes(nombrePaisBD) ||
             nombrePaisBD.includes(nombrePaisGeo);
    });
  };

  // Estilo para cada país - COLORES EN FORMAS REALES
  const estiloPais = (feature) => {
    const countryName = feature.properties.name;
    const datosPais = encontrarDatosPais(countryName);
    
    let fillColor = '#F7FAFC'; // Gris claro para sin datos
    let fillOpacity = 0.8;
    let color = '#4A5568';
    let weight = 0.5;

    if (datosPais && datosPais.score !== null && datosPais.score !== undefined) {
      const score = parseFloat(datosPais.score);
      
      if (score >= 7.0) {
        fillColor = '#FFC300'; // Amarillo - Muy feliz
        color = '#D97706';
        weight = 1;
      } else if (score >= 6.0) {
        fillColor = '#FF9505'; // Naranja - Feliz
        color = '#EA580C';
        weight = 0.8;
      } else if (score >= 5.0) {
        fillColor = '#F08080'; // Coral - Moderado
        color = '#DC2626';
        weight = 0.7;
      } else {
        fillColor = '#97b0d1ff'; // Gris - Bajo
        color = '#8293aaff';
        weight = 0.6;
      }
      fillOpacity = 0.8;
    } else {
      fillOpacity = 0.3; // Más transparente para países sin datos
      color = '#CBD5E0';
    }

    return {
      fillColor,
      fillOpacity,
      color,
      weight,
      opacity: 0.8
    };
  };

  // Popup informativo
  const onEachCountry = (country, layer) => {
    const countryName = country.properties.name;
    const datosPais = encontrarDatosPais(countryName);

    let popupContent = `
      <div class="popup-content">
        <h4>${countryName}</h4>
    `;

    if (datosPais && datosPais.score !== null && datosPais.score !== undefined) {
      const score = parseFloat(datosPais.score);
      popupContent += `
        <p><strong>Índice de Felicidad:</strong> ${score.toFixed(3)}</p>
        <p><strong>Región:</strong> ${datosPais.region || 'N/A'}</p>
        <div class="nivel-felicidad ${
          score >= 7 ? 'muy-feliz' :
          score >= 6 ? 'feliz' :
          score >= 5 ? 'moderado' : 'bajo'
        }">
          ${
            score >= 7 ? 'Muy Feliz' :
            score >= 6 ? 'Feliz' :
            score >= 5 ? 'Moderado' : 'Bajo'
          }
        </div>
      `;
    } else {
      popupContent += `
        <p><em>No hay datos de felicidad disponibles</em></p>
      `;
    }

    popupContent += `</div>`;
    layer.bindPopup(popupContent);
  };

  if (cargando) {
    return (
      <div className="mapa-container">
        <h3 className="mapa-titulo">🌍 Cargando Mapa Coroplético...</h3>
        <div className="mapa-cargando">
          <p>Descargando datos geográficos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mapa-container">
      <h3 className="mapa-titulo">
        🌍 Mapa Coroplético de Felicidad</h3>
      
      <div className="mapa-wrapper">
        <MapContainer
          center={[20, 0]}
          zoom={2}
          minZoom={2}
          maxZoom={6}
          style={{ height: '500px', width: '100%' }}
          className="mapa-leaflet"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {/* GEOJSON REAL CON FORMAS DE PAÍSES */}
          {geoData && (
            <GeoJSON
              key={`geojson-${datos.length}`} // Re-render cuando cambien los datos
              data={geoData}
              style={estiloPais}
              onEachFeature={onEachCountry}
            />
          )}

          {/* Leyenda */}
          <div className="mapa-leyenda">
            <div className="leyenda-titulo">🎯 Niveles de Felicidad</div>
            <div className="leyenda-items">
              <div className="leyenda-item">
                <div className="leyenda-color" style={{ backgroundColor: '#FFC300' }}></div>
                <span>Muy Feliz (7.0+)</span>
              </div>
              <div className="leyenda-item">
                <div className="leyenda-color" style={{ backgroundColor: '#FF9505' }}></div>
                <span>Feliz (6.0-6.9)</span>
              </div>
              <div className="leyenda-item">
                <div className="leyenda-color" style={{ backgroundColor: '#F08080' }}></div>
                <span>Moderado (5.0-5.9)</span>
              </div>
              <div className="leyenda-item">
                <div className="leyenda-color" style={{ backgroundColor: '#97b0d1ff' }}></div>
                <span>Bajo (&lt;5.0)</span>
              </div>
              <div className="leyenda-item">
                <div className="leyenda-color" style={{ backgroundColor: '#F7FAFC', border: '1px dashed #CBD5E0' }}></div>
                <span>Sin datos</span>
              </div>
            </div>
          </div>
        </MapContainer>
      </div>

      {/* Información real del mapa */}
      <div className="mapa-info">
        <div className="mapa-estadisticas">
          <div className="estadisticas-lista">
            <span>Países en mapa: <strong>{geoData?.features?.length || 0}</strong></span>
            <span>Países con datos: <strong>{datos.length}</strong></span>
            <span>Cobertura: <strong>{((datos.length / (geoData?.features?.length || 1)) * 100).toFixed(1)}%</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapaCoropletico;