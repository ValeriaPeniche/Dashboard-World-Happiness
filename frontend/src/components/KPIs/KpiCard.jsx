import React from 'react';

const KpiCard = ({ titulo, valor, descripcion, tipo = 'secundario', color = 'datos-contraste' }) => {
  const getColorClass = () => {
    if (tipo === 'principal') return 'bg-felicidad text-white';
    if (color === 'felicidad') return 'bg-felicidad text-white';
    if (color === 'datos-contraste') return 'bg-datos-contraste text-white';
    if (color === 'bienestar-social') return 'bg-bienestar-social text-white';
    return 'bg-tarjeta border-base';
  };

  const getValorSize = () => {
    return tipo === 'principal' ? 'kpi-valor-principal' : 'kpi-valor-secundario';
  };

  return (
    <div className={`kpi-card ${getColorClass()}`}>
      <div className="kpi-content">
        <h3 className="kpi-titulo">{titulo}</h3>
        <div className={`kpi-valor ${getValorSize()}`}>{valor}</div>
        <p className="kpi-descripcion">{descripcion}</p>
      </div>
    </div>
  );
};

export default KpiCard;