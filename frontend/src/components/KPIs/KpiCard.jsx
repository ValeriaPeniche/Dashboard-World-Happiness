import React, { useState, useRef } from 'react';
import Tooltip from '../Layout/Tooltip';

const KpiCard = ({ titulo, valor, descripcion, tipo = 'secundario', color = 'datos-contraste', contexto = null }) => {
  const [mostrarTooltip, setMostrarTooltip] = useState(false);
  const [tooltipPosicion, setTooltipPosicion] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);
  
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

  // Determinar el indicador de calidad
  const getIndicadorCalidad = () => {
    if (!contexto || !valor) return null;
    
    const numValor = parseFloat(valor);
    if (isNaN(numValor)) return null;

    const { bueno, promedio } = contexto;
    
    if (numValor >= bueno) {
      return { texto: 'Alto', clase: 'kpi-indicador-texto bueno' };
    } else if (numValor >= promedio) {
      return { texto: 'Medio', clase: 'kpi-indicador-texto medio' };
    } else {
      return { texto: 'Bajo', clase: 'kpi-indicador-texto bajo' };
    }
  };

  const handleMouseEnter = (e) => {
    if (!contexto) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    // Posicionar tooltip a la derecha del KPI card
    setTooltipPosicion({
      x: rect.right + 10,
      y: rect.top
    });
    setMostrarTooltip(true);
  };

  const handleMouseLeave = () => {
    setMostrarTooltip(false);
  };

  const indicador = getIndicadorCalidad();

  // Contenido del tooltip
  const tooltipContenido = contexto ? (
    <div>
      <h4>📊 Escala de Referencia</h4>
      <div className="tooltip-rangos">
        <div className="rango-item">
          <span className="rango-color bueno"></span>
          <span><strong>Alto:</strong> ≥ {contexto.bueno}</span>
        </div>
        <div className="rango-item">
          <span className="rango-color medio"></span>
          <span><strong>Medio:</strong> {contexto.promedio} - {contexto.bueno}</span>
        </div>
        <div className="rango-item">
          <span className="rango-color bajo"></span>
          <span><strong>Bajo:</strong> &lt; {contexto.promedio}</span>
        </div>
      </div>
      {contexto.nota && (
        <p className="tooltip-nota">{contexto.nota}</p>
      )}
    </div>
  ) : null;

  return (
    <>
      <div 
        ref={cardRef}
        className={`kpi-card ${getColorClass()}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="kpi-content">
          <h3 className="kpi-titulo">{titulo}</h3>
          <div className={`kpi-valor ${getValorSize()}`}>{valor}</div>
          <p className="kpi-descripcion">{descripcion}</p>
          
          {/* Indicador de TEXTO */}
          {indicador && (
            <div className={indicador.clase}>
              {indicador.texto}
            </div>
          )}
        </div>
      </div>

      {/* Tooltip EXTERNO - se renderiza en el body */}
      <Tooltip 
        contenido={tooltipContenido}
        posicion={tooltipPosicion}
        mostrar={mostrarTooltip && contexto}
        elementoTrigger={cardRef.current}
      />
    </>
  );
};

export default KpiCard;