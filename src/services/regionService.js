import { supabase } from '../config/supabase.js';

export async function obtenerRegionesConPlantasService() {
  try {
    const { data, error } = await supabase
      .from('Regiones')
      .select(`
        id_region,
        nombre,
        Region_Planta!inner (
          Plantas_Nativas (
            id_planta,
            nombre
          )
        )
      `);

    if (error) {
      console.error("❌ Error en Query de Supabase:", error.message);
      return { success: false, error: error.message };
    }

    const regionesFormateadas = data.map(region => ({
      id_region: region.id_region,
      nombre: region.nombre,
      plantas: region.Region_Planta
        ? region.Region_Planta.map(rp => rp.Plantas_Nativas).filter(Boolean)
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
      .select('id_region, nombre, paises, descripcion, bioma');

    if (error) throw error;

    const ecorregiones = (data || []).map((reg) => ({
      id: reg.id_region,
      nombre: reg.nombre || '',
      paises: reg.paises || 'América Latina',
      resumen: reg.descripcion || 'Sin descripción disponible.',
      bioma: reg.bioma || 'Ecorregión'
    }));

    return { success: true, data: ecorregiones };
  } catch (err) {
    console.error("❌ Error consultando Regiones:", err.message);
    return { success: false, error: err.message };
  }
}