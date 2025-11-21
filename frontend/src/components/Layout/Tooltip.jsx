import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';

const Tooltip = ({ contenido, posicion, mostrar, elementoTrigger }) => {
  const tooltipRef = useRef(null);
  const [lado, setLado] = useState('derecha'); 

  useEffect(() => {
    if (mostrar && tooltipRef.current && elementoTrigger) {
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const triggerRect = elementoTrigger.getBoundingClientRect();
      const viewportWidth = window.innerWidth;

      // Verificar si cabe a la derecha
      const espacioDerecha = viewportWidth - triggerRect.right;
      const espacioIzquierda = triggerRect.left;

      // Decidir el lado basado en el espacio disponible
      const nuevoLado = espacioDerecha >= tooltipRect.width + 20 ? 'derecha' : 'izquierda';
      setLado(nuevoLado);

      // Calcular posición
      let x, y;
      
      if (nuevoLado === 'derecha') {
        x = triggerRect.right + 10;
      } else {
        x = triggerRect.left - tooltipRect.width - 10;
      }
      
      y = triggerRect.top;

      // Ajustar si se sale por arriba/abajo
      if (y < 10) y = 10;
      if (y + tooltipRect.height > window.innerHeight - 10) {
        y = window.innerHeight - tooltipRect.height - 10;
      }

      tooltipRef.current.style.left = `${x}px`;
      tooltipRef.current.style.top = `${y}px`;
    }
  }, [mostrar, posicion, elementoTrigger]);

  if (!mostrar) return null;

  return ReactDOM.createPortal(
    <div 
      ref={tooltipRef}
      className={`kpi-tooltip-externo tooltip-${lado}`}
      style={{
        position: 'fixed',
        zIndex: 10000,
        opacity: mostrar ? 1 : 0,
        transition: 'opacity 0.2s ease'
      }}
    >
      <div className="tooltip-content">
        {contenido}
      </div>
      {/* Flechita indicadora */}
      <div className={`tooltip-arrow arrow-${lado}`}></div>
    </div>,
    document.body
  );
};

export default Tooltip;