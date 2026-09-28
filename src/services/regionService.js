import { supabase } from '../config/supabase.js';

export async function obtenerRegionesConPlantasService() {
  try {
    const { data, error } = await supabase
      .from('Regiones')
      .select(`
        id_region,
        nombre,
        Region_Planta (
          Plantas_Nativas (
            id_planta,
            nombre
          )
        )
      `)
      .order('nombre', { ascending: true }) // Muestra las regiones ordenadas alfabéticamente
      .range(0, 9999); // Garantiza traer todas las filas sin límite por defecto

    if (error) {
      console.error("❌ Error en Query de Supabase:", error.message);
      return { success: false, error: error.message };
    }

    const regionesFormateadas = (data || []).map(region => ({
      id_region: region.id_region,
      nombre: region.nombre,
      plantas: Array.isArray(region.Region_Planta)
        ? region.Region_Planta
            .map(rp => rp.Plantas_Nativas)
            .filter(Boolean)
        : []
    }));

    return { success: true, data: regionesFormateadas };
  } catch (err) {
    console.error("❌ Excepción en Service:", err.message);
    return { success: false, error: err.message };
  }
}

export async function obtenerTodasLasRegionesService() {
  try {
    const { data, error } = await supabase
      .from('Regiones')
      .select(`
        id_region,
        nombre,
        paises,
        descripcion,
        bioma,
        Baldosa ( id_region )
      `);

    if (error) {
      console.error("❌ Error de Supabase:", error.message);
      return { success: false, error: error.message };
    }

    const ecorregiones = (data || []).map((r) => ({
      id: r.id_region,
      nombre: r.nombre || '',
      paises: r.paises || 'América Latina',
      descripcion: r.descripcion || 'Sin descripción disponible.',
      resumen: r.descripcion || 'Sin descripción disponible.',
      bioma: r.bioma || 'Ecorregión',
      contribuciones: Array.isArray(r.Baldosa) ? r.Baldosa.length : 0
    }));

    return { success: true, data: ecorregiones };
  } catch (err) {
    console.error("❌ Excepción atrapada en Service:", err);
    return { success: false, error: err.message };
  }
}