import { obtenerRegionesConPlantasService } from '../services/regionService.js';

export const getRegiones = async (req, res) => {
  try {
    const resultado = await obtenerRegionesConPlantasService(); 
    console.log("➡️ Resultado enviado al frontend:", resultado);

    if (resultado && resultado.success) {
      return res.status(200).json(resultado.data);
    } else {
      return res.status(500).json({ success: false, error: resultado?.error || 'Error desconocido' });
    }
  } catch (error) {
    console.error("❌ Error en regionController:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
export async function obtenerRegiones(req, res) {
  const respuesta = await obtenerTodasLasRegionesService();
  
  if (!respuesta.success) {
    return res.status(500).json({ error: respuesta.error });
  }

  return res.json(respuesta.data);
}