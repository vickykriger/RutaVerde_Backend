import { supabase } from '../config/supabase.js';

export async function obtenerRegionesConPlantasService() {
  try {
    // Le indicamos a Supabase la relación entre Regiones -> Region_Planta -> Plantas_Nativas
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

    // Formateamos la respuesta limpia devolviendo el arreglo de plantas
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