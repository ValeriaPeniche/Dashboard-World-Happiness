import React from 'react';

const KpiCard = ({ titulo, valor, descripcion, tipo = 'secundario', color = 'datos-contraste', contexto = null }) => {
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

  // Determinar el indicador de calidad basado en el valor y contexto
  const getIndicadorCalidad = () => {
    if (!contexto || !valor) return null;
    
    const numValor = parseFloat(valor);
    if (isNaN(numValor)) return null;

    const { bueno, promedio } = contexto;
    
    if (numValor >= bueno) {
      return { texto: '👍 Alto', clase: 'kpi-bueno' };
    } else if (numValor >= promedio) {
      return { texto: '👉 Medio', clase: 'kpi-medio' };
    } else {
      return { texto: '👎 Bajo', clase: 'kpi-bajo' };
    }
  };

  const indicador = getIndicadorCalidad();

  return (
    <div className={`kpi-card ${getColorClass()}`}>
      <div className="kpi-content">
        <h3 className="kpi-titulo">{titulo}</h3>
        <div className={`kpi-valor ${getValorSize()}`}>{valor}</div>
        <p className="kpi-descripcion">{descripcion}</p>
        
        {/* Indicador de calidad */}
        {indicador && (
          <div className={`kpi-indicador ${indicador.clase}`}>
            {indicador.texto}
          </div>
        )}
      </div>
    </div>
  );
};

export default KpiCard;
