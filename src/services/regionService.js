// src/services/regionService.js
import { supabase } from '../config/supabase.js';

export const getRegionesConPlantas = async () => {
  const { data, error } = await supabase
    .from('Region')
    .select(`
      id_region,
      nombre,
      Region_Planta (
        Planta (
          id_planta,
          nombre
        )
      )
    `);

  if (error) throw new Error(error.message);

  // Formateamos la respuesta para que las plantas queden en un arreglo limpio
  return data.map(region => ({
    id_region: region.id_region,
    nombre: region.nombre,
    plantas: region.Region_Planta.map(rp => rp.Planta)
  }));
};