import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const GraficoDispersion = ({ datos = [] }) => {
  const getColor = (felicidad) => {
    if (felicidad >= 7) return '#FFC300';
    if (felicidad >= 6) return '#FF9505';
    if (felicidad >= 5) return '#F08080';
    return '#97b0d1ff';
  };

  return (
    <div className="grafico-container">
      <h3>📈 PIB vs Felicidad</h3>
      <ResponsiveContainer width="100%" height={590}>
        <ScatterChart data={datos}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            type="number" 
            dataKey="pib" 
            name="PIB" 
            label={{ value: 'PIB per cápita', position: 'insideBottom', offset: -5 }}
          />
          <YAxis 
            type="number" 
            dataKey="felicidad" 
            name="Felicidad" 
            label={{ value: 'Índice de Felicidad', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            cursor={{ strokeDasharray: '3 3' }}
            formatter={(value, name) => {
              if (name === 'pib') return [value.toFixed(3), 'PIB'];
              if (name === 'felicidad') return [value.toFixed(2), 'Felicidad'];
              return [value, name];
            }}
          />
          <Scatter name="Países" data={datos}>
            {datos.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColor(entry.felicidad)} />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
      {datos.length === 0 && (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
          No hay datos disponibles para los filtros seleccionados
        </div>
      )}
    </div>
  );
};

export default GraficoDispersion;