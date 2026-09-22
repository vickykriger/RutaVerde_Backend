import { obtenerRegionesConPlantasService, obtenerTodasLasRegionesService } from '../services/regionService.js';

export const getRegiones = async (req, res) => {
  try {
    const respuesta = await obtenerRegionesConPlantasService();
    if (!respuesta.success) {
      return res.status(500).json({ error: respuesta.error });
    }
    return res.json(respuesta.data);
  } catch (error) {
    console.error("❌ Error en getRegiones:", error);
    return res.status(500).json({ error: error.message });
  }
};

export const obtenerRegiones = async (req, res) => {
  try {
    const respuesta = await obtenerTodasLasRegionesService();
    if (!respuesta.success) {
      return res.status(500).json({ error: respuesta.error });
    }
    return res.json(respuesta.data);
  } catch (error) {
    console.error("❌ Error en obtenerRegiones:", error);
    return res.status(500).json({ error: error.message });
  }
};