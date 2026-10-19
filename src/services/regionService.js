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

export const getRegionesPorPlanta = async (nombrePlanta) => {
  if (!nombrePlanta || !nombrePlanta.trim()) {
    return [];
  }

  const terminoBusqueda = `%${nombrePlanta.trim()}%`;

  // 1. Buscar la planta nativa permitiendo coincidencias parciales
  const { data: plantas, error: errorPlanta } = await supabase
    .from('Plantas_Nativas')
    .select('id_planta, nombre')
    .ilike('nombre', terminoBusqueda);

  if (errorPlanta || !plantas || plantas.length === 0) {
    return [];
  }

  // Extraer los IDs de las plantas encontradas
  const idsPlantas = plantas.map(p => p.id_planta);

  // 2. Obtener las ecorregiones asociadas a cualquiera de esas plantas
  const { data: relaciones, error: errorRelacion } = await supabase
    .from('Region_Planta')
    .select(`
      Regiones (
        id_region,
        nombre,
        paises,
        bioma
      )
    `)
    .in('id_planta', idsPlantas);

  if (errorRelacion || !relaciones) {
    return [];
  }

  // Mapear y remover duplicados de regiones
  const regiones = relaciones
    .map(r => r.Regiones)
    .filter(region => region !== null);

  const regionesUnicas = Array.from(
    new Map(regiones.map(reg => [reg.id_region, reg])).values()
  );

  return regionesUnicas;
};