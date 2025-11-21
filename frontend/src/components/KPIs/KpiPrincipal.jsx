import React from 'react';
import KpiCard from './KpiCard';

const KpiPrincipal = ({ valor = "5.531" }) => {
  const contextoFelicidad = {
    bueno: 6.5,
    promedio: 5.0,
    escala: "0-10",
    nota: "Finlandia: ~7.8 | Afganistán: ~2.4"
  };

  return (
    <KpiCard 
      titulo="Índice de Felicidad"
      valor={valor}
      descripcion="Puntuación global"
      tipo="principal"
      color="felicidad"
      contexto={contextoFelicidad}
    />
  );
};

export default KpiPrincipal;
