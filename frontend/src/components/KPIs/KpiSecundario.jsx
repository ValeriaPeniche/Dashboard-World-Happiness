import React from 'react';
import KpiCard from './KpiCard';

const KpiSecundario = ({ 
  titulo, 
  valor, 
  descripcion, 
  color = 'datos-contraste',
  tipoMetrica = 'pib'
}) => {
  
  const getContexto = () => {
    const contextos = {
      pib: {
        bueno: 10.5,  // Países desarrollados
        promedio: 9.5, // Países en desarrollo
        escala: "escala logarítmica",
      },
      social: {
        bueno: 0.90,
        promedio: 0.75,
        escala: "0-1",
      },
      vida: {
        bueno: 72,
        promedio: 65,
        escala: "años",
      },
      libertad: {
        bueno: 0.90,
        promedio: 0.70,
        escala: "0-1", 
      }
    };
    
    return contextos[tipoMetrica] || null;
  };

  const contexto = getContexto();

  return (
    <KpiCard 
      titulo={titulo}
      valor={valor}
      descripcion={descripcion}
      color={color}
      contexto={contexto}
    />
  );
};

export default KpiSecundario;
