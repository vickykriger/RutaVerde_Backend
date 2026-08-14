// src/controllers/regionController.js
import { getRegionesConPlantas } from '../services/regionService.js';

export const obtenerRegiones = async (req, res) => {
  try {
    const regiones = await getRegionesConPlantas();
    res.status(200).json(regiones);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const getRegiones = async (req, res) => {
  try {
    const resultado = await obtenerRegionesService();
    if (resultado.success) {
      return res.status(200).json(resultado.data);
    } else {
      return res.status(500).json({ success: false, error: resultado.error });
    }
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};