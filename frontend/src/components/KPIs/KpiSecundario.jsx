import React from 'react';
import KpiCard from './KpiCard';

const KpiSecundario = ({ 
  titulo, 
  valor, 
  descripcion, 
  color = 'datos-contraste',
  tendencia = null // 'up', 'down', o null
}) => {
  const getTendenciaIcon = () => {
    if (tendencia === 'up') return '↗';
    if (tendencia === 'down') return '↘';
    return '';
  };

  return (
    <KpiCard 
      titulo={titulo}
      valor={
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {valor}
          {tendencia && <span style={{ fontSize: '1.2rem' }}>{getTendenciaIcon()}</span>}
        </div>
      }
      descripcion={descripcion}
      color={color}
    />
  );
};

export default KpiSecundario;