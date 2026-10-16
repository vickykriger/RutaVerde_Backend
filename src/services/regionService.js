import { supabase } from '../config/supabase.js';

export const getRegionesConPlantas = async () => {
  const { data, error } = await supabase
    .from('Regiones')
    .select(`
      id_region,
      nombre,
      paises,
      descripcion,
      bioma,
      Region_Planta (
        Plantas_Nativas (
          id_planta,
          nombre,
          descripcion,
          url_imagen
        )
      )
    `);

  if (error) throw new Error(error.message);

  if (!Array.isArray(data)) {
    return [];
  }

  return data.map(region => ({
    id_region: region.id_region,
    nombre: region.nombre,
    paises: region.paises,
    descripcion: region.descripcion,
    bioma: region.bioma,
    plantas: region.Region_Planta ? region.Region_Planta.map(rp => rp.Plantas_Nativas) : []
  }));
};