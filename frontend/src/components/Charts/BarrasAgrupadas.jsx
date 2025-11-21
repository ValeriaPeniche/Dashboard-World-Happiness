import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const BarrasAgrupadas = ({ datos = [] }) => {
  const [datosProcesados, setDatosProcesados] = useState([]);

  useEffect(() => {
    console.log('🔍 DEBUG BarrasAgrupadas - datos recibidos:', datos);
    
    if (datos && datos.length > 0) {
      // Verificar estructura de datos
      const primerDato = datos[0];
      console.log('📊 Estructura del primer dato:', primerDato);
      
      // Buscar claves correctas
      const clavesDisponibles = Object.keys(primerDato);
      console.log('🔑 Claves disponibles:', clavesDisponibles);

      // Agrupar por región
      const regiones = {};
      
      datos.forEach(item => {
        if (!item.region) return;
        
        if (!regiones[item.region]) {
          regiones[item.region] = {
            region: item.region,
            libertad: 0,
            felicidad: 0,
            count: 0
          };
        }
        
        // Buscar valores dinámicamente
        const libertad = item.libertad || item.freedom_to_make_life_choices || item.libertad_promedio || 0;
        const felicidad = item.felicidad || item.ladder_score || item.felicidad_promedio || item.score || 0;
        
        regiones[item.region].libertad += parseFloat(libertad);
        regiones[item.region].felicidad += parseFloat(felicidad);
        regiones[item.region].count += 1;
      });

      // Calcular promedios
      const resultado = Object.values(regiones)
        .map(region => ({
          region: region.region.length > 20 ? region.region.substring(0, 20) + '...' : region.region,
          libertad: parseFloat((region.libertad / region.count).toFixed(3)),
          felicidad: parseFloat((region.felicidad / region.count).toFixed(2)),
          count: region.count
        }))
        .sort((a, b) => b.felicidad - a.felicidad);

      console.log('📈 Datos procesados:', resultado);
      setDatosProcesados(resultado);
    } else {
      console.log('⚠️ No hay datos, usando ejemplo');
      setDatosProcesados([]);
    }
  }, [datos]);

  // Datos de ejemplo
  const datosEjemplo = [
    { region: 'Europa Occidental', libertad: 0.85, felicidad: 7.2 },
    { region: 'Norte América', libertad: 0.82, felicidad: 6.9 },
    { region: 'América Latina', libertad: 0.75, felicidad: 6.2 },
    { region: 'Asia del Este', libertad: 0.68, felicidad: 5.8 },
    { region: 'Europa del Este', libertad: 0.65, felicidad: 5.6 },
    { region: 'Medio Oriente', libertad: 0.58, felicidad: 5.2 },
    { region: 'Asia del Sur', libertad: 0.52, felicidad: 4.5 },
    { region: 'África Subsahariana', libertad: 0.48, felicidad: 4.1 }
  ];

  const datosAUsar = datosProcesados.length > 0 ? datosProcesados : datosEjemplo;

  const CustomTooltip = ({ active, payload, label, escala }) => {
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
          }}>{`Región: ${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ 
              color: '#4A5568',
              margin: '4px 0',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span>
                {escala === 'felicidad' ? 'Felicidad' : 'Libertad'}
              </span>
              <span style={{ fontWeight: '600', color: '#2D3748' }}>
                {entry.value?.toFixed(escala === 'felicidad' ? 1 : 3)}
              </span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grafico-container">
      <h3>📋 Comparativa Regional: Libertad y Felicidad</h3>
      <p style={{ color: 'var(--color-texto-secundario)', fontSize: '0.8rem', marginBottom: '1rem' }}>
        Métricas separadas por escala para mejor interpretación
      </p>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', height: '350px' }}>
        
        {/* Gráfico de FELICIDAD (0-8) */}
        <div style={{ height: '100%' }}>
          <h4 style={{ textAlign: 'center', color: '#2D3748', marginBottom: '1rem', fontSize: '1rem' }}>
            😊 Felicidad (0-8)
          </h4>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart
              data={datosAUsar}
              margin={{ top: 20, right: 10, left: 10, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="region" 
                angle={-45}
                textAnchor="end"
                height={70}
                tick={{ fontSize: 10 }}
                interval={0}
                dy={8}
              />
              <YAxis 
                domain={[0, 8]}
                tick={{ fontSize: 11 }}
                width={30}
              />
              <Tooltip content={(props) => <CustomTooltip {...props} escala="felicidad" />} />
              <Bar 
                dataKey="felicidad" 
                name="Felicidad"
                fill="#FFC300"
                radius={[2, 2, 0, 0]}
                barSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de LIBERTAD (0-1) */}
        <div style={{ height: '100%' }}>
          <h4 style={{ textAlign: 'center', color: '#2D3748', marginBottom: '1rem', fontSize: '1rem' }}>
            🕊️ Libertad (0-1)
          </h4>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart
              data={datosAUsar}
              margin={{ top: 20, right: 10, left: 10, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="region" 
                angle={-45}
                textAnchor="end"
                height={70}
                tick={{ fontSize: 10 }}
                interval={0}
                dy={8}
              />
              <YAxis 
                domain={[0, 1]}
                tick={{ fontSize: 11 }}
                width={30}
                tickFormatter={(value) => value.toFixed(1)}
              />
              <Tooltip content={(props) => <CustomTooltip {...props} escala="libertad" />} />
              <Bar 
                dataKey="libertad" 
                name="Libertad"
                fill="#FF9505"
                radius={[2, 2, 0, 0]}
                barSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default BarrasAgrupadas;
