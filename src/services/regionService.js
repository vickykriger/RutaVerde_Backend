import { supabase } from '../config/supabase.js';

export async function obtenerRegionesConPlantasService() {
  try {
    const { data: regiones } = await supabase.from('Regiones').select('*');
    const { data: plantas } = await supabase.from('Plantas_Nativas').select('*');
    const { data: relaciones } = await supabase.from('Region_Planta').select('*');

    console.log("==========================================");
    console.log("🔍 DIAGNÓSTICO EN NAVEGADOR / TERMINAL:");
    console.log("1. Total Regiones:", regiones?.length);
    console.log("2. Total Plantas:", plantas?.length);
    console.log("3. Total Relaciones:", relaciones?.length);
    if (relaciones && relaciones.length > 0) {
      console.log("4. Estructura de 1 fila en Region_Planta:", relaciones[0]);
    } else {
      console.log("⚠️ ATENCIÓN: La tabla 'Region_Planta' no tiene ningún dato (0 filas).");
    }
    console.log("==========================================");

    // Adaptación ultra-flexible según los nombres de columna que existan
    const regionesFormateadas = (regiones || []).map(reg => {
      const regId = reg.id_region ?? reg.id ?? reg.id_ecorregion;

      const idsPlantas = (relaciones || [])
        .filter(rel => {
          const relRegId = rel.id_region ?? rel.region_id ?? rel.id_ecorregion;
          return String(relRegId) === String(regId);
        })
        .map(rel => rel.id_planta ?? rel.planta_id);

      const plantasDeReg = (plantas || []).filter(p => {
        const pId = p.id_planta ?? p.id;
        return idsPlantas.includes(pId);
      });

      return {
        id_region: regId,
        nombre: reg.nombre,
        plantas: plantasDeReg
      };
    });

    return { success: true, data: regionesFormateadas };
  } catch (err) {
    console.error("❌ Error en regionService:", err.message);
    return { success: false, error: err.message };
  }
}