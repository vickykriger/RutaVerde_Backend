// obtenerRegiones.js
import { supabase } from './supabase.js';

export async function obtenerRegiones() {
  try {
    const { data, error } = await supabase
      .from('Regiones')
      .select('*');
    if (error) {
      console.error("Error al consultar la tabla Region:", error.message);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message };
  }
}