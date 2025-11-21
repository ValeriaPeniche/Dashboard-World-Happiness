import React from 'react';
import KpiCard from './KpiCard';

const KpiPrincipal = ({ valor = "7.2" }) => {
  const contextoFelicidad = {
    bueno: 7.0,
    promedio: 5.5,
    escala: "0-10"
  };

  return (
    <KpiCard 
      titulo="Índice de Felicidad"
      valor={valor}
      descripcion="Score Global (0-10 escala)"
      tipo="principal"
      color="felicidad"
      contexto={contextoFelicidad}
    />
  );
};

export default KpiPrincipal;
