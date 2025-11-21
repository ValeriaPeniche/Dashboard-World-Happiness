import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const BarrasHorizontales = ({ datos = [], filtroAnio = '2024' }) => {
  const [datosProcesados, setDatosProcesados] = useState({ top10: [], bottom10: [] });

  // Función para obtener color según nivel de felicidad
  const getColorPorFelicidad = (felicidad) => {
    if (felicidad >= 7.0) return '#FFC300';  // Amarillo - Muy feliz
    if (felicidad >= 6.0) return '#FF9505';  // Naranja - Feliz
    if (felicidad >= 5.0) return '#F08080';  // Coral - Moderado
    return '#97b0d1ff';                        // Gris - Bajo
  };

  useEffect(() => {
    console.log('🔄 BarrasHorizontales - Datos recibidos:', datos);
    console.log('🎯 Filtro año:', filtroAnio);

    if (datos && datos.length > 0) {
      // Procesar datos reales del API - ahora incluyendo felicidad
      const datosValidos = datos.filter(item => 
        item.social_support !== null && 
        item.social_support !== undefined && 
        item.pais &&
        item.ladder_score !== null // Asegurar que tenemos datos de felicidad
      );

      console.log('✅ Datos válidos para barras:', datosValidos.length);

      const sorted = [...datosValidos].sort((a, b) => b.social_support - a.social_support);
      
      // Top 10 con color según felicidad
      const top10 = sorted.slice(0, 10).map(item => ({
        pais: item.pais,
        apoyo_social: parseFloat(item.social_support),
        felicidad: parseFloat(item.ladder_score), // Agregar felicidad para el color
        color: getColorPorFelicidad(parseFloat(item.ladder_score)) // Calcular color
      }));
      
      // Bottom 10 con color según felicidad
      const bottom10 = sorted.slice(-10).reverse().map(item => ({
        pais: item.pais,
        apoyo_social: parseFloat(item.social_support),
        felicidad: parseFloat(item.ladder_score), // Agregar felicidad para el color
        color: getColorPorFelicidad(parseFloat(item.ladder_score)) // Calcular color
      }));

      console.log('🏆 Top 10 con colores:', top10);
      console.log('📉 Bottom 10 con colores:', bottom10);
      
      setDatosProcesados({ top10, bottom10 });
    } else {
      // Datos de ejemplo si no hay datos reales - con colores según felicidad
      console.log('⚠️ Sin datos reales, usando ejemplo con colores de felicidad');
      setDatosProcesados({
        top10: [
          { pais: 'Islandia', apoyo_social: 0.95, felicidad: 7.5, color: '#FFC300' },
          { pais: 'Noruega', apoyo_social: 0.92, felicidad: 7.3, color: '#FFC300' },
          { pais: 'Finlandia', apoyo_social: 0.91, felicidad: 7.8, color: '#FFC300' },
          { pais: 'Dinamarca', apoyo_social: 0.90, felicidad: 7.6, color: '#FFC300' },
          { pais: 'Suecia', apoyo_social: 0.89, felicidad: 7.3, color: '#FFC300' }
        ],
        bottom10: [
          { pais: 'Afganistán', apoyo_social: 0.25, felicidad: 2.4, color: '#E2E8F0' },
          { pais: 'Sudán del Sur', apoyo_social: 0.28, felicidad: 3.0, color: '#E2E8F0' },
          { pais: 'República Centroafricana', apoyo_social: 0.30, felicidad: 3.2, color: '#E2E8F0' },
          { pais: 'Chad', apoyo_social: 0.32, felicidad: 4.0, color: '#F08080' },
          { pais: 'Burundi', apoyo_social: 0.34, felicidad: 3.8, color: '#E2E8F0' }
        ]
      });
    }
  }, [datos, filtroAnio]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload; // Datos completos del país
      return (
        <div style={{ 
          backgroundColor: 'white', 
          padding: '12px', 
          border: '1px solid #E2E8F0',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          fontSize: '14px',
          minWidth: '180px'
        }}>
          <p style={{ fontWeight: 'bold', margin: '0 0 8px 0', color: '#2D3748' }}>{label}</p>
          <p style={{ margin: '4px 0', color: '#4A5568' }}>
            Apoyo Social: <strong style={{ color: '#2D3748' }}>{payload[0].value?.toFixed(3)}</strong>
          </p>
          <p style={{ margin: '4px 0', color: '#4A5568' }}>
            Felicidad: <strong style={{ color: '#2D3748' }}>{data.felicidad?.toFixed(2)}</strong>
          </p>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            marginTop: '6px',
            padding: '4px 8px',
            backgroundColor: `${data.color}20`, // Color con transparencia
            borderRadius: '4px',
            border: `1px solid ${data.color}`
          }}>
            <div style={{
              width: '12px',
              height: '12px',
              backgroundColor: data.color,
              borderRadius: '2px'
            }}></div>
            <span style={{ fontSize: '12px', color: '#2D3748' }}>
              {data.felicidad >= 7 ? 'Muy Feliz' :
               data.felicidad >= 6 ? 'Feliz' :
               data.felicidad >= 5 ? 'Moderado' : 'Bajo'}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  // Componente de barra personalizada con color dinámico
  const CustomBar = (props) => {
    const { fill, x, y, width, height, payload } = props;
    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill={payload.color} // Usar el color calculado
          radius={[0, 4, 4, 0]}
        />
      </g>
    );
  };

  return (
    <div className="grafico-container">
      <h3>📊 Apoyo Social</h3>
      <p style={{ color: 'var(--color-texto-secundario)', fontSize: '0.8rem', marginBottom: '1rem' }}>
      </p>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', height: '400px' }}>
        {/* Top 10 */}
        <div style={{ height: '100%' }}>
          <h4 style={{ textAlign: 'center', color: '#2D3748', marginBottom: '1rem', fontSize: '1rem' }}>
            🏆 Top 10 - Mejor Apoyo
          </h4>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart
              data={datosProcesados.top10}
              layout="vertical"
              margin={{ top: 10, right: 10, left: 30, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f0f0f0" />
              <XAxis 
                type="number" 
                domain={[0, 1]}
                tick={{ fontSize: 11, fill: '#2D3748' }}
                tickFormatter={(value) => value.toFixed(2)}
              />
              <YAxis 
                type="category" 
                dataKey="pais" 
                tick={{ fontSize: 11, fill: '#2D3748' }}
                width={90}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="apoyo_social" 
                name="Apoyo Social"
                shape={<CustomBar />}
                radius={[0, 4, 4, 0]}
                barSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Bottom 10 */}
        <div style={{ height: '100%' }}>
          <h4 style={{ textAlign: 'center', color: '#2D3748', marginBottom: '1rem', fontSize: '1rem' }}>
            📉 Bottom 10 - Menor Apoyo
          </h4>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart
              data={datosProcesados.bottom10}
              layout="vertical"
              margin={{ top: 10, right: 50, left: 0, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f0f0f0" />
              <XAxis 
                type="number" 
                domain={[0, 1]}
                tick={{ fontSize: 11, fill: '#2D3748' }}
                tickFormatter={(value) => value.toFixed(2)}
              />
              <YAxis 
                type="category" 
                dataKey="pais" 
                tick={{ fontSize: 11, fill: '#2D3748' }}
                width={90}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="apoyo_social" 
                name="Apoyo Social"
                shape={<CustomBar />}
                radius={[0, 4, 4, 0]}
                barSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default BarrasHorizontales;