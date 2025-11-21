import React from 'react';
import KpiCard from './KpiCard';

const KpiSecundario = ({ 
  titulo, 
  valor, 
  descripcion, 
  color = 'datos-contraste',
  tipoMetrica = 'pib'
}) => {
  
  // Contextos MEJORADOS y explicados
  const getContexto = () => {
    const contextos = {
      pib: {
        bueno: 1.3,
        promedio: 1.0,
        escala: "log(GDP)",
        interpretacion: ">1.3 = Alto PIB\n1.0-1.3 = Medio PIB\n<1.0 = Bajo PIB"
      },
      social: {
        bueno: 0.85,
        promedio: 0.70, 
        escala: "0-1",
        interpretacion: ">0.85 = Alto apoyo\n0.70-0.85 = Medio apoyo\n<0.70 = Bajo apoyo"
      },
      vida: {
        bueno: 70,
        promedio: 60,
        escala: "años",
        interpretacion: ">70 años = Alta esperanza\n60-70 años = Media esperanza\n<60 años = Baja esperanza"
      },
      libertad: {
        bueno: 0.80,
        promedio: 0.65,
        escala: "0-1", 
        interpretacion: ">0.80 = Alta libertad\n0.65-0.80 = Media libertad\n<0.65 = Baja libertad"
      }
    };
    
    return contextos[tipoMetrica] || null;
  };

  const contexto = getContexto();
  
  // Descripción MEJORADA con tooltip
  const descripcionCompleta = (
    <span title={contexto?.interpretacion}>
      {descripcion} <small>({contexto?.escala})</small>
    </span>
  );

  return (
    <KpiCard 
      titulo={titulo}
      valor={valor}
      descripcion={descripcionCompleta}
      color={color}
      contexto={contexto}
    />
  );
};

export default KpiSecundario;
