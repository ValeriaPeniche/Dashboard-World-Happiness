import React from 'react';
import KpiCard from './KpiCard';

const KpiPrincipal = ({ valor = "7.2" }) => {
  return (
    <KpiCard 
      titulo="Índice de Felicidad"
      valor={valor}
      descripcion="Score Global Promedio"
      tipo="principal"
      color="felicidad"
    />
  );
};

export default KpiPrincipal;