import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const GraficoLineas = () => {
  const [datosEvolucion, setDatosEvolucion] = useState([]);

  useEffect(() => {
    // Datos con TODAS las regiones y sus niveles promedio de felicidad
    const datosEjemplo = [
      { 
        año: 2015, 
        'Europa Occidental': 72.5, 
        'América Latina': 68.2, 
        'Asia del Este': 70.1, 
        'África Subsahariana': 55.3,
        'Norte América': 73.2,
        'Asia del Sur': 62.8,
        'Medio Oriente': 67.4,
        'Europa del Este': 69.8,
        'Sudeste Asiático': 66.5,
        'Oceanía': 74.1
      },
      { 
        año: 2016, 
        'Europa Occidental': 72.7, 
        'América Latina': 68.4, 
        'Asia del Este': 70.3, 
        'África Subsahariana': 55.8,
        'Norte América': 73.4,
        'Asia del Sur': 63.0,
        'Medio Oriente': 67.6,
        'Europa del Este': 70.0,
        'Sudeste Asiático': 66.7,
        'Oceanía': 74.3
      },
      { 
        año: 2017, 
        'Europa Occidental': 72.9, 
        'América Latina': 68.6, 
        'Asia del Este': 70.5, 
        'África Subsahariana': 56.2,
        'Norte América': 73.6,
        'Asia del Sur': 63.2,
        'Medio Oriente': 67.8,
        'Europa del Este': 70.2,
        'Sudeste Asiático': 66.9,
        'Oceanía': 74.5
      },
      { 
        año: 2018, 
        'Europa Occidental': 73.1, 
        'América Latina': 68.8, 
        'Asia del Este': 70.7, 
        'África Subsahariana': 56.6,
        'Norte América': 73.8,
        'Asia del Sur': 63.4,
        'Medio Oriente': 68.0,
        'Europa del Este': 70.4,
        'Sudeste Asiático': 67.1,
        'Oceanía': 74.7
      },
      { 
        año: 2019, 
        'Europa Occidental': 73.2, 
        'América Latina': 69.0, 
        'Asia del Este': 70.9, 
        'África Subsahariana': 57.0,
        'Norte América': 74.0,
        'Asia del Sur': 63.6,
        'Medio Oriente': 68.2,
        'Europa del Este': 70.6,
        'Sudeste Asiático': 67.3,
        'Oceanía': 74.9
      },
      { 
        año: 2020, 
        'Europa Occidental': 72.8, 
        'América Latina': 68.0, 
        'Asia del Este': 70.5, 
        'África Subsahariana': 56.0,
        'Norte América': 73.5,
        'Asia del Sur': 63.0,
        'Medio Oriente': 67.5,
        'Europa del Este': 70.0,
        'Sudeste Asiático': 66.8,
        'Oceanía': 74.5
      },
      { 
        año: 2021, 
        'Europa Occidental': 73.0, 
        'América Latina': 68.3, 
        'Asia del Este': 70.7, 
        'África Subsahariana': 56.4,
        'Norte América': 73.7,
        'Asia del Sur': 63.2,
        'Medio Oriente': 67.7,
        'Europa del Este': 70.2,
        'Sudeste Asiático': 67.0,
        'Oceanía': 74.7
      },
      { 
        año: 2022, 
        'Europa Occidental': 73.3, 
        'América Latina': 68.7, 
        'Asia del Este': 71.0, 
        'África Subsahariana': 56.9,
        'Norte América': 73.9,
        'Asia del Sur': 63.5,
        'Medio Oriente': 68.0,
        'Europa del Este': 70.5,
        'Sudeste Asiático': 67.3,
        'Oceanía': 75.0
      },
      { 
        año: 2023, 
        'Europa Occidental': 73.5, 
        'América Latina': 69.0, 
        'Asia del Este': 71.2, 
        'África Subsahariana': 57.3,
        'Norte América': 74.1,
        'Asia del Sur': 63.7,
        'Medio Oriente': 68.3,
        'Europa del Este': 70.7,
        'Sudeste Asiático': 67.5,
        'Oceanía': 75.2
      },
      { 
        año: 2024, 
        'Europa Occidental': 73.7, 
        'América Latina': 69.2, 
        'Asia del Este': 71.4, 
        'África Subsahariana': 57.7,
        'Norte América': 74.3,
        'Asia del Sur': 63.9,
        'Medio Oriente': 68.5,
        'Europa del Este': 70.9,
        'Sudeste Asiático': 67.7,
        'Oceanía': 75.4
      }
    ];
    setDatosEvolucion(datosEjemplo);
  }, []);

  // Niveles promedio de felicidad por región (2015-2024)
  const felicidadRegiones = {
    'Europa Occidental': 7.2,    // Muy Feliz - Amarillo
    'Norte América': 7.1,        // Muy Feliz - Amarillo  
    'Oceanía': 7.3,              // Muy Feliz - Amarillo
    'América Latina': 6.4,       // Feliz - Naranja
    'Asia del Este': 6.7,        // Feliz - Naranja
    'Europa del Este': 6.2,      // Feliz - Naranja
    'Medio Oriente': 5.8,        // Moderado - Coral
    'Sudeste Asiático': 5.5,     // Moderado - Coral
    'Asia del Sur': 4.3,         // Bajo - Gris
    'África Subsahariana': 4.1   // Bajo - Gris
  };

  // Función para obtener color según nivel de felicidad
  const getColorPorFelicidad = (region) => {
    const felicidad = felicidadRegiones[region];
    if (felicidad >= 7.0) return '#FFC300';  // Amarillo - Muy feliz
    if (felicidad >= 6.0) return '#FF9505';  // Naranja - Feliz
    if (felicidad >= 5.0) return '#F08080';  // Coral - Moderado
    return '#97b0d1ff';                        // Gris - Bajo
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.98)', 
          padding: '12px', 
          border: '1px solid #E2E8F0',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          backdropFilter: 'blur(10px)',
          minWidth: '200px'
        }}>
          <p style={{ 
            fontWeight: 'bold', 
            margin: '0 0 8px 0', 
            fontSize: '14px',
            color: '#2D3748',
            borderBottom: '1px solid #E2E8F0',
            paddingBottom: '4px'
          }}>
            {`Año: ${label}`}
          </p>
          {payload.map((entry, index) => (
            <p key={index} style={{ 
              color: '#4A5568',
              margin: '4px 0',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{
                  display: 'inline-block',
                  width: '12px',
                  height: '12px',
                  backgroundColor: entry.color,
                  marginRight: '8px',
                  borderRadius: '2px'
                }}></span>
                {entry.dataKey}
              </span>
              <span style={{ fontWeight: '600', color: '#2D3748' }}>
                {entry.value} años
              </span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Leyenda personalizada para niveles de felicidad
  const LeyendaFelicidad = () => (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      gap: '1rem', 
      marginTop: '1rem',
      flexWrap: 'wrap',
      padding: '0.75rem',
      backgroundColor: 'var(--color-fondo)',
      borderRadius: '8px',
      border: '1px solid var(--color-borde)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <div style={{ width: '16px', height: '16px', backgroundColor: '#FFC300', borderRadius: '4px' }}></div>
        <span style={{ fontSize: '0.8rem', color: '#2D3748' }}>Muy Feliz (7.0+)</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <div style={{ width: '16px', height: '16px', backgroundColor: '#FF9505', borderRadius: '4px' }}></div>
        <span style={{ fontSize: '0.8rem', color: '#2D3748' }}>Feliz (6.0-6.9)</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <div style={{ width: '16px', height: '16px', backgroundColor: '#F08080', borderRadius: '4px' }}></div>
        <span style={{ fontSize: '0.8rem', color: '#2D3748' }}>Moderado (5.0-5.9)</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <div style={{ width: '16px', height: '16px', backgroundColor: '#97b0d1ff', borderRadius: '4px' }}></div>
        <span style={{ fontSize: '0.8rem', color: '#2D3748' }}>Bajo (&lt;5.0)</span>
      </div>
    </div>
  );

  return (
    <div className="grafico-container">
      <h3>📈 Evolución de Esperanza de Vida por Región (2015-2024)</h3>
      <p style={{ color: 'var(--color-texto-secundario)', fontSize: '0.9rem', marginBottom: '1rem' }}>
        Los colores representan el nivel promedio de felicidad de cada región
      </p>
      
      <ResponsiveContainer width="100%" height={350}>
        <LineChart
          data={datosEvolucion}
          margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="año" 
            tick={{ fontSize: 12, fill: '#2D3748' }}
          />
          <YAxis 
            label={{ 
              value: 'Años Saludables', 
              angle: -90, 
              position: 'insideLeft',
              offset: -5,
              style: { fontSize: 12, fill: '#2D3748' }
            }}
            domain={[50, 80]}
            tick={{ fontSize: 12, fill: '#2D3748' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ 
              paddingTop: '10px',
              fontSize: '11px',
              color: '#2D3748'
            }}
          />
          
          {/* Líneas para cada región con colores según su felicidad */}
          {Object.keys(felicidadRegiones).map(region => (
            <Line 
              key={region}
              type="monotone" 
              dataKey={region} 
              stroke={getColorPorFelicidad(region)}
              strokeWidth={2.5}
              dot={{ fill: getColorPorFelicidad(region), strokeWidth: 1, r: 3 }}
              activeDot={{ r: 5, fill: getColorPorFelicidad(region) }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>

      {/* Leyenda de niveles de felicidad */}
      <LeyendaFelicidad />
      
    </div>
  );
};

export default GraficoLineas;